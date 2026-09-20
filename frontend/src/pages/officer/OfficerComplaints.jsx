import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, FileText, Hourglass, RotateCw, CheckCircle2, Eye, Download } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import useComplaintFilters from '../../lib/useComplaintFilters';
import { StatCardHorizontal } from '../../components/shared/StatCard';
import Card, { CardHeader } from '../../components/shared/Card';
import FilterBar from '../../components/shared/FilterBar';
import Table, { Td } from '../../components/shared/Table';
import StatusBadge from '../../components/shared/StatusBadge';
import Button from '../../components/shared/Button';
import { getAllComplaints } from '../../lib/api';
import { generateComplaintReceiptPDF } from '../../lib/pdfGenerator';

export default function OfficerComplaints() {
  usePageMeta('Complaints', 'View and manage assigned civic grievances');
  const [complaintList, setComplaintList] = useState([]);

  const loadData = () => {
    getAllComplaints().then(({ data }) => {
      if (Array.isArray(data)) {
        setComplaintList(data);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const total = complaintList.length;
  const pending = complaintList.filter(c => (c.status || '').toLowerCase() === 'pending').length;
  const inProgress = complaintList.filter(c => (c.status || '').toLowerCase() === 'in-progress' || (c.status || '').toLowerCase() === 'in progress' || (c.status || '').toLowerCase() === 'assigned').length;
  const resolved = complaintList.filter(c => (c.status || '').toLowerCase() === 'resolved').length;

  const { filters, onChange, onReset, filtered } = useComplaintFilters(complaintList);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-xs font-bold tracking-wider text-brand-600 uppercase mb-1">
            Grievance Management
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Assigned Complaints</h2>
          <p className="text-sm text-slate-500 mt-1">View, track and manage complaints assigned to you.</p>
        </div>
        <Button variant="secondary" icon={RefreshCcw} size="sm" className="self-start" onClick={loadData}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardHorizontal label="Total" value={total} icon={FileText} tone="blue" />
        <StatCardHorizontal label="Pending" value={pending} icon={Hourglass} tone="amber" />
        <StatCardHorizontal label="In Progress" value={inProgress} icon={RotateCw} tone="violet" />
        <StatCardHorizontal label="Resolved" value={resolved} icon={CheckCircle2} tone="green" />
      </div>

      <Card>
        <CardHeader title="Find Complaints" subtitle="Search and filter your assigned grievances." />
        <FilterBar filters={filters} onChange={onChange} onReset={onReset} />
      </Card>

      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader title="Complaint List" subtitle="Complaints currently assigned to you." />
        </div>
        <Table columns={['Complaint ID', 'Category', 'Location', 'Priority', 'Submitted', 'Status', 'Action']}>
          {filtered.map((c) => (
            <tr key={c.id || c.complaintId} className="hover:bg-slate-50/70 transition-colors">
              <Td className="font-semibold text-brand-700">{c.id || c.complaintId}</Td>
              <Td>{c.category}</Td>
              <Td className="capitalize">{c.location || 'Not Specified'}</Td>
              <Td>
                <span className="text-xs font-bold text-slate-500">{c.priority || c.urgency || 'MEDIUM'}</span>
              </Td>
              <Td className="text-slate-500">
                {new Date(c.submittedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Link to={`/officer/complaints/${c.id || c.complaintId}`} className="text-slate-400 hover:text-brand-600 inline-flex" title="View Details">
                    <Eye size={17} />
                  </Link>
                  <button
                    onClick={() => generateComplaintReceiptPDF(c)}
                    className="text-slate-400 hover:text-brand-600 inline-flex cursor-pointer"
                    title="Download Receipt PDF"
                  >
                    <Download size={17} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <Td className="text-center text-slate-400 py-10" colSpan={7}>
                No complaints match your filters.
              </Td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  );
}

