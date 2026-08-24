import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ProfileModal } from './components/modals/ProfileModal';

// Farmer pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { RegisterProduce } from './pages/farmer/RegisterProduce';
import { SlotSelection } from './pages/farmer/SlotSelection';
import { LiveQueuePage } from './pages/farmer/LiveQueuePage';
import { ProcurementStatus } from './pages/farmer/ProcurementStatus';
import { PaymentsPage } from './pages/farmer/PaymentsPage';
import { HistoryPage } from './pages/farmer/HistoryPage';
import { HelpPage } from './pages/farmer/HelpPage';

// Officer pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { SlotManagement } from './pages/officer/SlotManagement';
import { OfficerLiveQueue } from './pages/officer/OfficerLiveQueue';
import { FarmerRecords } from './pages/officer/FarmerRecords';
import { ProcurementFlow } from './pages/officer/ProcurementFlow';
import { AnomalyAlerts } from './pages/officer/AnomalyAlerts';
import { OfficerPayments } from './pages/officer/OfficerPayments';
import { CentreAnalytics } from './pages/officer/CentreAnalytics';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CentreMonitoring } from './pages/admin/CentreMonitoring';
import { GovernmentAIAnalytics } from './pages/admin/GovernmentAIAnalytics';
import { AnomalyMonitoring } from './pages/admin/AnomalyMonitoring';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainLayout: React.FC = () => {
  const { isLoggedIn, role, currentTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderActiveScreen = () => {
    switch (role) {
      case 'farmer':
        switch (currentTab) {
          case 'register_produce':
            return <RegisterProduce />;
          case 'slots':
            return <SlotSelection />;
          case 'live_queue':
            return <LiveQueuePage />;
          case 'procurement_status':
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
            return <OfficerLiveQueue />;
          case 'farmer_records':
            return <FarmerRecords />;
          case 'procurement_process':
            return <ProcurementFlow />;
          case 'anomaly_alerts':
            return <AnomalyAlerts />;
          case 'payments':
            return <OfficerPayments />;
          case 'centre_analytics':
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
            return <GovernmentAIAnalytics />;
          case 'anomaly_monitoring':
            return <AnomalyMonitoring />;
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

      {/* Main Content Area: Sidebar + Scrollable View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="animate-fade-in">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
