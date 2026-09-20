import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Landing from './pages/Landing';
import ComplaintDetailPage from './pages/shared/ComplaintDetailPage';


import CitizenLayout from './layouts/CitizenLayout';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import RegisterComplaint from './pages/citizen/RegisterComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import TrackComplaint from './pages/citizen/TrackComplaint';
import CitizenNotifications from './pages/citizen/CitizenNotifications';
import CitizenProfile from './pages/citizen/CitizenProfile';

import OfficerLayout from './layouts/OfficerLayout';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaints from './pages/officer/OfficerComplaints';
import OfficerNotifications from './pages/officer/OfficerNotifications';
import OfficerProfile from './pages/officer/OfficerProfile';
import OfficerChangePassword from './pages/officer/OfficerChangePassword';
import OfficerHelp from './pages/officer/OfficerHelp';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminOfficers from './pages/admin/AdminOfficers';
import AdminCitizens from './pages/admin/AdminCitizens';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />


        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="register-complaint" element={<RegisterComplaint />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage role="citizen" />} />
          <Route path="track-complaint" element={<TrackComplaint />} />
          <Route path="notifications" element={<CitizenNotifications />} />
          <Route path="profile" element={<CitizenProfile />} />
        </Route>

        <Route path="/officer" element={<OfficerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboard />} />
          <Route path="complaints" element={<OfficerComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage role="officer" />} />
          <Route path="notifications" element={<OfficerNotifications />} />
          <Route path="profile" element={<OfficerProfile />} />
          <Route path="change-password" element={<OfficerChangePassword />} />
          <Route path="help" element={<OfficerHelp />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage role="admin" />} />
          <Route path="officers" element={<AdminOfficers />} />
          <Route path="citizens" element={<AdminCitizens />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
