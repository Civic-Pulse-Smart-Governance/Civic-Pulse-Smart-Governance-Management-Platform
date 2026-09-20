import { FileBarChart2, Download } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { complaints, statusCounts } from '../../data/mockData';

function departmentBreakdown() {
  const map = {};
  complaints.forEach((c) => {
    map[c.department] = (map[c.department] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function AdminReports() {
  usePageMeta('Reports', 'Complaint analytics and department performance');
  const counts = statusCounts(complaints);
  const byDept = departmentBreakdown();
  const maxDept = Math.max(1, ...byDept.map(([, v]) => v));
  const resolutionRate = counts.total ? Math.round((counts.resolved / counts.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-slate-500">Total Complaints</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{counts.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Resolution Rate</div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{resolutionRate}%</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Avg. Priority</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">Medium</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Departments</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{byDept.length}</div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Complaints by Department"
          subtitle="Distribution of complaints across departments."
          action={
            <Button variant="secondary" size="sm" icon={Download}>
              Export
            </Button>
          }
        />
        <div className="space-y-4">
          {byDept.map(([dept, count]) => (
            <div key={dept}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-slate-600 capitalize">{dept.toLowerCase()}</span>
                <span className="font-semibold text-slate-800">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${(count / maxDept) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-center gap-3 text-slate-500 text-sm">
        <FileBarChart2 size={18} />
        Detailed exportable reports will populate here once connected to the live backend.
      </Card>
    </div>
  );
}
