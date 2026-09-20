import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Hourglass, CheckCircle2, Plus } from 'lucide-react';
import { StatCardHorizontal } from '../../components/shared/StatCard';
import Card, { CardHeader } from '../../components/shared/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import Button from '../../components/shared/Button';
import { getAllComplaints } from '../../lib/api';
import Services from '../../components/Services';
import Contact from '../../components/Contact';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [complaintList, setComplaintList] = useState([]);
  const [userObj, setUserObj] = useState(null);

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

  const total = complaintList.length;
  const pending = complaintList.filter(c => (c.status || '').toLowerCase() === 'pending' || (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'in progress').length;
  const resolved = complaintList.filter(c => (c.status || '').toLowerCase() === 'resolved').length;
  const recent = complaintList.slice(0, 5);

  const handleSelectCategory = (categoryId) => {
    navigate('/citizen/register-complaint', { state: { category: categoryId } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {userObj?.name || 'Citizen'} 👋</h2>
          <p className="text-sm text-slate-500 mt-1">Here's an overview of your civic complaints and portal services.</p>
        </div>
        <Link to="/citizen/register-complaint">
          <Button icon={Plus}>New Complaint</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCardHorizontal label="Total Complaints" value={total} icon={FileText} tone="blue" />
        <StatCardHorizontal label="Pending & In-Progress" value={pending} icon={Hourglass} tone="amber" />
        <StatCardHorizontal label="Resolved" value={resolved} icon={CheckCircle2} tone="green" />
      </div>

      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader title="Recent Complaints" subtitle="Your latest submissions." />
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((c) => (
            <Link key={c.id || c.complaintId} to={`/citizen/complaints/${c.id || c.complaintId}`} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.id || c.complaintId} · {c.category}</div>
              </div>
              <StatusBadge status={c.status} />
            </Link>
          ))}
          {recent.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">
              No complaints filed yet. Click "New Complaint" to file a grievance.
            </div>
          )}
        </div>
      </Card>

      {/* Issue Categories Section */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
        <Services onOpenFileModal={handleSelectCategory} />
      </div>

      {/* Helpdesk & Support Center Section */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
        <Contact />
      </div>
    </div>
  );
}

