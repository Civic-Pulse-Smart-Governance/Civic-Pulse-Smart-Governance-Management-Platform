import { Bell } from 'lucide-react';
import Card, { CardHeader } from '../../components/shared/Card';
import { notifications } from '../../data/mockData';

export default function CitizenNotifications() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5">
        <Bell className="text-brand-700" size={26} />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-0.5">Updates on your submitted complaints.</p>
        </div>
      </div>

      <Card padding="p-0 pt-2">
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
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
