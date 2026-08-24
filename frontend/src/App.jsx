import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import AccessPage from './pages/AccessPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import OfficersPage from './pages/OfficersPage';
import DonationsPage from './pages/DonationsPage';
import ExpensesPage from './pages/ExpensesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/access" />;
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/access" element={token ? <Navigate to="/dashboard" /> : <AccessPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
      <Route path="/officers" element={<ProtectedRoute><OfficersPage /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><DonationsPage /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/access"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
