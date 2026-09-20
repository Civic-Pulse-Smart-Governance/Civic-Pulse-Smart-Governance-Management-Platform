import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  FileText,
  Bell,
  UserCircle2,
  ShieldCheck,
  LifeBuoy,
  LogOut,
  Building2,
} from 'lucide-react';
import { currentUser, statusCounts, complaints, notifications } from '../../data/mockData';

const MAIN_NAV = [
  { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/officer/complaints', label: 'Complaints', icon: FileText, badgeKey: 'complaints' },
  { to: '/officer/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' },
];

const ACCOUNT_NAV = [
  { to: '/officer/profile', label: 'My Profile', icon: UserCircle2 },
  { to: '/officer/change-password', label: 'Change Password', icon: ShieldCheck },
  { to: '/officer/help', label: 'Help & Support', icon: LifeBuoy },
];

function NavSection({ title, items, badges }) {
  return (
    <div className="mb-6">
      {title && (
        <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map(({ to, label, icon: Icon, badgeKey }) => {
          const count = badgeKey ? badges[badgeKey] : 0;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={17} strokeWidth={2} />
                {label}
              </span>
              {!!count && (
                <span className="text-[11px] font-bold bg-white/15 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default function OfficerSidebar() {
  const navigate = useNavigate();
  const user = currentUser.officer;
  const badges = {
    complaints: statusCounts(complaints).total,
    notifications: notifications.filter((n) => !n.read).length,
  };

  const handleLogout = () => {
    localStorage.removeItem('civicpulse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('civicpulse_user');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-navy-950 text-white h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-5">
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <Building2 size={18} />
        </div>
        <div>
          <div className="font-bold text-[15px] leading-none">CivicPulse</div>
          <div className="text-[11px] text-slate-400 mt-1">Smart Governance</div>
        </div>
      </div>

      <div className="mx-4 mb-6 mt-1 flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-bold shrink-0">
          {user.initials}
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">{user.role}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto scrollbar-none">
        <NavSection title="Main Menu" items={MAIN_NAV} badges={badges} />
        <NavSection title="Account" items={ACCOUNT_NAV} badges={badges} />
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
