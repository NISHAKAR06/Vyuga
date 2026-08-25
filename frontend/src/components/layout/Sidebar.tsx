import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Users,
  CheckCircle2,
  CreditCard,
  History,
  HelpCircle,
  Scale,
  AlertTriangle,
  BarChart3,
  Building2,
  Sparkles,
  ShieldAlert,
  FileText,
  Settings,
  UserCheck,
  ChevronRight,
  Sprout,
  Home
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { role, currentTab, setCurrentTab, t, anomalyList, liveQueue } = useApp();

  const unresolvedAnomalies = anomalyList.filter(
    a => a.anomaly.status === 'Verification Required' || a.anomaly.status === 'Anomaly Detected'
  ).length;

  const waitingCount = liveQueue.filter(
    q => q.status === 'Booked' || q.status === 'Arrived'
  ).length;

  // Role nav configurations
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'register_produce', label: t.navRegisterProduce, icon: PlusCircle },
          { id: 'slots', label: t.navMySlots, icon: Calendar },
          { id: 'live_queue', label: t.navLiveQueue, icon: Users, badge: waitingCount > 0 ? `${waitingCount}` : undefined },
          { id: 'procurement_status', label: t.navProcurementStatus, icon: CheckCircle2 },
          { id: 'payments', label: t.navPayments, icon: CreditCard },
          { id: 'history', label: t.navHistory, icon: History },
          { id: 'help', label: t.navHelp, icon: HelpCircle }
        ];

      case 'officer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'slots', label: t.navSlotManagement, icon: Calendar },
          { id: 'live_queue', label: t.navOfficerQueue, icon: Users, badge: `${waitingCount}` },
          { id: 'farmer_records', label: t.navFarmerRecords, icon: UserCheck },
          { id: 'procurement_process', label: t.navProcurementProcess, icon: Scale },
          { id: 'anomaly_alerts', label: t.navAnomalyAlerts, icon: AlertTriangle, badge: unresolvedAnomalies > 0 ? `${unresolvedAnomalies}` : undefined, badgeColor: 'bg-rose-500 text-white' },
          { id: 'payments', label: t.navOfficerPayments, icon: CreditCard },
          { id: 'centre_analytics', label: t.navCentreAnalytics, icon: BarChart3 }
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: t.navAdminOverview, icon: LayoutDashboard },
          { id: 'centres', label: t.navCentresMonitoring, icon: Building2 },
          { id: 'ai_analytics', label: t.navAiAnalytics, icon: Sparkles },
          { id: 'anomaly_monitoring', label: t.navAnomalyMonitoring, icon: ShieldAlert, badge: unresolvedAnomalies > 0 ? `${unresolvedAnomalies}` : undefined, badgeColor: 'bg-rose-500 text-white' },
          { id: 'reports', label: t.navAdminReports, icon: FileText },
          { id: 'settings', label: t.navAdminSettings, icon: Settings }
        ];
    }
  };

  const navItems = getNavItems();

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    navigate(`/${role}/${id === 'dashboard' ? '' : id}`);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 p-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner inside Sidebar */}
        <div
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-3 px-2 pt-2 cursor-pointer hover:opacity-90 transition-opacity"
          title="Back to Landing Page"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              AgriProcure
            </h1>
            <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              {role === 'farmer' ? 'Farmer Portal' : role === 'officer' ? 'Mandi Officer Desk' : 'State Command'}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Quick Help Card */}
        <div className="mt-auto rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-3.5 dark:border-emerald-500/10 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              {t.sidebarProcurementLive}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            {t.sidebarKharifActive}
          </p>
        </div>
      </aside>
    </>
  );
};
