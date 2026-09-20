import { Link } from 'react-router-dom';
import { Building2, UserCircle2, ShieldCheck, HardHat } from 'lucide-react';

const ROLES = [
  { to: '/citizen/dashboard', label: 'Citizen', desc: 'File and track civic complaints', icon: UserCircle2 },
  { to: '/officer/dashboard', label: 'Officer', desc: 'Manage assigned grievances', icon: HardHat },
  { to: '/admin/dashboard', label: 'Admin', desc: 'Full platform management', icon: ShieldCheck },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Civic<span className="text-brand-400">Pulse</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {ROLES.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl p-6 text-center transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-4">
                <Icon size={22} />
              </div>
              <div className="text-white font-bold text-lg">{label}</div>
              <div className="text-slate-400 text-sm mt-1.5">{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
