import { Plus, Pencil } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import Table, { Td } from '../../components/shared/Table';
import StatusBadge from '../../components/shared/StatusBadge';
import Button from '../../components/shared/Button';
import { officers } from '../../data/mockData';

export default function AdminOfficers() {
  usePageMeta('Officers', 'Manage department officers and assignments');
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader
            title="All Officers"
            subtitle={`${officers.length} officer(s) registered.`}
            action={<Button icon={Plus} size="sm">Add Officer</Button>}
          />
        </div>
        <Table columns={['Officer ID', 'Name', 'Department', 'Email', 'Assigned', 'Status', 'Action']}>
          {officers.map((o) => (
            <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
              <Td className="font-semibold text-brand-700">{o.id}</Td>
              <Td className="font-medium text-slate-800">{o.name}</Td>
              <Td>{o.department}</Td>
              <Td className="text-slate-500">{o.email}</Td>
              <Td>{o.assigned}</Td>
              <Td>
                <StatusBadge status={o.status} />
              </Td>
              <Td>
                <button className="text-slate-400 hover:text-brand-600">
                  <Pencil size={16} />
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
