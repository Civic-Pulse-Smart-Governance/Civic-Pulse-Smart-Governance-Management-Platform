import usePageMeta from '../../lib/usePageMeta';
import Card, { CardHeader } from '../../components/shared/Card';
import { Field, Input } from '../../components/shared/FormControls';
import Button from '../../components/shared/Button';

export default function OfficerChangePassword() {
  usePageMeta('Change Password', 'Update your account password');
  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader title="Change Password" subtitle="Choose a strong password you haven't used before." />
        <div className="space-y-4">
          <Field label="Current Password">
            <Input type="password" placeholder="Enter current password" />
          </Field>
          <Field label="New Password">
            <Input type="password" placeholder="Enter new password" />
          </Field>
          <Field label="Confirm New Password">
            <Input type="password" placeholder="Re-enter new password" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Update Password</Button>
        </div>
      </Card>
    </div>
  );
}
