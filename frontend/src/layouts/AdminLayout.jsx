import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

export default function AdminLayout() {
  const [pageMeta, setPageMeta] = useState({
    title: 'Admin Dashboard',
    subtitle: 'CivicPulse Management Portal',
  });

  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar title={pageMeta.title} subtitle={pageMeta.subtitle} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet context={{ setPageMeta }} />
        </main>
      </div>
    </div>
  );
}
