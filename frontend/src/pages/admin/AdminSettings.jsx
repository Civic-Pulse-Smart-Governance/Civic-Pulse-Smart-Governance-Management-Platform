import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import { Field, Input, Select } from '../../components/shared/FormControls';
import Button from '../../components/shared/Button';

export default function AdminSettings() {
  usePageMeta('Settings', 'Platform configuration');
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader title="General Settings" subtitle="Basic platform configuration." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Platform Name">
            <Input defaultValue="CivicPulse" />
          </Field>
          <Field label="Support Email">
            <Input defaultValue="support@civicpulse.gov" type="email" />
          </Field>
          <Field label="Default Complaint Priority">
            <Select defaultValue="MEDIUM">
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </Select>
          </Field>
          <Field label="Auto-assign Complaints">
            <Select defaultValue="Enabled">
              <option>Enabled</option>
              <option>Disabled</option>
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Notification Preferences" subtitle="Control system-wide notification behavior." />
        <div className="space-y-3">
          {['Email notifications for new complaints', 'SMS alerts for high priority issues', 'Weekly summary reports to admins'].map((label) => (
            <label key={label} className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              {label}
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
