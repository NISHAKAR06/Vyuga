import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  Theme,
  UserProfile,
  SlotItem,
  TokenRecord,
  PaymentRecord,
  AppNotification,
  ToastMessage,
  QueueCounter,
  ProcurementCentre,
  ProcurementHistoryItem,
  ProcurementStage,
  AnomalyAssessment
} from '../types';
import { translations } from './translations';
import {
  mockUsers,
  mockCentres,
  initialSlots,
  initialQueueCounters,
  initialLiveQueue,
  mockAnomalyList,
  initialPayments,
  mockFarmerHistory,
  mockNotifications
} from '../data/mockData';

interface AppContextType {
  // Auth & Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  isLoggedIn: boolean;
  login: (role: UserRole, mobileOrId?: string) => void;
  logout: () => void;

  // Preferences
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];

  // Data & State
  centres: ProcurementCentre[];
  slots: SlotItem[];
  createSlot: (newSlot: Omit<SlotItem, 'id' | 'bookedCount' | 'status' | 'isActive'>) => void;
  updateSlotStatus: (slotId: string, status: 'Available' | 'Limited' | 'Full') => void;

  // Queue & Tokens
  liveQueue: TokenRecord[];
  activeFarmerToken: TokenRecord | null;
  advanceQueue: () => void;
  bookSlotAndGenerateToken: (
    slotId: string,
    centreId: string,
    crop: string,
    variety: string,
    quantityKg: number,
    anomalyData?: AnomalyAssessment
  ) => TokenRecord;
  updateTokenStage: (
    tokenId: string,
    newStage: ProcurementStage,
    status?: TokenRecord['status'],
    actualKg?: number,
    remarks?: string,
    moisture?: number,
    grade?: TokenRecord['qualityGrade']
  ) => void;

  // Counters
  counters: QueueCounter[];
  updateCounterStatus: (counterId: string, status: QueueCounter['status']) => void;

  // Anomaly & Officer Review
  anomalyList: TokenRecord[];
  resolveAnomaly: (tokenId: string, action: 'verify' | 'clear' | 'escalate', remarks?: string) => void;

  // Payments
  payments: PaymentRecord[];
  processPayment: (paymentId: string) => void;

  // History & Notifications
  farmerHistory: ProcurementHistoryItem[];
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Toasts & Alerts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Registration draft
  produceDraft: {
    personal: any;
    land: any;
    produce: any;
    produceId?: string;
    anomaly?: AnomalyAssessment;
  } | null;
  setProduceDraft: React.Dispatch<React.SetStateAction<any>>;

  // Active navigation tab
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme state with persistence
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('agri_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('agri_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Language state with persistence
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agri_lang');
    return (saved === 'ta' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agri_lang', lang);
  };

  const t = translations[language] || translations.en;

  // 3. Auth & User state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('agri_logged_in') === 'true';
  });
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('agri_role') as UserRole;
    return (saved === 'officer' || saved === 'admin' || saved === 'farmer') ? saved : 'farmer';
  });
  const [user, setUser] = useState<UserProfile>(() => mockUsers[role] || mockUsers.farmer);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser(mockUsers[newRole]);
    localStorage.setItem('agri_role', newRole);
    setCurrentTab('dashboard');
  };

  const login = (selectedRole: UserRole) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
    localStorage.setItem('agri_logged_in', 'true');
    addToast(t.loginSuccessToast, `${t.greetingMorning}, ${mockUsers[selectedRole].name}`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('agri_logged_in');
    addToast(t.logoutToast, '', 'info');
  };

  // 4. Data states
  const [centres] = useState<ProcurementCentre[]>(mockCentres);
  const [slots, setSlots] = useState<SlotItem[]>(initialSlots);
  const [liveQueue, setLiveQueue] = useState<TokenRecord[]>(initialLiveQueue);
  const [activeFarmerToken, setActiveFarmerToken] = useState<TokenRecord | null>(
    () => initialLiveQueue.find(t => t.farmerId === mockUsers.farmer.id) || null
  );
  const [counters, setCounters] = useState<QueueCounter[]>(initialQueueCounters);
  const [anomalyList, setAnomalyList] = useState<TokenRecord[]>(mockAnomalyList);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [farmerHistory] = useState<ProcurementHistoryItem[]>(mockFarmerHistory);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [produceDraft, setProduceDraft] = useState<any>(null);

  // Toast Helpers
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Slot Management
  const createSlot = (newSlot: Omit<SlotItem, 'id' | 'bookedCount' | 'status' | 'isActive'>) => {
    const slot: SlotItem = {
      ...newSlot,
      id: 's-' + Date.now(),
      bookedCount: 0,
      status: 'Available',
      isActive: true
    };
    setSlots(prev => [...prev, slot]);
    addToast('Slot Created', `Slot ${slot.startTime} – ${slot.endTime} added successfully`, 'success');
  };

  const updateSlotStatus = (slotId: string, status: 'Available' | 'Limited' | 'Full') => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status } : s));
  };

  // Token & Queue Actions
  const bookSlotAndGenerateToken = (
    slotId: string,
    centreId: string,
    crop: string,
    variety: string,
    quantityKg: number,
    anomalyData?: AnomalyAssessment
  ): TokenRecord => {
    const selectedSlot = slots.find(s => s.id === slotId);
    const selectedCentre = centres.find(c => c.id === centreId) || centres[0];
    const nextTokenNum = Math.max(...liveQueue.map(q => q.tokenNumber), 40) + 1;
    const produceId = 'PRD-' + selectedCentre.code + '-2026-' + (800 + nextTokenNum);

    const defaultAnomaly: AnomalyAssessment = anomalyData || {
      detected: quantityKg > 5000,
      riskScore: quantityKg > 5000 ? 75 : 15,
      riskLevel: quantityKg > 5000 ? 'HIGH' : 'LOW',
      status: quantityKg > 5000 ? 'Verification Required' : 'Normal',
      currentQuantityKg: quantityKg,
      historicalAvgKg: 2800,
      landAreaAcres: user.landArea || 3.0,
      yieldPerAcre: Math.round(quantityKg / (user.landArea || 3.0)),
      expectedMaxYieldKg: (user.landArea || 3.0) * 2400,
      reason: quantityKg > 5000 
        ? 'Declared quantity exceeds historical average on declared acreage.'
        : 'Normal declared yield within agronomic limits.'
    };

    const newToken: TokenRecord = {
      id: 'tok-' + nextTokenNum,
      tokenNumber: nextTokenNum,
      produceId,
      farmerId: user.id,
      farmerName: user.name,
      farmerPhone: user.phone,
      farmerVillage: user.location,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      slotId,
      slotDate: selectedSlot?.date || '2026-08-26',
      slotTimeWindow: selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime}` : '10:00 – 11:00',
      crop: crop as any,
      cropVariety: variety,
      declaredQuantityKg: quantityKg,
      stage: 'slot_selected',
      status: 'Booked',
      anomaly: defaultAnomaly,
      estimatedWaitMinutes: Math.max(8, (liveQueue.filter(q => q.status === 'Booked' || q.status === 'Arrived').length + 1) * 4),
      farmersAhead: liveQueue.filter(q => q.status === 'Booked' || q.status === 'Arrived').length,
      createdAt: new Date().toISOString()
    };

    setLiveQueue(prev => [...prev, newToken]);
    setActiveFarmerToken(newToken);

    // Update slot capacity count
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const newBooked = s.bookedCount + 1;
        const newStatus = newBooked >= s.maxCapacity ? 'Full' : (newBooked >= s.maxCapacity - 2 ? 'Limited' : 'Available');
        return { ...s, bookedCount: newBooked, status: newStatus };
      }
      return s;
    }));

    if (defaultAnomaly.detected) {
      setAnomalyList(prev => [newToken, ...prev]);
    }

    addToast(
      'Token Generated',
      `Token #${nextTokenNum} booked for ${newToken.slotTimeWindow} at ${selectedCentre.name}`,
      'success'
    );

    return newToken;
  };

  // Advance Queue Simulation
  const advanceQueue = () => {
    setLiveQueue(prev => {
      if (prev.length === 0) return prev;

      // Find first serving or first waiting
      const servingIdx = prev.findIndex(t => t.status === 'Now Serving');
      let updated = [...prev];

      if (servingIdx !== -1) {
        // Complete current serving
        const completedToken = updated[servingIdx];
        updated[servingIdx] = {
          ...completedToken,
          status: 'Completed',
          stage: 'procurement_completed',
          completedAt: new Date().toISOString()
        };

        // If it was active farmer
        if (activeFarmerToken && activeFarmerToken.id === completedToken.id) {
          setActiveFarmerToken(updated[servingIdx]);
        }
      }

      // Find next in queue to serve
      const nextIdx = updated.findIndex(t => t.status === 'Arrived' || t.status === 'Booked');
      if (nextIdx !== -1) {
        updated[nextIdx] = {
          ...updated[nextIdx],
          status: 'Now Serving',
          stage: 'verification',
          counterAssigned: 'Counter 1'
        };

        // If it was active farmer
        if (activeFarmerToken && activeFarmerToken.id === updated[nextIdx].id) {
          setActiveFarmerToken(updated[nextIdx]);
        }

        // Recalculate wait times & ahead counts for remaining
        let aheadCounter = 0;
        updated = updated.map((item, idx) => {
          if (idx <= nextIdx) {
            return {
              ...item,
              farmersAhead: 0,
              estimatedWaitMinutes: item.status === 'Now Serving' ? 0 : 0
            };
          }
          if (item.status === 'Booked' || item.status === 'Arrived') {
            aheadCounter++;
            return {
              ...item,
              farmersAhead: aheadCounter,
              estimatedWaitMinutes: aheadCounter * 4
            };
          }
          return item;
        });

        // Update active counter token
        setCounters(cList => cList.map(c => c.id === 'cnt-1' ? { ...c, currentTokenNumber: updated[nextIdx].tokenNumber } : c));

        addToast(
          'Queue Updated',
          `Now Serving Token #${updated[nextIdx].tokenNumber} (${updated[nextIdx].farmerName}) at Counter 1`,
          'info'
        );
      }

      return updated;
    });
  };

  const updateTokenStage = (
    tokenId: string,
    newStage: ProcurementStage,
    status?: TokenRecord['status'],
    actualKg?: number,
    remarks?: string,
    moisture?: number,
    grade?: TokenRecord['qualityGrade']
  ) => {
    setLiveQueue(prev => prev.map(t => {
      if (t.id === tokenId) {
        const updated: TokenRecord = {
          ...t,
          stage: newStage,
          status: status || t.status,
          actualQuantityKg: actualKg ?? t.actualQuantityKg,
          officerRemarks: remarks ?? t.officerRemarks,
          moisturePercentage: moisture ?? t.moisturePercentage,
          qualityGrade: grade ?? t.qualityGrade
        };
        if (activeFarmerToken && activeFarmerToken.id === tokenId) {
          setActiveFarmerToken(updated);
        }
        return updated;
      }
      return t;
    }));

    // If completed, generate payment record automatically
    if (newStage === 'procurement_completed' || newStage === 'payment_processing') {
      const token = liveQueue.find(t => t.id === tokenId);
      if (token) {
        const qty = actualKg || token.declaredQuantityKg;
        const rate = 23.20;
        const base = qty * rate;
        const bonus = (qty / 100) * 100;
        const net = base + bonus;

        const newPayment: PaymentRecord = {
          id: 'pay-' + Date.now(),
          procurementId: 'PROC-' + token.tokenNumber + '-' + Date.now().toString().slice(-4),
          tokenNumber: token.tokenNumber,
          farmerId: token.farmerId,
          farmerName: token.farmerName,
          farmerAccount: 'SBI 30987123901',
          bankName: 'State Bank of India',
          ifsc: 'SBIN0001244',
          crop: `${token.crop} (${token.cropVariety})`,
          quantityKg: qty,
          ratePerKg: rate,
          baseAmount: base,
          bonusAmount: bonus,
          deductions: 0,
          netAmount: net,
          status: 'Processing',
          utrNumber: 'PFMS' + Date.now().toString(),
          initiatedAt: new Date().toISOString(),
          timeline: [
            {
              title: 'Procurement Completed & Certified',
              description: `${qty} kg certified at Weighbridge by Officer`,
              timestamp: 'Just now',
              completed: true
            },
            {
              title: 'Amount Calculated & Approved',
              description: `₹${net.toLocaleString('en-IN')} approved via Central MSP & State Bonus`,
              timestamp: 'Just now',
              completed: true
            },
            {
              title: 'DBT Payment Initiated via PFMS',
              description: 'Batch file generated and transmitted to RBI PFMS gateway',
              timestamp: 'In Progress',
              completed: true,
              current: true
            },
            {
              title: 'Bank Clearing Processing',
              description: 'Clearance in progress with State Bank of India',
              timestamp: 'Pending Bank clearance',
              completed: false
            },
            {
              title: 'Credited to Bank Account',
              description: 'SMS notification will be dispatched to farmer phone',
              timestamp: 'Awaiting Bank confirmation',
              completed: false
            }
          ]
        };

        setPayments(prev => [newPayment, ...prev]);
      }
    }

    addToast('Status Updated', `Token stage updated to: ${newStage.replace(/_/g, ' ').toUpperCase()}`, 'success');
  };

  // Counter Status
  const updateCounterStatus = (counterId: string, status: QueueCounter['status']) => {
    setCounters(prev => prev.map(c => c.id === counterId ? { ...c, status } : c));
    addToast('Counter Updated', `Counter status changed to ${status}`, 'info');
  };

  // Anomaly Resolution
  const resolveAnomaly = (tokenId: string, action: 'verify' | 'clear' | 'escalate', remarks?: string) => {
    const statusMap = {
      verify: 'Cleared',
      clear: 'Cleared',
      escalate: 'Under Review'
    } as const;

    setAnomalyList(prev => prev.map(item => {
      if (item.id === tokenId) {
        return {
          ...item,
          anomaly: {
            ...item.anomaly,
            status: statusMap[action],
            officerRemarks: remarks || `Officer resolution: ${action}`,
            reviewedBy: user.name,
            reviewedAt: new Date().toLocaleTimeString()
          }
        };
      }
      return item;
    }));

    setLiveQueue(prev => prev.map(item => {
      if (item.id === tokenId) {
        return {
          ...item,
          status: action === 'verify' || action === 'clear' ? 'Booked' : 'Under Review',
          anomaly: {
            ...item.anomaly,
            status: statusMap[action],
            officerRemarks: remarks
          }
        };
      }
      return item;
    }));

    addToast(
      'Anomaly Action Recorded',
      `Farmer record marked as: ${action === 'escalate' ? 'Escalated to District' : 'Verified & Cleared'}`,
      'success'
    );
  };

  // Payment Processing
  const processPayment = (paymentId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'Completed',
          completedAt: new Date().toISOString(),
          timeline: p.timeline.map(step => ({ ...step, completed: true, current: false }))
        };
      }
      return p;
    }));

    addToast('Payment Disbursed', `DBT direct transfer of amount completed successfully.`, 'success');
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Notifications', 'All notifications marked as read', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        isLoggedIn,
        login,
        logout,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        centres,
        slots,
        createSlot,
        updateSlotStatus,
        liveQueue,
        activeFarmerToken,
        advanceQueue,
        bookSlotAndGenerateToken,
        updateTokenStage,
        counters,
        updateCounterStatus,
        anomalyList,
        resolveAnomaly,
        payments,
        processPayment,
        farmerHistory,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        toasts,
        addToast,
        removeToast,
        produceDraft,
        setProduceDraft,
        currentTab,
        setCurrentTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
