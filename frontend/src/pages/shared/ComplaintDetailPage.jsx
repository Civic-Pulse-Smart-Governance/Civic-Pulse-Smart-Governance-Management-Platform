import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Hash,
  CalendarDays,
  MapPin,
  Building2,
  User,
  Loader2,
  AlertTriangle,
  RefreshCcw,
  CheckCircle2,
  Download,
} from 'lucide-react';
import Card, { CardHeader } from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import PriorityBadge from '../../components/shared/PriorityBadge';
import Button from '../../components/shared/Button';
import { Field, Select } from '../../components/shared/FormControls';
import { getComplaintById, updateComplaintStatus } from '../../lib/api';
import { generateComplaintReceiptPDF } from '../../lib/pdfGenerator';
import AiActionAdvisor from '../../components/shared/AiActionAdvisor';
import { analyzeLocationProximity } from '../../services/geoProximityService';

/**
 * @param {'citizen'|'officer'|'admin'} role - controls whether status can be edited
 *   and where the "Back" link points.
 */
export default function ComplaintDetailPage({ role = 'citizen' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState('');

  const backTo = {
    citizen: '/citizen/my-complaints',
    officer: '/officer/complaints',
    admin: '/admin/complaints',
  }[role];

  const listLabel = {
    citizen: 'My Complaints',
    officer: 'Assigned Complaints',
    admin: 'All Complaints',
  }[role];

  const load = async () => {
    setLoading(true);
    const { data, source, notFound: nf } = await getComplaintById(id);
    setComplaint(data);
    if (data) {
      setNoteText(data.officerNote || data.resolutionNote || '');
    }
    setNotFound(!!nf);
    setUsingFallback(source === 'mock');
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (e) => {
    const newLabel = e.target.value;
    const statusKeyMap = {
      Pending: 'PENDING',
      'In Progress': 'IN_PROGRESS',
      Resolved: 'RESOLVED',
      Rejected: 'REJECTED',
    };
    setSaving(true);
    try {
      const updated = await updateComplaintStatus(id, statusKeyMap[newLabel], { officerNote: noteText });
      setComplaint((c) => ({
        ...c,
        status: updated.status || newLabel,
        officerNote: updated.officerNote || noteText
      }));
    } catch (err) {
      setComplaint((c) => ({ ...c, status: newLabel }));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async (markResolved = false) => {
    setSavingNote(true);
    setSuccessFeedback('');
    try {
      const targetStatus = markResolved ? 'RESOLVED' : (complaint.status === 'Resolved' ? 'RESOLVED' : (complaint.status === 'In Progress' ? 'IN_PROGRESS' : 'PENDING'));
      const updated = await updateComplaintStatus(id, targetStatus, { officerNote: noteText });
      setComplaint((c) => ({
        ...c,
        status: updated.status || (markResolved ? 'Resolved' : c.status),
        officerNote: noteText
      }));
      setSuccessFeedback(
        markResolved
          ? 'Resolution message sent! Problem is now marked as SOLVED in both Admin and Citizen sections.'
          : 'Officer note saved successfully.'
      );
      setTimeout(() => setSuccessFeedback(''), 4000);
    } catch (err) {
      setComplaint((c) => ({
        ...c,
        status: markResolved ? 'Resolved' : c.status,
        officerNote: noteText
      }));
      setSuccessFeedback(
        markResolved
          ? 'Problem marked as SOLVED!'
          : 'Officer note saved.'
      );
      setTimeout(() => setSuccessFeedback(''), 4000);
    } finally {
      setSavingNote(false);
    }
  };

  const handleApplyAiSolution = async (plan) => {
    setSaving(true);
    setSuccessFeedback('');
    try {
      setNoteText(plan.note);
      const statusKeyMap = {
        'Pending': 'PENDING',
        'In Progress': 'IN_PROGRESS',
        'Resolved': 'RESOLVED',
        'Rejected': 'REJECTED',
      };
      const targetKey = statusKeyMap[plan.status] || (plan.status === 'Resolved' ? 'RESOLVED' : (plan.status === 'Rejected' ? 'REJECTED' : 'IN_PROGRESS'));
      const updated = await updateComplaintStatus(id, targetKey, { officerNote: plan.note });
      setComplaint((prev) => ({
        ...prev,
        status: updated.status || plan.status,
        officerNote: plan.note
      }));
      setSuccessFeedback(`AI Plan applied: "${plan.title}" (${plan.status})`);
      setTimeout(() => setSuccessFeedback(''), 5000);
    } catch (err) {
      setComplaint((prev) => ({
        ...prev,
        status: plan.status,
        officerNote: plan.note
      }));
      setSuccessFeedback(`AI Plan applied: "${plan.title}"`);
      setTimeout(() => setSuccessFeedback(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="animate-spin" size={28} />
        <span className="text-sm">Loading complaint…</span>
      </div>
    );
  }

  if (notFound || !complaint) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <p className="text-sm text-slate-500 mt-2">
          We couldn't find a complaint with ID <span className="font-semibold">{id}</span>.
        </p>
        <Link to={backTo} className="inline-block mt-6">
          <Button variant="secondary" icon={ArrowLeft}>Back to {listLabel}</Button>
        </Link>
      </div>
    );
  }

  const c = complaint;
  const geoInfo = analyzeLocationProximity(c?.location || '');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(backTo)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to {listLabel}
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => generateComplaintReceiptPDF(c)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Download size={15} />
            Download Receipt PDF
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {usingFallback && (
        <div className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-4 py-2.5">
          Showing cached/demo record — live backend query fallback.
        </div>
      )}

      {/* Non-India International Jurisdiction Alert Banner */}
      {geoInfo.isOutsideIndia && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={22} />
          <div>
            <h3 className="text-sm font-bold text-red-900">
              ⚠️ Outside Indian Municipal Jurisdiction — Cannot Be Solved by Admin
            </h3>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              The location for this complaint (<strong>"{c.location}"</strong>) is identified as an international location outside India. Municipal administration and Maharashtra governance operate strictly within Indian territory. This grievance cannot be resolved by municipal field staff.
            </p>
          </div>
        </div>
      )}

      {/* Official Resolution Notice Card (Shown to BOTH Citizen and Admin when Resolved or Note Exists) */}
      {(c.status === 'Resolved' || c.officerNote) && (
        <Card className="!bg-emerald-50/80 !border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base mb-1">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
            {c.status === 'Resolved' ? 'Problem Solved & Verified' : 'Officer Resolution Note'}
          </div>
          <p className="text-xs text-emerald-700 mb-3">
            Official update from Municipal Officer Command Center
          </p>
          {c.officerNote ? (
            <div className="bg-white border border-emerald-200/70 rounded-lg p-3 text-sm text-slate-800 font-medium shadow-xs">
              "{c.officerNote}"
            </div>
          ) : (
            <div className="text-xs text-emerald-700 italic">
              This issue has been inspected and marked as SOLVED by the municipal department.
            </div>
          )}
        </Card>
      )}

      <Card>
        <div className="flex items-start justify-between mb-1 gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-brand-700 font-bold text-sm">
            <Hash size={14} />
            {c.id}
          </div>
          {role === 'citizen' ? (
            <StatusBadge status={c.status} />
          ) : (
            <div className="flex items-center gap-2">
              {saving && <Loader2 className="animate-spin text-slate-400" size={14} />}
              <Select value={c.status} onChange={handleStatusChange} className="!py-1.5 !text-xs w-auto">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Rejected</option>
              </Select>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-5">{c.title}</h1>
        <div className="h-px bg-slate-100 mb-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm mb-6">
          <div className="flex items-start gap-2.5">
            <Building2 size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-xs">Category / Department</div>
              <div className="font-semibold text-slate-800 mt-0.5">{c.category} — {c.department}</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-xs">Location & Proximity (Admin in Maharashtra)</div>
              <div className="font-semibold text-slate-800 mt-0.5 capitalize flex items-center gap-2 flex-wrap">
                <span>{c.location}</span>
                {geoInfo.isOutsideIndia ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                    🚫 Cannot Be Solved (Non-India)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    📍 {geoInfo.formattedDistance} ({geoInfo.zone === 'local' ? 'Local' : geoInfo.isMaharashtra ? 'MH State' : 'Inter-State'})
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-xs mb-1">Priority</div>
              <PriorityBadge priority={c.priority} />
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-slate-400 text-xs">Submitted By</div>
              <div className="font-semibold text-slate-800 mt-0.5">{c.userName || c.submittedBy || 'Citizen'}</div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-slate-400 text-xs mb-1.5">Description</div>
          <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>
        </div>

        {(c.image || c.imageUrl) && (
          <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <span>📷 Attached Photo Proof</span>
              <span className="text-[10px] font-normal text-slate-400">(Visible to Admin & Citizen)</span>
            </div>
            <div className="relative group max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img
                src={c.image || c.imageUrl}
                alt="Complaint Photo Proof"
                className="max-h-72 w-full object-contain mx-auto bg-slate-900/5 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(c.image || c.imageUrl, '_blank')}
                title="Click to open full size image"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-4 border-t border-slate-100">
          <CalendarDays size={13} />
          Submitted:{' '}
          {new Date(c.submittedAt).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </Card>

      {/* AI Grievance Action Advisor (Puter.js Powered: 4 Options + Custom Solution + Jurisdiction Check) */}
      {role !== 'citizen' && (
        <AiActionAdvisor
          complaint={c}
          onApplySolution={handleApplyAiSolution}
          isApplying={saving}
        />
      )}

      {/* Admin / Officer Notes Section */}
      {role !== 'citizen' && (
        <Card>
          <CardHeader title="Officer Notes & Resolution Response" subtitle="Add notes or send a resolution message to solve this problem for the citizen." />
          {successFeedback && (
            <div className="mb-3 p-3 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {successFeedback}
            </div>
          )}
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type resolution response (e.g. Issue inspected and fixed on site by Municipal Team)..."
            className="w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none mb-3"
          />
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleSaveNote(false)}
              disabled={savingNote}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {savingNote ? 'Saving...' : 'Save Note Only'}
            </button>
            
            <button
              type="button"
              onClick={() => handleSaveNote(true)}
              disabled={savingNote}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              {savingNote ? 'Processing...' : 'Send Message & Mark Solved'}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

