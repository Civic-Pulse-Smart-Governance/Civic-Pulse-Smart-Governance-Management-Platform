import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Hourglass, RotateCw, CheckCircle2, XCircle, CalendarDays } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import { StatCardVertical } from '../../components/shared/StatCard';
import Card, { CardHeader } from '../../components/shared/Card';
import { getAllComplaints } from '../../lib/api';

const today = new Date();
const todayLabel = today.toLocaleDateString('en-US', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const OVERVIEW = [
  { label: 'Pending', color: 'bg-amber-400' },
  { label: 'In Progress', color: 'bg-violet-500' },
  { label: 'Resolved', color: 'bg-emerald-500' },
  { label: 'Rejected', color: 'bg-red-500' },
];

export default function AdminDashboard() {
  usePageMeta('Admin Dashboard', 'CivicPulse Management Portal');
  const [complaintList, setComplaintList] = useState([]);

  useEffect(() => {
    getAllComplaints().then(({ data }) => {
      if (Array.isArray(data)) {
        setComplaintList(data);
      }
    });
  }, []);

  const total = complaintList.length;
  const pending = complaintList.filter(c => (c.status || '').toLowerCase() === 'pending').length;
  const inProgress = complaintList.filter(c => (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'in progress' || (c.status || '').toLowerCase() === 'assigned').length;
  const resolved = complaintList.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
  const rejected = complaintList.filter(c => (c.status || '').toLowerCase() === 'rejected').length;

  const recent = complaintList.slice(0, 5);

  const overviewData = {
    Pending: pending,
    'In Progress': inProgress,
    Resolved: resolved,
    Rejected: rejected,
  };
  const maxOverview = Math.max(1, ...Object.values(overviewData));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin 👋</h2>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with CivicPulse today.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm self-start">
          <CalendarDays size={16} className="text-slate-400" />
          {todayLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCardVertical label="Total Complaints" value={total} caption="Live from MongoDB" icon={FileText} tone="blue" />
        <StatCardVertical label="Pending" value={pending} caption="Awaiting officer action" icon={Hourglass} tone="amber" />
        <StatCardVertical label="In Progress" value={inProgress} caption="Currently being handled" icon={RotateCw} tone="violet" />
        <StatCardVertical label="Resolved" value={resolved} caption="Successfully resolved" icon={CheckCircle2} tone="green" />
        <StatCardVertical label="Rejected" value={rejected} caption="Rejected complaints" icon={XCircle} tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Complaint Overview" action={<Link to="/admin/complaints" className="text-sm font-semibold text-brand-600 hover:underline">View Details →</Link>} />
          <div className="space-y-4">
            {OVERVIEW.map(({ label, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-800">{overviewData[label]}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${(overviewData[label] / maxOverview) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Activity" action={<Link to="/admin/complaints" className="text-sm font-semibold text-brand-600 hover:underline">View All</Link>} />
          <div className="space-y-4">
            {recent.map((c) => (
              <Link key={c.id || c.complaintId} to={`/admin/complaints/${c.id || c.complaintId}`} className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Hourglass size={15} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {c.id || c.complaintId} — {c.category}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {(c.status || 'Pending').toUpperCase()} · {c.userName || c.submittedBy || 'Citizen'}
                  </div>
                </div>
              </Link>
            ))}
            {recent.length === 0 && (
              <div className="text-sm text-slate-400 text-center py-6">No complaints filed yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

