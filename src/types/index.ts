export type UserRole = 'farmer' | 'officer' | 'admin';

export type Language = 'en' | 'ta' | 'hi';

export type Theme = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  location: string;
  district: string;
  state: string;
  landArea?: number; // in acres
  landUnit?: string;
  crop?: string;
  aadharNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  bankName?: string;
  centreId?: string;
  centreName?: string;
  designation?: string;
}

export type CropCategory = 'Paddy' | 'Wheat' | 'Cotton' | 'Groundnut' | 'Sugarcane' | 'Maize';

export interface CropInfo {
  id: string;
  name: string;
  variety: string;
  mspPerQuintal: number; // in INR
  season: 'Kharif' | 'Rabi' | 'Zaid';
  expectedYieldPerAcre: number; // in kg
}

export interface ProcurementCentre {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  capacityPerDay: number; // in kg or tons
  activeCounters: number;
  totalFarmersToday: number;
  servedToday: number;
  waitingNow: number;
  currentAvgWaitMinutes: number;
  predictedAvgWaitMinutes: number;
  predictedCrowdLevel: 'LOW' | 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'Normal' | 'Moderate' | 'High Load';
  utilizationRate: number; // percentage
  address: string;
  contactNumber: string;
}

export interface SlotItem {
  id: string;
  centreId: string;
  centreName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  maxCapacity: number; // e.g. 20
  bookedCount: number; // e.g. 18
  status: 'Available' | 'Limited' | 'Full';
  isActive: boolean;
}

export type ProcurementStage = 
  | 'registration' 
  | 'slot_selected' 
  | 'waiting' 
  | 'at_centre' 
  | 'verification' 
  | 'procurement_completed' 
  | 'payment_processing' 
  | 'payment_completed';

export interface AnomalyAssessment {
  detected: boolean;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Normal' | 'Anomaly Detected' | 'Verification Required' | 'Under Review' | 'Cleared';
  currentQuantityKg: number;
  historicalAvgKg: number;
  landAreaAcres: number;
  yieldPerAcre: number;
  expectedMaxYieldKg: number;
  reason: string;
  officerRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TokenRecord {
  id: string;
  tokenNumber: number; // e.g. 47
  produceId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  centreId: string;
  centreName: string;
  slotId: string;
  slotDate: string;
  slotTimeWindow: string; // "10:00 - 11:00"
  crop: CropCategory;
  cropVariety: string;
  declaredQuantityKg: number;
  actualQuantityKg?: number;
  moisturePercentage?: number;
  qualityGrade?: 'Grade A' | 'Grade B' | 'Standard (FAQ)';
  stage: ProcurementStage;
  status: 'Booked' | 'Arrived' | 'Now Serving' | 'Completed' | 'Absent' | 'On Hold' | 'Under Review';
  anomaly: AnomalyAssessment;
  estimatedWaitMinutes: number;
  farmersAhead: number;
  counterAssigned?: string;
  createdAt: string;
  completedAt?: string;
  officerRemarks?: string;
  paymentId?: string;
}

export interface PaymentRecord {
  id: string;
  procurementId: string;
  tokenNumber: number;
  farmerId: string;
  farmerName: string;
  farmerAccount: string;
  bankName: string;
  ifsc: string;
  crop: string;
  quantityKg: number;
  ratePerKg: number;
  baseAmount: number;
  bonusAmount: number;
  deductions: number;
  netAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  utrNumber?: string;
  initiatedAt: string;
  completedAt?: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface ProcurementHistoryItem {
  id: string;
  receiptNumber: string;
  date: string;
  crop: string;
  variety: string;
  declaredQuantityKg: number;
  actualQuantityKg: number;
  centreName: string;
  amount: number;
  status: 'Completed' | 'Verification Required' | 'Rejected' | 'In Progress';
  paymentStatus: 'Completed' | 'Processing' | 'Pending';
  utrNumber: string;
  qualityGrade: string;
  moisture: string;
}

export interface QueueCounter {
  id: string;
  name: string; // "Counter 1"
  officerName: string;
  currentTokenNumber: number | null;
  status: 'Serving' | 'Available' | 'Maintenance' | 'Break';
  servedTodayCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  roleTarget: UserRole | 'all';
  read: boolean;
  actionUrl?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
