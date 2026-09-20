import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from '../components/officer/OfficerSidebar';
import OfficerTopbar from '../components/officer/OfficerTopbar';

export default function OfficerLayout() {
  const [pageMeta, setPageMeta] = useState({ title: 'Dashboard', subtitle: '' });

  return (
    <div className="min-h-screen bg-surface flex">
      <OfficerSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <OfficerTopbar title={pageMeta.title} subtitle={pageMeta.subtitle} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ setPageMeta }} />
        </main>
      </div>
    </div>
  );
}
