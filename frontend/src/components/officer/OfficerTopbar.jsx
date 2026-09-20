import { Menu, Search, Bell, ChevronDown, UserCircle2 } from 'lucide-react';
import { currentUser, notifications } from '../../data/mockData';

export default function OfficerTopbar({ title, subtitle }) {
  const user = currentUser.officer;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 sticky top-0 z-20">
      <button className="md:hidden text-slate-500">
        <Menu size={22} />
      </button>
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex-1" />

      <div className="hidden lg:block relative w-64">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        />
      </div>

      <button className="relative text-slate-500 hover:text-slate-700">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      <button className="flex items-center gap-2 pl-1">
        <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
          <UserCircle2 size={20} />
        </div>
        <span className="hidden md:block text-left leading-tight">
          <span className="block text-sm font-bold text-slate-800">{user.name}</span>
          <span className="block text-[11px] text-slate-400">Account</span>
        </span>
        <ChevronDown size={14} className="hidden md:block text-slate-400" />
      </button>
    </header>
  );
}
