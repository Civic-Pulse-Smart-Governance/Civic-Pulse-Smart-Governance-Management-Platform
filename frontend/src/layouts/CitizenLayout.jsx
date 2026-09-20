import { Outlet } from 'react-router-dom';
import CitizenTopbar from '../components/citizen/CitizenTopbar';
import CitizenSidebar from '../components/citizen/CitizenSidebar';

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <CitizenTopbar />
      <div className="flex">
        <CitizenSidebar />
        <main className="flex-1 min-w-0 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
