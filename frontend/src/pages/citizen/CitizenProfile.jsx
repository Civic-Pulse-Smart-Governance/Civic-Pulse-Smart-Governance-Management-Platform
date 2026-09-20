import { useEffect, useState } from 'react';
import { UserCircle2, CheckCircle2 } from 'lucide-react';
import Card from '../../components/shared/Card';
import { Field, Input } from '../../components/shared/FormControls';
import Button from '../../components/shared/Button';
import { currentUser } from '../../data/mockData';

export default function CitizenProfile() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user') || localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUser.citizen;
  });

  const [form, setForm] = useState({
    name: user?.name || 'Citizen User',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+91 98765 43210',
    city: user?.city || 'Chennai',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('civicpulse_user') || localStorage.getItem('user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setForm({
          name: u.name || 'Citizen User',
          email: u.email || 'user@example.com',
          phone: u.phone || '+91 98765 43210',
          city: u.city || 'Chennai',
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
      email: form.email,
      phone: form.phone,
      city: form.city,
    };
    setUser(updated);
    setForm({
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      city: updated.city,
    });
    localStorage.setItem('civicpulse_user', JSON.stringify(updated));
    localStorage.setItem('user', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const initials = (form.name || 'Citizen')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5">
        <UserCircle2 className="text-brand-700" size={26} />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your account details and contact information.</p>
        </div>
      </div>

      <Card>
        {savedSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            Profile changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-700 text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{form.name}</div>
              <div className="text-sm text-slate-500">{form.email} · Citizen</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name">
              <Input value={form.name} onChange={handleChange('name')} required />
            </Field>
            <Field label="Email Address">
              <Input value={form.email} onChange={handleChange('email')} type="email" required />
            </Field>
            <Field label="Phone Number">
              <Input value={form.phone} onChange={handleChange('phone')} />
            </Field>
            <Field label="City / Region">
              <Input value={form.city} onChange={handleChange('city')} />
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
