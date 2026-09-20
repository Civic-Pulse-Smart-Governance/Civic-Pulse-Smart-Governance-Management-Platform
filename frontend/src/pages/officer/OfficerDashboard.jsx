import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Hourglass, RotateCw, CheckCircle2 } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import { StatCardHorizontal } from '../../components/shared/StatCard';
import Card, { CardHeader } from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import { getAllComplaints } from '../../lib/api';

export default function OfficerDashboard() {
  const [userObj, setUserObj] = useState(null);
  const [complaintList, setComplaintList] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('civicpulse_user');
    if (storedUser) {
      try {
        setUserObj(JSON.parse(storedUser));
      } catch (e) {}
    }

    getAllComplaints().then(({ data }) => {
      if (Array.isArray(data)) {
        setComplaintList(data);
      }
    });
  }, []);

  usePageMeta('Dashboard', `Welcome back, ${userObj?.department || userObj?.name || 'Officer'}`);

  const total = complaintList.length;
  const pending = complaintList.filter(c => (c.status || '').toLowerCase() === 'pending').length;
  const inProgress = complaintList.filter(c => (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'in progress' || (c.status || '').toLowerCase() === 'assigned').length;
  const resolved = complaintList.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
  const recent = complaintList.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardHorizontal label="Total Assigned" value={total} icon={FileText} tone="blue" />
        <StatCardHorizontal label="Pending" value={pending} icon={Hourglass} tone="amber" />
        <StatCardHorizontal label="In Progress" value={inProgress} icon={RotateCw} tone="violet" />
        <StatCardHorizontal label="Resolved" value={resolved} icon={CheckCircle2} tone="green" />
      </div>

      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader title="Recent Complaints" subtitle="Latest grievances assigned to your department." />
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((c) => (
            <Link key={c.id || c.complaintId} to={`/officer/complaints/${c.id || c.complaintId}`} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.id || c.complaintId} · {c.category}</div>
              </div>
              <StatusBadge status={c.status} />
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">
              No assigned complaints found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

