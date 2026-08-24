import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Users,
  CheckCircle2,
  Scale,
  AlertTriangle,
  Building2,
  Sparkles,
  FileText
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, currentTab, setCurrentTab, t } = useApp();

  const getMobileTabs = () => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'register_produce', label: t.navRegisterProduce, icon: PlusCircle },
          { id: 'slots', label: t.navMySlots, icon: Calendar },
          { id: 'live_queue', label: t.navLiveQueue, icon: Users },
          { id: 'procurement_status', label: t.navProcurementStatus, icon: CheckCircle2 }
        ];
      case 'officer':
        return [
          { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
          { id: 'slots', label: t.navSlotManagement, icon: Calendar },
          { id: 'live_queue', label: t.navOfficerQueue, icon: Users },
          { id: 'procurement_process', label: t.navProcurementProcess, icon: Scale },
          { id: 'anomaly_alerts', label: t.navAnomalyAlerts, icon: AlertTriangle }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: t.navAdminOverview, icon: LayoutDashboard },
          { id: 'centres', label: t.navCentresMonitoring, icon: Building2 },
          { id: 'ai_analytics', label: t.navAiAnalytics, icon: Sparkles },
          { id: 'anomaly_monitoring', label: t.navAnomalyMonitoring, icon: AlertTriangle },
          { id: 'reports', label: t.navAdminReports, icon: FileText }
        ];
    }
  };

  const tabs = getMobileTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-lg dark:border-slate-800/90 dark:bg-slate-900/95 lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative rounded-xl p-1 ${isActive ? 'bg-emerald-500/15' : ''}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="truncate max-w-[64px] text-[10px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
