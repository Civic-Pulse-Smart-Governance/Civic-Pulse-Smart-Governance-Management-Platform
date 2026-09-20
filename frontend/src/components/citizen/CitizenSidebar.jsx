import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, ListChecks, Search, Bell, UserCircle2, LogOut } from 'lucide-react';

const NAV = [
  { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/citizen/register-complaint', label: 'Register Complaint', icon: FilePlus2 },
  { to: '/citizen/my-complaints', label: 'My Complaints', icon: ListChecks },
  { to: '/citizen/track-complaint', label: 'Track Complaint', icon: Search },
  { to: '/citizen/notifications', label: 'Notifications', icon: Bell },
  { to: '/citizen/profile', label: 'My Profile', icon: UserCircle2 },
];

export default function CitizenSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('civicpulse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('civicpulse_user');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
