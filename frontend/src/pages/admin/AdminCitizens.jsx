import { Ban } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import Table, { Td } from '../../components/shared/Table';
import StatusBadge from '../../components/shared/StatusBadge';
import { citizens } from '../../data/mockData';

export default function AdminCitizens() {
  usePageMeta('Citizens', 'Registered citizen accounts');
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader title="All Citizens" subtitle={`${citizens.length} citizen(s) registered.`} />
        </div>
        <Table columns={['Citizen ID', 'Name', 'Email', 'Complaints Filed', 'Joined', 'Status', 'Action']}>
          {citizens.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
              <Td className="font-semibold text-brand-700">{c.id}</Td>
              <Td className="font-medium text-slate-800">{c.name}</Td>
              <Td className="text-slate-500">{c.email}</Td>
              <Td>{c.complaints}</Td>
              <Td className="text-slate-500">
                {new Date(c.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Td>
              <Td>
                <StatusBadge status={c.status} />
              </Td>
              <Td>
                <button className="text-slate-400 hover:text-red-600">
                  <Ban size={16} />
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
