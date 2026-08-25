import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';

// Public Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';

// Layout & Common
import { Header, Sidebar, MobileNav } from './components/layout';
import { ToastContainer } from './components/ui';
import { ProfileModal } from './components/modals';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { RegisterProduce } from './pages/farmer/RegisterProduce';
import { SlotSelection } from './pages/farmer/SlotSelection';
import { LiveQueuePage } from './pages/farmer/LiveQueuePage';
import { ProcurementStatus } from './pages/farmer/ProcurementStatus';
import { PaymentsPage } from './pages/farmer/PaymentsPage';
import { HistoryPage } from './pages/farmer/HistoryPage';
import { HelpPage } from './pages/farmer/HelpPage';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { SlotManagement } from './pages/officer/SlotManagement';
import { OfficerLiveQueue } from './pages/officer/OfficerLiveQueue';
import { FarmerRecords } from './pages/officer/FarmerRecords';
import { ProcurementFlow } from './pages/officer/ProcurementFlow';
import { AnomalyAlerts } from './pages/officer/AnomalyAlerts';
import { OfficerPayments } from './pages/officer/OfficerPayments';
import { CentreAnalytics } from './pages/officer/CentreAnalytics';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CentreMonitoring } from './pages/admin/CentreMonitoring';
import { GovernmentAIAnalytics } from './pages/admin/GovernmentAIAnalytics';
import { AnomalyMonitoring } from './pages/admin/AnomalyMonitoring';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminSettings } from './pages/admin/AdminSettings';
import { LiveQueueIntelligence } from './pages/admin/LiveQueueIntelligence';

interface PortalLayoutProps {
  portalRole: UserRole;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ portalRole }) => {
  const { role, setRole, currentTab, setCurrentTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Synchronize role and tab from URL path
  useEffect(() => {
    if (role !== portalRole) {
      setRole(portalRole);
    }
  }, [portalRole, role, setRole]);

  useEffect(() => {
    // Extract tab from pathname e.g. /farmer/register_produce -> register_produce
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      const tabFromUrl = pathParts[1];
      setCurrentTab(tabFromUrl);
    } else if (pathParts.length <= 1) {
      setCurrentTab('dashboard');
    }
  }, [location.pathname, setCurrentTab]);

  const renderActiveScreen = () => {
    switch (portalRole) {
      case 'farmer':
        switch (currentTab) {
          case 'register_produce':
          case 'register':
            return <RegisterProduce />;
          case 'slots':
            return <SlotSelection />;
          case 'live_queue':
          case 'queue':
            return <LiveQueuePage />;
          case 'procurement_status':
          case 'status':
            return <ProcurementStatus />;
          case 'payments':
            return <PaymentsPage />;
          case 'history':
            return <HistoryPage />;
          case 'help':
            return <HelpPage />;
          case 'dashboard':
          default:
            return <FarmerDashboard />;
        }

      case 'officer':
        switch (currentTab) {
          case 'slots':
            return <SlotManagement />;
          case 'live_queue':
          case 'queue':
            return <OfficerLiveQueue />;
          case 'farmer_records':
          case 'farmers':
            return <FarmerRecords />;
          case 'procurement_process':
          case 'procurement':
          case 'weighment':
            return <ProcurementFlow />;
          case 'anomaly_alerts':
          case 'anomalies':
          case 'alerts':
            return <AnomalyAlerts />;
          case 'payments':
            return <OfficerPayments />;
          case 'centre_analytics':
          case 'analytics':
            return <CentreAnalytics />;
          case 'dashboard':
          default:
            return <OfficerDashboard />;
        }

      case 'admin':
        switch (currentTab) {
          case 'centres':
            return <CentreMonitoring />;
          case 'ai_analytics':
          case 'ai':
            return <GovernmentAIAnalytics />;
          case 'anomaly_monitoring':
          case 'anomalies':
            return <AnomalyMonitoring />;
          case 'queue_intelligence':
          case 'live_intelligence':
            return <LiveQueueIntelligence />;
          case 'reports':
            return <ReportsPage />;
          case 'settings':
            return <AdminSettings />;
          case 'dashboard':
          default:
            return <AdminDashboard />;
        }
    }
  };


  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Content Area: Sidebar + Dynamic Screen */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="animate-fade-in">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/register" element={<SignUpPage />} />

          {/* Role Portal Routes with dynamic sub-tab handling */}
          <Route path="/farmer/*" element={<PortalLayout portalRole="farmer" />} />
          <Route path="/officer/*" element={<PortalLayout portalRole="officer" />} />
          <Route path="/admin/*" element={<PortalLayout portalRole="admin" />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
