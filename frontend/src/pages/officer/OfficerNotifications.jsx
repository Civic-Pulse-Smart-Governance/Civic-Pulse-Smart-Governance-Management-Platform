import { Bell } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import { notifications } from '../../data/mockData';

export default function OfficerNotifications() {
  usePageMeta('Notifications', 'Updates on complaints assigned to you');
  return (
    <div className="max-w-4xl mx-auto">
      <Card padding="p-0 pt-6">
        <div className="px-6">
          <CardHeader title="Notifications" subtitle="Stay up to date with complaint activity." />
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-6 py-4">
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  n.read ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'
                }`}
              >
                <Bell size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className={`text-sm ${n.read ? 'text-slate-500' : 'font-semibold text-slate-800'}`}>
                  {n.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{n.time}</div>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600 mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
