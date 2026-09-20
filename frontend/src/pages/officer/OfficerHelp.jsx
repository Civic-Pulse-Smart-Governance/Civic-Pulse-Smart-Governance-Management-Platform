import { Mail, Phone, MessageCircle } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';

const CHANNELS = [
  { icon: Mail, label: 'Email Support', value: 'support@civicpulse.gov' },
  { icon: Phone, label: 'Phone Support', value: '+91 1800-123-4567' },
  { icon: MessageCircle, label: 'Live Chat', value: 'Available 9 AM – 6 PM' },
];

const FAQS = [
  { q: 'How do I mark a complaint as resolved?', a: 'Open the complaint from your list and update its status from the detail view.' },
  { q: 'How are complaints assigned to me?', a: 'Complaints are auto-routed to your department based on category, and can be reassigned by an admin.' },
  { q: 'Who do I contact for a wrong assignment?', a: 'Reach out to your department admin through the Reports section or contact support directly.' },
];

export default function OfficerHelp() {
  usePageMeta('Help & Support', 'Get help using the CivicPulse officer portal');
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CHANNELS.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="text-center">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
              <Icon size={20} />
            </div>
            <div className="text-sm font-semibold text-slate-800">{label}</div>
            <div className="text-xs text-slate-500 mt-1">{value}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Frequently Asked Questions" />
        <div className="divide-y divide-slate-100">
          {FAQS.map((f) => (
            <div key={f.q} className="py-4 first:pt-0 last:pb-0">
              <div className="text-sm font-semibold text-slate-800">{f.q}</div>
              <div className="text-sm text-slate-500 mt-1">{f.a}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
