import { useEffect, useState } from 'react';
import { Building2, UserCircle2 } from 'lucide-react';
import { currentUser } from '../../data/mockData';

export default function CitizenTopbar() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicpulse_user') || localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUser.citizen;
  });

  return (
    <header className="h-16 bg-brand-900 text-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 font-bold text-lg">
        <Building2 size={20} />
        CivicPulse
      </div>
      <div className="flex items-center gap-2 text-sm">
        <UserCircle2 size={20} />
        <span className="font-medium">{user.name || user.email || 'Citizen'}</span>
      </div>
    </header>
  );
}
