import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  UserRole,
  UserSession,
  CommodityMarketData,
  FarmerPledge,
  FpoCoalition,
  EnamAuctionLot,
  MandiGateWeighment,
  TruckTelemetry,
  AdminAuditRecord,
  UserSettings,
  SupportTicket,
  SmsAlertRecord,
  WeatherData,
  UserHistoryStatement,
  DatasetAlgorithm,
  DatasetRunResult,
} from '../types';
import { executeDatasetRun } from '../services/enamModelTrainer';
import {
  INITIAL_MARKET_DATA,
  INITIAL_FARMER_PLEDGES,
  INITIAL_COALITIONS,
  INITIAL_ENAM_LOTS,
  INITIAL_GATE_WEIGHMENTS,
  INITIAL_TRUCK_TELEMETRY,
  INITIAL_AUDIT_LOGS,
  INITIAL_USER_ORDER_HISTORY,
} from '../mock/mockData';
import confetti from 'canvas-confetti';

function playSmsNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.1); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
    gain2.gain.setValueAtTime(0.12, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch {
    // Audio autoplay restrictions ignored safely
  }
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

const ROLE_USER_TEMPLATES: Record<UserRole, Omit<UserSession, 'tokenSha256'>> = {
  farmer: {
    role: 'farmer',
    name: 'Rameshwar Patil',
    userId: 'MH-NSK-FARM-442',
    organization: 'Pimpalgaon Farmer Cooperative',
    location: 'Nashik, Maharashtra',
    phone: '+91 98231 44021',
    avatarColor: '#10b981',
    clearanceLevel: 'LEVEL_1_FARMER',
    permittedDashboards: ['farmer'],
  },
  fpo: {
    role: 'fpo',
    name: 'Sachin Rao',
    userId: 'MH-FPO-DIR-102',
    organization: 'Sahyadri Farmers Producer Co.',
    location: 'Dindori Cluster, Maharashtra',
    phone: '+91 94222 18903',
    avatarColor: '#38bdf8',
    clearanceLevel: 'LEVEL_2_FPO',
    permittedDashboards: ['fpo'],
  },
  enam: {
    role: 'enam',
    name: 'S. K. Gupta',
    userId: 'ENAM-TRD-DEL-891',
    organization: 'National Agriculture Market Trading Desk',
    location: 'New Delhi Hub',
    phone: '+91 98110 33491',
    avatarColor: '#fbbf24',
    clearanceLevel: 'LEVEL_3_ENAM',
    permittedDashboards: ['enam'],
  },
  mandi: {
    role: 'mandi',
    name: 'Sandeep Jadhav',
    userId: 'APMC-AZD-WB-04',
    organization: 'Azadpur APMC Mandi Board',
    location: 'Azadpur Mandi Gate 4, Delhi',
    phone: '+91 97180 55412',
    avatarColor: '#f43f5e',
    clearanceLevel: 'LEVEL_3_MANDI',
    permittedDashboards: ['mandi'],
  },
  truck: {
    role: 'truck',
    name: 'Sukhdev Singh',
    userId: 'KSR-LOG-DRV-771',
    organization: 'Navdurga Cold Freight Lines',
    location: 'Enroute NH-48 Corridor',
    phone: '+91 98201 99014',
    avatarColor: '#a78bfa',
    clearanceLevel: 'LEVEL_2_TRUCK',
    permittedDashboards: ['truck'],
  },
  admin: {
    role: 'admin',
    name: 'Dr. Ananya Sen',
    userId: 'APEX-AUD-IND-001',
    organization: 'Directorate of Marketing & Inspection (Govt of India)',
    location: 'Krishi Bhawan, New Delhi',
    phone: '+91 98100 00192',
    avatarColor: '#f59e0b',
    clearanceLevel: 'LEVEL_4_APEX_ADMIN',
    permittedDashboards: ['admin'],
  },
};

interface AppContextType {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  isLoggedIn: boolean;
  userSession: UserSession | null;
  loginUser: (role: UserRole, customName?: string) => void;
  logoutUser: () => void;
  canAccessDashboard: (role: UserRole) => boolean;

  // Step-by-Step Flow Conductor
  stepByStepMode: boolean;
  setStepByStepMode: (active: boolean) => void;
  currentStepIndex: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setStepIndex: (index: number) => void;
  startGuidedJourney: () => void;

  // Commodities & Agmarknet
  commodities: CommodityMarketData[];

  // Farmer State
  pledges: FarmerPledge[];
  addPledge: (pledgeData: Partial<FarmerPledge> & { isReadyToSell?: boolean }) => void;
  markPledgeReadyToSell: (pledgeId: string) => Promise<void>;

  // SMS Notifications
  activeSmsAlert: SmsAlertRecord | null;
  setActiveSmsAlert: (alert: SmsAlertRecord | null) => void;
  smsHistory: SmsAlertRecord[];

  // FPO State
  coalitions: FpoCoalition[];
  triggerGraspOptimization: (coalitionId: string) => void;

  // e-NAM State
  enamLots: EnamAuctionLot[];
  placeBid: (lotNumber: string, bidAmount: number, bidderName: string) => void;
  hammerAuction: (lotNumber: string) => void;
  updateReservePrice: (lotNumber: string, newReserve: number) => void;

  // APMC Mandi State
  gateWeighments: MandiGateWeighment[];
  commitWeighment: (gatePassId: string, grossKg: number, tareKg: number) => void;

  // Truck Logistics State
  truckTelemetry: TruckTelemetry;
  toggleReeferFault: () => void;
  advanceTruckMilestone: () => void;
  advanceTruckLocation: (kmDelta?: number) => void;
  updateTruckTelemetryData: (partial: Partial<TruckTelemetry>) => void;
  signTruckEpod: (recipientName: string) => void;

  // Admin & Audit
  auditLogs: AdminAuditRecord[];
  addAuditLog: (action: string, details: string, complianceTag: 'DPDP_ACT_2023' | 'APMC_MODEL_ACT' | 'AGMARK_STANDARDS') => void;
  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  mandiCess: number;
  setMandiCess: (cess: number) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Settings & Profile
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateUserProfile: (profileData: { name: string; organization: string; phone: string; location: string }) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Help & Support
  isHelpSupportOpen: boolean;
  setIsHelpSupportOpen: (open: boolean) => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'status'>) => string;

  // Profitability Comparison Engine
  isProfitModalOpen: boolean;
  setIsProfitModalOpen: (open: boolean) => void;

  // Live Delivery Tracker
  isDeliveryTrackerModalOpen: boolean;
  setIsDeliveryTrackerModalOpen: (open: boolean) => void;

  // User Order & Sales History Statement
  userOrderHistory: UserHistoryStatement;
  isOrderHistoryModalOpen: boolean;
  setIsOrderHistoryModalOpen: (open: boolean) => void;

  // Weather & Produce Freshness Guard
  weatherData: WeatherData | null;
  isLoadingWeather: boolean;
  weatherApiKey: string;
  setWeatherApiKey: (key: string) => Promise<boolean>;
  refreshWeather: (options?: {
    city?: string;
    lat?: number;
    lon?: number;
    commodity?: string;
    harvestDate?: string;
    isReefer?: boolean;
  }) => Promise<void>;
  detectDeviceLocationAndWeather: (showToast?: boolean) => Promise<WeatherData | null>;
  isWeatherModalOpen: boolean;
  setIsWeatherModalOpen: (open: boolean) => void;

  // Dataset Runner & Accuracy Engine
  isDatasetModalOpen: boolean;
  setIsDatasetModalOpen: (open: boolean) => void;
  datasetRunResult: DatasetRunResult;
  isRunningDataset: boolean;
  runDatasetEngine: (options?: {
    algorithm?: DatasetAlgorithm;
    epochs?: number;
    testSplitPct?: number;
    learningRate?: number;
  }) => Promise<DatasetRunResult>;

  // Reset Demo
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT DEFAULT: User starts unauthenticated!
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [stepByStepMode, setStepByStepMode] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const [commodities, setCommodities] = useState<CommodityMarketData[]>(INITIAL_MARKET_DATA);
  const [pledges, setPledges] = useState<FarmerPledge[]>(INITIAL_FARMER_PLEDGES);
  const [coalitions, setCoalitions] = useState<FpoCoalition[]>(INITIAL_COALITIONS);
  const [enamLots, setEnamLots] = useState<EnamAuctionLot[]>(INITIAL_ENAM_LOTS);
  const [gateWeighments, setGateWeighments] = useState<MandiGateWeighment[]>(INITIAL_GATE_WEIGHMENTS);
  const [truckTelemetry, setTruckTelemetry] = useState<TruckTelemetry>(INITIAL_TRUCK_TELEMETRY);
  const [auditLogs, setAuditLogs] = useState<AdminAuditRecord[]>(INITIAL_AUDIT_LOGS);

  // SMS Notifications State
  const [activeSmsAlert, setActiveSmsAlert] = useState<SmsAlertRecord | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsAlertRecord[]>([]);

  // Weather & Freshness Guard State
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherApiKey, setWeatherApiKeyInternal] = useState<string>('');
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);

  const [commissionRate, setCommissionRate] = useState<number>(6.0);
  const [mandiCess, setMandiCess] = useState<number>(1.5);

  // Settings & Profile State
  const [settings, setSettings] = useState<UserSettings>({
    preferredLanguage: 'English',
    defaultMandiId: 1, // Kolar APMC KA-KOL-001
    statutoryCommissionPct: 1.5,
    statutoryCessPct: 1.0,
    smsAlertsEnabled: true,
    reeferTempAlertsEnabled: true,
    whatsappInvoicesEnabled: true,
    highContrastSunlightMode: false,
    themeAccent: 'emerald',
    autoLogoutMinutes: 30,
    dpdpStrictCompliance: true,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpSupportOpen, setIsHelpSupportOpen] = useState<boolean>(false);
  const [isProfitModalOpen, setIsProfitModalOpen] = useState<boolean>(false);
  const [isDeliveryTrackerModalOpen, setIsDeliveryTrackerModalOpen] = useState<boolean>(false);
  const [userOrderHistory, setUserOrderHistory] = useState<UserHistoryStatement>(INITIAL_USER_ORDER_HISTORY);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useState<boolean>(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState<boolean>(false);
  const [datasetRunResult, setDatasetRunResult] = useState<DatasetRunResult>(() => executeDatasetRun());
  const [isRunningDataset, setIsRunningDataset] = useState<boolean>(false);

  // Help & Support Grievance Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      ticketId: 'TKT-2026-9041',
      createdAt: '2026-10-23 14:10',
      category: 'ESCROW_PAYMENT',
      priority: 'HIGH',
      subject: 'e-NAM Trade Escrow Payout Verification',
      description: 'Lot ENAM-MH-2026-904 sale escrow awaiting PFMS UTR generation.',
      status: 'RESOLVED',
      contactPhone: '+91 98231 44021',
    },
    {
      ticketId: 'TKT-2026-9042',
      createdAt: '2026-10-24 01:25',
      category: 'WEIGHBRIDGE_TOLERANCE',
      priority: 'MEDIUM',
      subject: 'APMC Weighment Slip Tolerance Query',
      description: 'Gross weighment variance within ±1.8% tolerance verified at Gate 4.',
      status: 'OPEN',
      contactPhone: '+91 98451 11200',
    },
  ]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      addToast('success', 'Preferences Updated', 'Settings and operational parameters saved.');
      addAuditLog('SETTINGS_UPDATED', `User updated configuration: ${Object.keys(newSettings).join(', ')}.`, 'DPDP_ACT_2023');
      return updated;
    });
  };

  const updateUserProfile = (profileData: { name: string; organization: string; phone: string; location: string }) => {
    setUserSession((prev) => {
      if (!prev) return prev;
      const updated: UserSession = {
        ...prev,
        name: profileData.name.trim() || prev.name,
        organization: profileData.organization.trim() || prev.organization,
        phone: profileData.phone.trim() || prev.phone,
        location: profileData.location.trim() || prev.location,
      };
      addToast('success', 'Profile Saved', `Profile updated for ${updated.name}.`);
      addAuditLog('USER_PROFILE_UPDATED', `User profile updated: ${updated.name} (${updated.organization}).`, 'DPDP_ACT_2023');
      return updated;
    });
  };

  const createSupportTicket = (ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'status'>) => {
    const ticketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...ticket,
      ticketId,
      createdAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'OPEN',
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    confetti({ particleCount: 60, spread: 50 });
    addToast('success', 'Grievance Ticket Lodged', `Support Ticket ${ticketId} created. Priority: ${ticket.priority}. Kisan Helpdesk dispatched.`);
    addAuditLog('SUPPORT_TICKET_RAISED', `Ticket ${ticketId} created under category ${ticket.category} with priority ${ticket.priority}.`, 'DPDP_ACT_2023');
    return ticketId;
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'toast-sec-01',
      type: 'info',
      title: 'Security Boundary Active',
      message: 'Zero-Trust RBAC enforced: Log in to access your authorized stakeholder console.',
      timestamp: 'Active',
    },
  ]);

  const addToast = (type: 'success' | 'warning' | 'info' | 'error', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (
    action: string,
    details: string,
    complianceTag: 'DPDP_ACT_2023' | 'APMC_MODEL_ACT' | 'AGMARK_STANDARDS'
  ) => {
    const newRecord: AdminAuditRecord = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      actor: userSession ? `${userSession.name} (${userSession.role.toUpperCase()})` : 'Unauthenticated Gateway',
      actorRole: userSession?.role || 'admin',
      action,
      details,
      hashSha256: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      complianceTag,
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  const canAccessDashboard = (targetRole: UserRole): boolean => {
    if (!isLoggedIn || !userSession) return false;
    return userSession.permittedDashboards.includes(targetRole);
  };

  const startGuidedJourney = () => {
    // Deprecated: Every user now operates on their dedicated, separate dashboard
  };

  const loginUser = (role: UserRole, customName?: string) => {
    const template = ROLE_USER_TEMPLATES[role];
    const generatedToken = 'dpdp_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const session: UserSession = {
      ...template,
      name: customName || template.name,
      tokenSha256: generatedToken,
    };

    setUserSession(session);
    setCurrentRole(role);
    setIsLoggedIn(true);

    addToast(
      'success',
      'Authenticated Successfully',
      `Welcome ${session.name}. Clearance: ${session.clearanceLevel}. Access locked to ${role.toUpperCase()} dashboard.`
    );

    addAuditLog(
      'USER_AUTHENTICATION_SUCCESS',
      `User ${session.name} authenticated as ${role.toUpperCase()} (ID: ${session.userId}) with cryptographic token ${generatedToken.substring(0, 12)}...`,
      'DPDP_ACT_2023'
    );
  };

  const logoutUser = () => {
    if (userSession) {
      addAuditLog(
        'USER_LOGOUT',
        `User ${userSession.name} (${userSession.role.toUpperCase()}) terminated session securely.`,
        'DPDP_ACT_2023'
      );
    }
    setIsLoggedIn(false);
    setUserSession(null);
    setCurrentRole(null);
    addToast('info', 'Signed Out', 'Terminated stakeholder session. Authentication required to view dashboards.');
  };

  const roleStepMap: UserRole[] = ['farmer', 'fpo', 'enam', 'mandi', 'truck', 'admin'];

  const setStepIndex = (index: number) => {
    if (index >= 0 && index < roleStepMap.length) {
      const targetRole = roleStepMap[index];
      setCurrentStepIndex(index);
      setCurrentRole(targetRole);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < roleStepMap.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextRole = roleStepMap[nextIndex];
      setCurrentStepIndex(nextIndex);
      setCurrentRole(nextRole);
      addToast('info', `Navigating to ${nextRole.toUpperCase()}`, `Checking role clearance for ${nextRole.toUpperCase()} console.`);
    } else {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      addToast('success', 'Pipeline Complete', 'End-to-End MandiFlow Supply Chain Journey completed!');
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevRole = roleStepMap[prevIndex];
      setCurrentStepIndex(prevIndex);
      setCurrentRole(prevRole);
    }
  };

  // Farmer Action
  const addPledge = (pledgeData: Partial<FarmerPledge> & { isReadyToSell?: boolean }) => {
    const newId = 'PLG-2026-' + Math.floor(885 + Math.random() * 100);
    const qtyQ = pledgeData.quantityQuintals || 25;
    const qtyKg = qtyQ * 100;
    const soloFreight = qtyQ * 160;
    const coalitionFreight = qtyQ * 98;
    const savingsPercent = Math.round(((soloFreight - coalitionFreight) / soloFreight) * 1000) / 10;

    const isImmediateReady = Boolean(pledgeData.isReadyToSell || pledgeData.status === 'READY_TO_SELL');
    const initialStatus = isImmediateReady ? 'READY_TO_SELL' : 'PLEDGED';

    const newPledge: FarmerPledge = {
      id: newId,
      farmerName: pledgeData.farmerName || userSession?.name || 'Rameshwar Patil',
      farmerPhone: pledgeData.farmerPhone || userSession?.phone || '+91 97230 11492',
      locationVillage: pledgeData.locationVillage || 'Pimpalgaon Rural',
      district: pledgeData.district || 'Nashik',
      state: pledgeData.state || 'Maharashtra',
      commodity: pledgeData.commodity || 'Tomato (Hybrid)',
      quantityQuintals: qtyQ,
      quantityKg: qtyKg,
      harvestDate: new Date().toISOString().substring(0, 16).replace('T', ' '),
      baseSli: 0.99,
      currentSli: 0.97,
      tempExposureC: 16.5,
      status: initialStatus,
      expectedRealizationPerQ: 2720,
      freightSoloInr: soloFreight,
      freightCoalitionInr: coalitionFreight,
      shapleySavingsPercent: savingsPercent,
      mspCompliant: true,
      createdAt: new Date().toISOString(),
    };

    setPledges((prev) => [newPledge, ...prev]);
    api.createPledge({ ...newPledge, isReadyToSell: isImmediateReady } as any);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });

    if (isImmediateReady) {
      playSmsNotificationChime();
      const smsMessage = `[MandiFlow / e-NAM Alert] Dear ${newPledge.farmerName}, your reported quantity of ${newPledge.quantityQuintals} Quintals of ${newPledge.commodity} is now READY TO SELL! Expected clearing price: ₹${newPledge.expectedRealizationPerQ.toLocaleString()}/Q. Reefer collection truck assigned at ${newPledge.locationVillage} Hub.`;
      const smsRecord: SmsAlertRecord = {
        id: 'sms-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        phoneNumber: newPledge.farmerPhone,
        recipientName: newPledge.farmerName,
        category: 'READY_TO_SELL',
        message: smsMessage,
        provider: 'Fast2SMS / Sandbox',
        lotId: newPledge.id,
        commodity: newPledge.commodity,
        quantityQuintals: newPledge.quantityQuintals,
      };
      setActiveSmsAlert(smsRecord);
      setSmsHistory((prev) => [smsRecord, ...prev]);

      addToast(
        'success',
        'Crop Registered & Ready to Sell 📱',
        `SMS alert sent to ${newPledge.farmerPhone}: "${newPledge.quantityQuintals} Q of ${newPledge.commodity} is READY TO SELL!"`
      );
    } else {
      addToast(
        'success',
        'Crop Pledge Registered',
        `${newPledge.commodity} (${qtyQ} Q) pledged with Shapley Coalition savings of ${savingsPercent}%.`
      );
    }

    addAuditLog(
      'FARMER_PLEDGE_REGISTERED',
      `Farmer ${newPledge.farmerName} registered lot ${newId} for ${newPledge.commodity} (${initialStatus}). Expected realization: ₹${newPledge.expectedRealizationPerQ}/Q.`,
      'DPDP_ACT_2023'
    );
  };

  const markPledgeReadyToSell = async (pledgeId: string) => {
    const targetPledge = pledges.find((p) => p.id === pledgeId);
    if (!targetPledge) return;

    // 1. Optimistic local update
    setPledges((prev) =>
      prev.map((p) => (p.id === pledgeId ? { ...p, status: 'READY_TO_SELL' } : p))
    );

    // 2. Play phone SMS chime
    playSmsNotificationChime();

    // 3. Dispatch to backend SMS Gateway
    const res = await api.notifyReadyToSell({
      pledgeId,
      farmerName: targetPledge.farmerName,
      farmerPhone: targetPledge.farmerPhone,
      commodity: targetPledge.commodity,
      quantityQuintals: targetPledge.quantityQuintals,
      expectedPrice: targetPledge.expectedRealizationPerQ,
      locationVillage: targetPledge.locationVillage,
    });

    const smsMessage =
      res?.smsResult?.messageText ||
      `[MandiFlow / e-NAM Alert] Dear ${targetPledge.farmerName}, your reported quantity of ${targetPledge.quantityQuintals} Quintals of ${targetPledge.commodity} is now READY TO SELL! Expected clearing price: ₹${targetPledge.expectedRealizationPerQ.toLocaleString()}/Q. Reefer collection truck assigned at ${targetPledge.locationVillage} Hub.`;

    const smsRecord: SmsAlertRecord = {
      id: 'sms-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      phoneNumber: targetPledge.farmerPhone,
      recipientName: targetPledge.farmerName,
      category: 'READY_TO_SELL',
      message: smsMessage,
      provider: res?.smsResult?.provider || 'Fast2SMS / Sandbox',
      lotId: targetPledge.id,
      commodity: targetPledge.commodity,
      quantityQuintals: targetPledge.quantityQuintals,
    };

    setActiveSmsAlert(smsRecord);
    setSmsHistory((prev) => [smsRecord, ...prev]);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    addToast(
      'success',
      'SMS Alert Dispatched 📱',
      `Sent to ${targetPledge.farmerPhone}: "${targetPledge.quantityQuintals} Q of ${targetPledge.commodity} is READY TO SELL!"`
    );

    addAuditLog(
      'SMS_ALERT_DISPATCHED',
      `Kisan SMS dispatched to +91 ${targetPledge.farmerPhone} (${targetPledge.farmerName}): Lot ${targetPledge.id} marked READY TO SELL.`,
      'DPDP_ACT_2023'
    );
  };

  // FPO Action
  const triggerGraspOptimization = (coalitionId: string) => {
    api.optimizeCoalition(coalitionId);
    setCoalitions((prev) =>
      prev.map((c) => {
        if (c.id === coalitionId) {
          return {
            ...c,
            status: 'OPTIMIZED',
            fillRatePercent: Math.min(95, c.fillRatePercent + 15),
            currentWeightKg: Math.min(c.maxCapacityKg, c.currentWeightKg + 2200),
            autoTriggered: true,
          };
        }
        return c;
      })
    );

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    addToast(
      'success',
      'GRASP Optimization Locked',
      `Combinatorial multi-bin packing completed for ${coalitionId}. Ethylene isolation constraints satisfied.`
    );

    addAuditLog(
      'GRASP_COALITION_OPTIMIZED',
      `FPO algorithm locked truck coalition ${coalitionId}. Fill rate enhanced to >85%. Fair Shapley weights recalculated.`,
      'APMC_MODEL_ACT'
    );
  };

  // e-NAM Action
  const placeBid = (lotNumber: string, bidAmount: number, bidderName: string) => {
    api.placeBid(lotNumber, bidAmount, bidderName);
    setEnamLots((prev) =>
      prev.map((lot) => {
        if (lot.lotNumber === lotNumber) {
          return {
            ...lot,
            currentHighestBidInr: bidAmount,
            highestBidder: bidderName,
            totalBidsCount: lot.totalBidsCount + 1,
          };
        }
        return lot;
      })
    );

    addToast(
      'success',
      'e-NAM Bid Broadcasted',
      `New highest bid of ₹${bidAmount}/Q placed for Lot ${lotNumber} by ${bidderName}.`
    );

    addAuditLog(
      'ENAM_BID_PLACED',
      `Bidder ${bidderName} placed ₹${bidAmount}/Q on lot ${lotNumber} through e-NAM Unified Clearing.`,
      'AGMARK_STANDARDS'
    );
  };

  const hammerAuction = (lotNumber: string) => {
    api.hammerAuction(lotNumber);
    setEnamLots((prev) =>
      prev.map((lot) => {
        if (lot.lotNumber === lotNumber) {
          return {
            ...lot,
            status: 'HAMMER_SOLD',
            bidEndTime: 'Auction Closed - Winner Declared',
          };
        }
        return lot;
      })
    );

    confetti({
      particleCount: 100,
      spread: 80,
    });

    addToast('success', 'e-NAM Auction Hammer Struck!', `Lot ${lotNumber} officially sold and e-NWR warehouse receipt sealed.`);
    addAuditLog('ENAM_AUCTION_HAMMER', `Lot ${lotNumber} hammered down to highest bidder. Trade escrow activated.`, 'APMC_MODEL_ACT');
  };

  const updateReservePrice = (lotNumber: string, newReserve: number) => {
    setEnamLots((prev) =>
      prev.map((lot) => {
        if (lot.lotNumber === lotNumber) {
          return {
            ...lot,
            reservePriceInr: newReserve,
            // If highest bid is below new reserve, update current bid to match reserve
            currentHighestBidInr: Math.max(lot.currentHighestBidInr, newReserve),
            totalBidsCount: lot.totalBidsCount + 1,
            highestBidder: 'AI Reserve Matched (e-NAM Clearing)',
          };
        }
        return lot;
      })
    );

    addToast('success', 'AI Reserve Floor Applied', `Lot ${lotNumber} reserve updated to ₹${newReserve}/Q based on historical model training.`);
    addAuditLog('ENAM_RESERVE_UPDATED', `Lot ${lotNumber} reserve price calibrated to ₹${newReserve}/Q using trained previous dataset regression weights.`, 'AGMARK_STANDARDS');
  };

  // Mandi Action
  const commitWeighment = (gatePassId: string, grossKg: number, tareKg: number) => {
    api.commitWeighment(gatePassId, grossKg, tareKg);
    const netKg = grossKg - tareKg;
    setGateWeighments((prev) =>
      prev.map((gw) => {
        if (gw.gatePassId === gatePassId) {
          const discrepancy = netKg - gw.expectedWeightKg;
          const discPct = Math.round((discrepancy / gw.expectedWeightKg) * 10000) / 100;
          const status = Math.abs(discPct) <= 2.0 ? 'TOLERANCE_PASS' : 'DISCREPANCY_FLAGGED';

          return {
            ...gw,
            grossWeightKg: grossKg,
            tareWeightKg: tareKg,
            actualNetWeightKg: netKg,
            discrepancyKg: discrepancy,
            discrepancyPercent: discPct,
            discrepancyStatus: status,
            status: 'WEIGHED',
          };
        }
        return gw;
      })
    );

    addToast('success', 'APMC Weighment Certified', `Gross: ${grossKg} kg | Tare: ${tareKg} kg | Net: ${netKg} kg recorded.`);
    addAuditLog(
      'APMC_WEIGHMENT_COMMITTED',
      `Gate pass ${gatePassId} certified on Digital Weighbridge scale. Net ${netKg} kg.`,
      'APMC_MODEL_ACT'
    );
  };

  // Truck Action
  const toggleReeferFault = () => {
    api.toggleTruckFault();
    setTruckTelemetry((prev) => {
      const isFaulty = prev.reeferStatus === 'TEMP_WARNING';
      const newStatus = isFaulty ? 'COOLING_OPTIMAL' : 'TEMP_WARNING';
      const newTemp = isFaulty ? 11.8 : 23.4;
      const newRisk = isFaulty ? 4.8 : 42.6;

      if (!isFaulty) {
        addToast('error', 'Reefer Telematics Alert!', 'Chamber compressor malfunction detected! Ambient temperature rising to 23.4°C.');
      } else {
        addToast('success', 'Reefer Recovered', 'Secondary cooling unit activated. Chamber returning to 11.8°C.');
      }

      return {
        ...prev,
        reeferStatus: newStatus,
        chamberTempC: newTemp,
        spoilageRiskScore: newRisk,
      };
    });
  };

  const advanceTruckMilestone = () => {
    api.advanceTruckMilestone();
    setTruckTelemetry((prev) => {
      const uncompletedIndex = prev.milestones.findIndex((m) => !m.completed);
      if (uncompletedIndex === -1) return prev;

      const newMilestones = [...prev.milestones];
      newMilestones[uncompletedIndex] = {
        ...newMilestones[uncompletedIndex],
        completed: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      addToast('info', 'Truck Waypoint Milestone Reached', `${newMilestones[uncompletedIndex].name} verified by RFID / Fastag.`);
      return {
        ...prev,
        distanceCoveredKm: Math.min(prev.totalDistanceKm, prev.distanceCoveredKm + 95),
        milestones: newMilestones,
      };
    });
  };

  const advanceTruckLocation = (kmDelta = 20) => {
    api.advanceTruckLocation(kmDelta);
    setTruckTelemetry((prev) => {
      const newDist = Math.min(prev.totalDistanceKm, prev.distanceCoveredKm + kmDelta);
      const corridorWaypoints = [
        { km: 0, name: 'Sahyadri FPO Center, Pimpalgaon Baswant (MH)', lat: 20.1754, lng: 73.9877 },
        { km: 145, name: 'Dhule NH-52 Junction Toll Plaza', lat: 20.9042, lng: 74.7749 },
        { km: 250, name: 'Sendhwa MP State Border Fastag Barrier', lat: 21.6881, lng: 75.0938 },
        { km: 410, name: 'Indore Multi-Modal Freight Hub', lat: 22.7196, lng: 75.8577 },
        { km: 660, name: 'Kota Chambal Expressway Bridge', lat: 25.1825, lng: 75.8398 },
        { km: 810, name: 'Jaipur South Smart Corridor (NH-48)', lat: 26.9124, lng: 75.7873 },
        { km: 890, name: 'NH-48 Kotputli Smart Corridor', lat: 27.7025, lng: 76.1983 },
        { km: 1020, name: 'Manesar Electronic Weighbridge Toll', lat: 28.3512, lng: 76.9428 },
        { km: 1140, name: 'Azadpur APMC Mandi Inbound Gate (Delhi)', lat: 28.7155, lng: 77.1810 },
      ];
      let currentWaypoint = corridorWaypoints[0];
      for (const wp of corridorWaypoints) {
        if (newDist >= wp.km) {
          currentWaypoint = wp;
        }
      }
      return {
        ...prev,
        distanceCoveredKm: newDist,
        currentLocation: {
          name: currentWaypoint.name,
          lat: currentWaypoint.lat + (Math.random() - 0.5) * 0.005,
          lng: currentWaypoint.lng + (Math.random() - 0.5) * 0.005,
        },
        speedKmH: Math.floor(54 + Math.random() * 12),
        headingDeg: Math.floor(20 + Math.random() * 10),
        headingText: 'NNE',
        lastPingTimestamp: 'Just now (0s ago)',
      };
    });
  };

  const updateTruckTelemetryData = (partial: Partial<TruckTelemetry>) => {
    api.updateTruckTelemetry(partial);
    setTruckTelemetry((prev) => ({ ...prev, ...partial }));
  };

  const signTruckEpod = (recipientName: string) => {
    api.signTruckEpod(recipientName);
    setTruckTelemetry((prev) => ({
      ...prev,
      epodSigned: true,
      epodRecipientName: recipientName,
      epodTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    confetti({
      particleCount: 80,
      spread: 60,
    });

    addToast('success', 'ePoD Cryptographically Signed', `Consignment received by ${recipientName}. Driver escrow released.`);
    addAuditLog('EPOD_SIGNED', `Digital Proof of Delivery signed by ${recipientName} for truck ${truckTelemetry.registrationNumber}.`, 'DPDP_ACT_2023');
  };

  const refreshWeather = async (options?: {
    city?: string;
    lat?: number;
    lon?: number;
    commodity?: string;
    harvestDate?: string;
    isReefer?: boolean;
  }) => {
    setIsLoadingWeather(true);
    try {
      const res = await api.getWeather({
        city: options?.city,
        lat: options?.lat,
        lon: options?.lon,
        apiKey: weatherApiKey || undefined,
        commodity: options?.commodity || 'Tomato (Hybrid)',
        harvestDate: options?.harvestDate,
        isReefer: options?.isReefer,
      });
      if (res) {
        setWeatherData(res);
        addToast('info', 'Weather & Freshness Synchronized', `${res.location}: ${res.temperatureC}°C, ${res.weatherCondition}.`);
      }
    } catch (err) {
      console.warn('[AppContext] Weather refresh failed:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const detectDeviceLocationAndWeather = async (showToast = true): Promise<WeatherData | null> => {
    setIsLoadingWeather(true);
    let weatherResult: WeatherData | null = null;

    const queryWithCoords = async (lat: number, lon: number, accuracy?: number) => {
      const data = await api.getWeather({
        lat,
        lon,
        accuracyMeters: accuracy,
        isDeviceLocation: true,
        apiKey: weatherApiKey || undefined,
      });
      if (data) {
        setWeatherData(data);
        weatherResult = data;
        if (showToast) {
          addToast(
            'success',
            'Device Location & Weather Detected',
            `📍 ${data.location}: ${data.temperatureC}°C (${data.weatherCondition}). Produce safe for ${data.freshness.safeHoursRemaining} hours.`
          );
        }
        if (data.notificationSeverity === 'ALERT' || data.notificationSeverity === 'WARNING') {
          playSmsNotificationChime();
        }
      }
    };

    // 1. Try Browser Geolocation API
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0,
          });
        });
        await queryWithCoords(
          position.coords.latitude,
          position.coords.longitude,
          Math.round(position.coords.accuracy)
        );
        setIsLoadingWeather(false);
        return weatherResult;
      } catch (geoErr) {
        console.warn('[AppContext] Browser GPS unavailable or timed out, trying IP-based fallback:', geoErr);
      }
    }

    // 2. IP-based location fallback (works when GPS permission is denied or blocked)
    try {
      const ipRes = await fetch('http://ip-api.com/json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.lat && ipData.lon) {
          await queryWithCoords(ipData.lat, ipData.lon, 2500);
          setIsLoadingWeather(false);
          return weatherResult;
        }
      }
    } catch (ipErr) {
      console.warn('[AppContext] IP geolocation fallback failed:', ipErr);
    }

    // 3. Fallback to Nashik Agricultural Mandi Belt
    const defaultData = await api.getWeather({ city: 'Nashik', apiKey: weatherApiKey || undefined });
    if (defaultData) {
      setWeatherData(defaultData);
      weatherResult = defaultData;
    }
    setIsLoadingWeather(false);
    return weatherResult;
  };

  const setWeatherApiKey = async (key: string): Promise<boolean> => {
    setWeatherApiKeyInternal(key);
    setIsLoadingWeather(true);
    try {
      const res = await api.configureWeatherApiKey(key);
      if (res && res.success) {
        setWeatherData(res.data);
        addToast(
          res.apiKeyActive ? 'success' : 'info',
          res.apiKeyActive ? 'OpenWeatherMap Key Active' : 'API Key Saved',
          res.message
        );
        return res.apiKeyActive;
      }
    } catch (err) {
      addToast('error', 'API Key Error', 'Failed to communicate with weather gateway.');
    } finally {
      setIsLoadingWeather(false);
    }
    return false;
  };

  const runDatasetEngine = async (options?: {
    algorithm?: DatasetAlgorithm;
    epochs?: number;
    testSplitPct?: number;
    learningRate?: number;
  }): Promise<DatasetRunResult> => {
    setIsRunningDataset(true);
    try {
      const result = await api.runDataset(options);
      setDatasetRunResult(result);
      addToast(
        'success',
        'Dataset Run Complete',
        `${result.algorithmName} achieved ${result.accuracyPercentage}% Accuracy on ${result.totalRecordsProcessed} records.`
      );
      addAuditLog(
        'DATASET_MODEL_RUN',
        `Executed dataset model (${result.algorithmName}). Accuracy: ${result.accuracyPercentage}%, R²: ${result.r2Score}.`,
        'AGMARK_STANDARDS'
      );
      return result;
    } finally {
      setIsRunningDataset(false);
    }
  };

  // Real-Time Backend & WebSocket Synchronization + Auto-Detect Device Weather on Boot
  useEffect(() => {
    // 1. Initial hydration from REST API if online
    api.getCommodities().then((data) => { if (data) setCommodities(data); });
    api.getPledges().then((data) => { if (data) setPledges(data); });
    api.getCoalitions().then((data) => { if (data) setCoalitions(data); });
    api.getEnamLots().then((data) => { if (data) setEnamLots(data); });
    api.getGateWeighments().then((data) => { if (data) setGateWeighments(data); });
    api.getTruckTelemetry().then((data) => { if (data) setTruckTelemetry(data); });
    api.getAuditLogs().then((data) => { if (data) setAuditLogs(data); });
    api.getOrdersHistory().then((data) => { if (data) setUserOrderHistory(data); });

    // 2. Auto-detect weather automatically as per current device location immediately
    detectDeviceLocationAndWeather(false);

    api.getWeatherKeyStatus().then((status) => {
      if (status?.configured) {
        // Key already configured on backend
      }
    });

    // 3. Real-Time WebSocket live push listener
    const unsubscribe = api.subscribe((event) => {
      switch (event.type) {
        case 'COMMODITY_PRICE_UPDATE':
          if (Array.isArray(event.payload)) setCommodities(event.payload);
          break;
        case 'NEW_PLEDGE':
          setPledges((prev) => {
            if (prev.some((p) => p.id === event.payload.id)) return prev;
            return [event.payload, ...prev];
          });
          break;
        case 'PLEDGE_UPDATED':
          setPledges((prev) => prev.map((p) => (p.id === event.payload.id ? event.payload : p)));
          break;
        case 'COALITION_UPDATED':
          setCoalitions((prev) => prev.map((c) => (c.id === event.payload.id ? event.payload : c)));
          break;
        case 'NEW_BID':
        case 'AUCTION_HAMMERED':
          setEnamLots((prev) => prev.map((l) => (l.lotNumber === event.payload.lotNumber ? event.payload : l)));
          break;
        case 'WEIGHMENT_COMMITTED':
          setGateWeighments((prev) => prev.map((w) => (w.gatePassId === event.payload.gatePassId ? event.payload : w)));
          break;
        case 'TELEMETRY_TICK':
          setTruckTelemetry((prev) => ({ ...prev, ...event.payload }));
          break;
        case 'AUDIT_LOG_ENTRY':
          setAuditLogs((prev) => {
            if (prev.some((a) => a.id === event.payload.id)) return prev;
            return [event.payload, ...prev];
          });
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const resetDemoData = () => {
    setPledges(INITIAL_FARMER_PLEDGES);
    setCoalitions(INITIAL_COALITIONS);
    setEnamLots(INITIAL_ENAM_LOTS);
    setGateWeighments(INITIAL_GATE_WEIGHMENTS);
    setTruckTelemetry(INITIAL_TRUCK_TELEMETRY);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentStepIndex(0);
    addToast('info', 'Demo State Reset', 'Fresh agricultural mock data and supply-chain states loaded.');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isLoggedIn,
        userSession,
        loginUser,
        logoutUser,
        canAccessDashboard,
        stepByStepMode,
        setStepByStepMode,
        currentStepIndex,
        goToNextStep,
        goToPreviousStep,
        setStepIndex,
        startGuidedJourney,
        commodities,
        pledges,
        addPledge,
        markPledgeReadyToSell,
        activeSmsAlert,
        setActiveSmsAlert,
        smsHistory,
        coalitions,
        triggerGraspOptimization,
        enamLots,
        placeBid,
        hammerAuction,
        updateReservePrice,
        gateWeighments,
        commitWeighment,
        truckTelemetry,
        toggleReeferFault,
        advanceTruckMilestone,
        advanceTruckLocation,
        updateTruckTelemetryData,
        signTruckEpod,
        auditLogs,
        addAuditLog,
        commissionRate,
        setCommissionRate,
        mandiCess,
        setMandiCess,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        settings,
        updateSettings,
        updateUserProfile,
        isSettingsOpen,
        setIsSettingsOpen,
        isHelpSupportOpen,
        setIsHelpSupportOpen,
        supportTickets,
        createSupportTicket,
        isProfitModalOpen,
        setIsProfitModalOpen,
        isDeliveryTrackerModalOpen,
        setIsDeliveryTrackerModalOpen,
        userOrderHistory,
        isOrderHistoryModalOpen,
        setIsOrderHistoryModalOpen,
        weatherData,
        isLoadingWeather,
        weatherApiKey,
        setWeatherApiKey,
        refreshWeather,
        detectDeviceLocationAndWeather,
        isWeatherModalOpen,
        setIsWeatherModalOpen,
        isDatasetModalOpen,
        setIsDatasetModalOpen,
        datasetRunResult,
        isRunningDataset,
        runDatasetEngine,
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
