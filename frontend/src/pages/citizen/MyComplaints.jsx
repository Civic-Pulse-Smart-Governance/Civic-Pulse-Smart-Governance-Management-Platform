import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileText, Plus, CheckCircle2 } from 'lucide-react';
import Button from '../../components/shared/Button';
import ComplaintCard from '../../components/citizen/ComplaintCard';
import { getAllComplaints } from '../../lib/api';

export default function MyComplaints() {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(!!location.state?.newComplaintId);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllComplaints().then(({ data }) => {
      if (Array.isArray(data)) {
        setMine(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <FileText className="text-brand-700 mt-0.5" size={26} />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Complaints</h2>
            <p className="text-sm text-slate-500 mt-0.5">View complaints that you have submitted.</p>
          </div>
        </div>
        <Link to="/citizen/register-complaint">
          <Button icon={Plus}>New Complaint</Button>
        </Link>
      </div>

      {showBanner && (
        <div className="flex items-center justify-between gap-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            Complaint registered successfully. Complaint Number:{' '}
            <span className="font-bold">{location.state?.newComplaintId || mine[0]?.id}</span>
          </span>
          <button onClick={() => setShowBanner(false)} className="text-emerald-600 hover:text-emerald-900 font-bold">
            ×
          </button>
        </div>
      )}

      <div className="space-y-5">
        {mine.map((c) => (
          <ComplaintCard key={c.id || c.complaintId} complaint={c} />
        ))}
        {!loading && mine.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            No complaints found. Submit a new grievance using the button above.
          </div>
        )}
      </div>
    </div>
  );
}

