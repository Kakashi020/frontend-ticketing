import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import UserHistory from './pages/UserHistory';
import UserProfile from './pages/UserProfile';
import AdminLogin from './pages/AdminLogin';
import RaiseTicket from './pages/RaiseTicket';
import AdminTicketManagement from './pages/AdminTicketManagement';
import UserRecords from './pages/UserRecords';
import WekaReports from './pages/WekaReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route sends users to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* --- USER ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/raise-ticket" element={<RaiseTicket />} />
        <Route path="/history" element={<UserHistory />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* We point BOTH of these to your management view so the buttons work */}
        <Route path="/admin-dashboard" element={<AdminTicketManagement />} />
        <Route path="/admin-tickets" element={<AdminTicketManagement />} />
        <Route path="/admin-users" element={<UserRecords />} />
        <Route path="/admin-reports" element={<WekaReports />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;