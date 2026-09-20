import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, Camera, Upload, Trash2, Loader2, AlertTriangle, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import Card from '../../components/shared/Card';
import { Field, Input, Select, Textarea } from '../../components/shared/FormControls';
import Button from '../../components/shared/Button';
import { categories, priorities, currentUser } from '../../data/mockData';
import { createComplaint } from '../../lib/api';
import { compressImageFile } from '../../lib/imageCompressor';
import { analyzeLocationProximity, verifyLocationWithPuterAI } from '../../services/geoProximityService';

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    category: categories[0],
    priority: 'MEDIUM',
    location: '',
    description: '',
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');
  const [geoAnalysis, setGeoAnalysis] = useState(null);
  const [isAnalyzingGeo, setIsAnalyzingGeo] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Puter.js AI Location Verification Hook
  useEffect(() => {
    const loc = form.location.trim();
    if (!loc) {
      setGeoAnalysis(null);
      setIsAnalyzingGeo(false);
      return;
    }

    // Instant local baseline
    const instant = analyzeLocationProximity(loc);
    setGeoAnalysis(instant);

    // Debounced Puter.js AI deep verification
    setIsAnalyzingGeo(true);
    const timer = setTimeout(async () => {
      try {
        const verified = await verifyLocationWithPuterAI(loc);
        if (verified) {
          setGeoAnalysis(verified);
        }
      } catch (err) {
        console.warn('Puter AI location verification error:', err);
      } finally {
        setIsAnalyzingGeo(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.location]);

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setCompressing(true);
    try {
      const dataUrl = await compressImageFile(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err) {
      setError('Failed to process image: ' + err.message);
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if verification is in progress
    if (geoAnalysis?.pendingVerification || isAnalyzingGeo) {
      setError('Please wait a moment while the location is being verified on the map.');
      return;
    }

    // Check if location exists
    if (geoAnalysis?.exists === false) {
      setError(
        `Cannot submit complaint: Location "${form.location}" does not exist on the map. Please verify spelling or enter a valid city or place.`
      );
      return;
    }

    // Check if location is outside India
    if (geoAnalysis?.isOutsideIndia || geoAnalysis?.canBeSolved === false) {
      setError(
        `Cannot submit complaint: Location "${form.location}" is identified as outside India (${geoAnalysis.detectedCountry || 'International'}). Indian municipal and Maharashtra state administration hold no legal or operational jurisdiction abroad.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const created = await createComplaint({
        title: form.title,
        category: form.category,
        department: form.category.toUpperCase().replace(/\s+/g, '_'),
        priority: form.priority,
        location: form.location,
        description: form.description,
        image: form.image,
        submittedBy: currentUser.citizen.name,
      });
      navigate('/citizen/my-complaints', { state: { newComplaintId: created.id } });
    } catch (err) {
      const id = `CP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
        .toString(16)
        .slice(2, 8)
        .toUpperCase()}`;
      navigate('/citizen/my-complaints', { state: { newComplaintId: id } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5">
        <FilePlus2 className="text-brand-700" size={26} />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Register Complaint</h2>
          <p className="text-sm text-slate-500 mt-0.5">Report a civic issue to the concerned department.</p>
        </div>
      </div>

      <Card>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Complaint Title">
            <Input
              required
              placeholder="e.g. Street light not working"
              value={form.title}
              onChange={update('title')}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Select value={form.category} onChange={update('category')}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onChange={update('priority')}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </Select>
            </Field>
          </div>

          <Field label="Location">
            <Input
              required
              placeholder="e.g. Pune, Mumbai, Dadar, Chennai, New Jersey, etc."
              value={form.location}
              onChange={update('location')}
            />
            {form.location && geoAnalysis && (
              <div className="mt-2 text-xs">
                {geoAnalysis.pendingVerification || (isAnalyzingGeo && geoAnalysis.exists === null) ? (
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-blue-600" />
                      <span>Checking if place exists on map and verifying Indian jurisdiction...</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                      API Verifying
                    </span>
                  </div>
                ) : geoAnalysis.exists === false ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <div className="font-bold text-xs text-amber-900 flex items-center gap-2">
                        <span>⚠️ Place Does Not Exist on Map</span>
                        <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-semibold">
                          Unrecognized Place
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Location <strong className="text-amber-950">"{form.location}"</strong> could not be verified on the geographic map. Please check the spelling or enter a recognized city, town, or locality.
                      </p>
                    </div>
                  </div>
                ) : geoAnalysis.isOutsideIndia ? (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 flex items-start gap-2.5">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600" />
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-red-900 flex items-center gap-2 flex-wrap">
                        <span>🚫 Outside Indian Jurisdiction — Cannot Be Solved by Admin</span>
                        {geoAnalysis.detectedCountry && (
                          <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">
                            {geoAnalysis.detectedCountry}
                          </span>
                        )}
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 font-semibold flex items-center gap-1">
                          <Sparkles size={10} className="text-red-500" />
                          API Verified
                        </span>
                      </div>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Location <strong className="text-red-900">"{form.location}"</strong> is identified in {geoAnalysis.detectedCountry || 'an international territory'} outside India. Indian municipal bodies and Maharashtra administration have no legal or operational authority abroad. This grievance cannot be resolved by municipal administration.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-brand-600" />
                      <span>
                        Distance from Maharashtra HQ: <strong className="text-slate-900">{geoAnalysis.formattedDistance}</strong> ({geoAnalysis.zoneLabel})
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      {isAnalyzingGeo ? <Loader2 size={10} className="animate-spin text-emerald-600" /> : <CheckCircle2 size={10} />}
                      Verified in India
                    </span>
                  </div>
                )}
              </div>
            )}
          </Field>

          <Field label="Description">
            <Textarea
              required
              rows={4}
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={update('description')}
            />
          </Field>

          <Field label="Upload Photo Proof (Optional)">
            {form.image ? (
              <div className="relative inline-block w-full text-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <img
                  src={form.image}
                  alt="Photo Proof Preview"
                  className="max-h-48 max-w-full rounded-lg object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                  title="Remove Photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-5 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {compressing ? (
                  <div className="flex items-center gap-2 text-sm text-brand-600">
                    <Loader2 className="animate-spin" size={18} />
                    Processing image...
                  </div>
                ) : (
                  <>
                    <Upload className="text-brand-600 mb-1" size={24} />
                    <span className="text-sm font-semibold text-slate-800">
                      Click to upload photo proof
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      Supports JPEG, PNG, WebP (Max 5MB)
                    </span>
                  </>
                )}
              </label>
            )}
          </Field>

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={submitting || compressing}>
              {submitting ? 'Submitting…' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

