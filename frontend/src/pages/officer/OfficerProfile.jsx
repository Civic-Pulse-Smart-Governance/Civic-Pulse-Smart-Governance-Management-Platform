import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import usePageMeta from '../../lib/usePageMeta';
import Card from '../../components/shared/Card';
import { Field, Input } from '../../components/shared/FormControls';
import Button from '../../components/shared/Button';
import { currentUser } from '../../data/mockData';

export default function OfficerProfile() {
  usePageMeta('My Profile', 'Manage your officer account details');

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user') || localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUser.officer;
  });

  const [form, setForm] = useState({
    name: user?.name || 'Officer',
    department: user?.department || 'Roads & Traffic Engineering',
    email: user?.email || 'officer@civicpulse.gov',
    phone: user?.phone || '+91 98765 43210',
    officerId: user?.officerId || 'OFFICER-101',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('civicpulse_user') || localStorage.getItem('user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setForm({
          name: u.name || 'Officer',
          department: u.department || 'Roads & Traffic Engineering',
          email: u.email || 'officer@civicpulse.gov',
          phone: u.phone || '+91 98765 43210',
          officerId: u.officerId || 'OFFICER-101',
        });
      } catch (e) {}
    }
  }, []);

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: form.name,
      department: form.department,
      email: form.email,
      phone: form.phone,
      officerId: form.officerId,
    };
    setUser(updated);
    localStorage.setItem('civicpulse_user', JSON.stringify(updated));
    localStorage.setItem('user', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const initials = (form.name || 'Officer')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        {savedSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            Officer profile details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{form.name}</div>
              <div className="text-sm text-slate-500">{form.department} · Officer ID: {form.officerId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name">
              <Input value={form.name} onChange={handleChange('name')} required />
            </Field>
            <Field label="Employee / Officer ID">
              <Input value={form.officerId} onChange={handleChange('officerId')} disabled />
            </Field>
            <Field label="Department">
              <Input value={form.department} onChange={handleChange('department')} />
            </Field>
            <Field label="Email Address">
              <Input value={form.email} onChange={handleChange('email')} type="email" required />
            </Field>
            <Field label="Phone Number">
              <Input value={form.phone} onChange={handleChange('phone')} />
            </Field>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
