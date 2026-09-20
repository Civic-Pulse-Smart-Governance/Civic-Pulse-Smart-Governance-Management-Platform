import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  FileText,
  Users,
  UserCog,
  ClipboardList,
  Settings,
  CircleUserRound,
  LogOut,
} from 'lucide-react';

const MAIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/admin/complaints', label: 'Complaints', icon: FileText },
  { to: '/admin/officers', label: 'Officers', icon: UserCog },
  { to: '/admin/citizens', label: 'Citizens', icon: Users },
];

const MANAGEMENT_NAV = [
  { to: '/admin/reports', label: 'Reports', icon: ClipboardList },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/profile', label: 'Profile', icon: CircleUserRound },
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon size={17} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function AdminSidebar() {
  const navigate = useNavigate();

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
        <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center font-extrabold text-sm shrink-0">
          CP
        </div>
        <span className="font-bold text-[17px]">
          Civic<span className="text-brand-400">Pulse</span>
        </span>
      </div>

      <nav className="flex-1 px-3 pt-2 overflow-y-auto scrollbar-none">
        <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Main Menu
        </div>
        <div className="space-y-1 mb-6">
          {MAIN_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Management
        </div>
        <div className="space-y-1">
          {MANAGEMENT_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
