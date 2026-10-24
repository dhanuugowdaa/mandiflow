export type UserRole = 'farmer' | 'fpo' | 'enam' | 'mandi' | 'truck' | 'admin';

export interface UserSession {
  role: UserRole;
  name: string;
  userId: string;
  organization: string;
  location: string;
  phone: string;
  avatarColor: string;
  clearanceLevel: 'LEVEL_1_FARMER' | 'LEVEL_2_FPO' | 'LEVEL_3_ENAM' | 'LEVEL_3_MANDI' | 'LEVEL_2_TRUCK' | 'LEVEL_4_APEX_ADMIN';
  permittedDashboards: UserRole[];
  tokenSha256: string;
}

export type CommodityType = 
  | 'Tomato (Hybrid)' 
  | 'Onion (Nashik Red)' 
  | 'Potato (Kufri Jyoti)' 
  | 'Green Chilli (G4)' 
  | 'Cauliflower (Snowball)' 
  | 'Cabbage (Golden Acre)' 
  | 'Capsicum (Green Bell)' 
  | 'Eggplant (Brinjal)' 
  | 'Okra / Bhindi (Lady Finger)' 
  | 'Green Peas (Matar)';

export type LifecycleState = 
  | 'DRAFT'
  | 'PLEDGED'
  | 'READY_TO_SELL'
  | 'AWAITING_APMC_CONFIRMATION'
  | 'APMC_ACCEPTED'
  | 'TRUCK_ASSIGNED'
  | 'TRUCK_EN_ROUTE_PICKUP'
  | 'COLLECTED_LOADED'
  | 'MATCHED'
  | 'ALLOCATED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'WEIGHED_APMC'
  | 'AUCTIONED_SOLD'
  | 'SETTLED';

export interface CommodityMarketData {
  id: string;
  name: CommodityType;
  variety: string;
  modalPrice: number; // INR per quintal (100 kg)
  minPrice: number;
  maxPrice: number;
  msp: number; // Minimum Support Price
  dailyChange: number; // Percentage
  ethyleneType: 'EMITTER' | 'SENSITIVE' | 'NEUTRAL';
  baseShelfLifeHours: number;
  tempOptimalC: number;
  perishable: boolean;
}

export interface FarmerPledge {
  id: string;
  farmerName: string;
  farmerPhone: string;
  locationVillage: string;
  district: string;
  state: string;
  commodity: CommodityType;
  quantityQuintals: number;
  quantityKg: number;
  harvestDate: string;
  baseSli: number; // Shelf Life Index 0.00 to 1.00
  currentSli: number;
  tempExposureC: number;
  status: LifecycleState;
  expectedRealizationPerQ: number;
  freightSoloInr: number;
  freightCoalitionInr: number;
  shapleySavingsPercent: number;
  assignedFpoId?: string;
  assignedCoalitionId?: string;
  assignedTruckId?: string;
  apmcAcceptedAt?: string;
  assignedTruckDriverName?: string;
  assignedTruckDriverPhone?: string;
  assignedTruckPlate?: string;
  mspCompliant: boolean;
  createdAt: string;
}

export interface FpoCoalition {
  id: string;
  name: string;
  fpoName: string;
  originCenter: string;
  destinationMandi: string;
  truckType: '16T_REEFER' | '24T_REEFER' | '9T_VENTILATED';
  maxCapacityKg: number;
  currentWeightKg: number;
  volumeCapacityM3: number;
  currentVolumeM3: number;
  fillRatePercent: number;
  ethyleneSafe: boolean;
  autoTriggered: boolean;
  xgboostFillProb: number;
  status: 'AGGREGATING' | 'OPTIMIZED' | 'DISPATCHED' | 'DELIVERED';
  pledgeIds: string[];
  totalFreightCost: number;
  estimatedArrival: string;
}

export interface EnamAuctionLot {
  lotNumber: string;
  commodity: CommodityType;
  variety: string;
  originFpo: string;
  quantityBags: number;
  netWeightQuintals: number;
  qualityAssaying: {
    grade: 'FAQ Grade-A' | 'FAQ Grade-B' | 'Special Premium';
    moisturePercent: number;
    foreignMatterPercent: number;
    sizeUniformityPercent: number;
    assayDate: string;
    labInspector: string;
  };
  reservePriceInr: number;
  currentHighestBidInr: number;
  highestBidder: string;
  bidEndTime: string;
  totalBidsCount: number;
  status: 'ACTIVE_BIDDING' | 'FINALIZING' | 'HAMMER_SOLD';
  enwrNumber: string;
  deliveryMandi: string;
}

export interface MandiGateWeighment {
  gatePassId: string;
  vehicleNumber: string;
  transporterName: string;
  driverName: string;
  driverPhone: string;
  commodity: CommodityType;
  expectedWeightKg: number;
  grossWeightKg: number;
  tareWeightKg: number;
  actualNetWeightKg: number;
  discrepancyKg: number;
  discrepancyPercent: number;
  discrepancyStatus: 'TOLERANCE_PASS' | 'DISCREPANCY_FLAGGED';
  arhatiyaName: string; // Commission agent
  commissionRatePercent: number;
  mandiCessPercent: number;
  entryTimestamp: string;
  status: 'PENDING_WEIGHMENT' | 'WEIGHED' | 'CLEARED_FOR_AUCTION';
}

export interface TruckTelemetry {
  truckId: string;
  registrationNumber: string;
  driverName: string;
  driverPhone: string;
  model: string;
  currentLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  routeOrigin: string;
  routeDestination: string;
  distanceCoveredKm: number;
  totalDistanceKm: number;
  reeferStatus: 'COOLING_OPTIMAL' | 'TEMP_WARNING' | 'STANDBY';
  chamberTempC: number;
  targetTempC: number;
  chamberHumidityPercent: number;
  ethylenePpm: number;
  spoilageRiskScore: number; // 0 - 100
  milestones: {
    name: string;
    completed: boolean;
    timestamp?: string;
  }[];
  epodSigned: boolean;
  epodRecipientName?: string;
  epodTimestamp?: string;
  speedKmH?: number;
  headingDeg?: number;
  headingText?: string;
  altitudeM?: number;
  gnssSatellites?: number;
  fastagLastToll?: string;
  fastagNextToll?: string;
  isLiveTrackingActive?: boolean;
  lastPingTimestamp?: string;
  collectionStatus?: 'IDLE' | 'EN_ROUTE_PICKUP' | 'COLLECTED_LOADED' | 'TRANSIT_TO_APMC';
  assignedFarmerName?: string;
  assignedFarmerPhone?: string;
  assignedCommodity?: string;
  assignedQuantityQuintals?: number;
  assignedPledgeId?: string;
  pickupVillage?: string;
}

export interface AdminAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  hashSha256: string;
  complianceTag: 'DPDP_ACT_2023' | 'APMC_MODEL_ACT' | 'AGMARK_STANDARDS';
}

export interface UserSettings {
  preferredLanguage: string;
  defaultMandiId: number;
  statutoryCommissionPct: number;
  statutoryCessPct: number;
  smsAlertsEnabled: boolean;
  reeferTempAlertsEnabled: boolean;
  whatsappInvoicesEnabled: boolean;
  highContrastSunlightMode: boolean;
  themeAccent: 'emerald' | 'saffron' | 'sky';
  autoLogoutMinutes: number;
  dpdpStrictCompliance: boolean;
}

export interface SupportTicket {
  ticketId: string;
  createdAt: string;
  category: 'ESCROW_PAYMENT' | 'WEIGHBRIDGE_TOLERANCE' | 'REEFER_COLD_CHAIN' | 'ENAM_BIDDING' | 'MSP_FLOOR_PRICE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  subject: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  contactPhone: string;
}

export interface ProfitComparisonParams {
  commodity: CommodityType;
  quantityQuintals: number;
  distanceKm: number;
  modalPricePerQ: number;
}

export interface ProfitComparisonResult {
  params: ProfitComparisonParams;
  traditional: {
    grossRevenue: number;
    freightCost: number;
    freightPerQ: number;
    spoilageLossKg: number;
    spoilageLossInr: number;
    spoilagePercent: number;
    middlemanCutInr: number;
    middlemanPercent: number;
    weighingLossInr: number;
    weighingLossKg: number;
    totalDeductions: number;
    netFarmerInHand: number;
    effectivePricePerQ: number;
  };
  mandiFlow: {
    grossRevenue: number;
    freightCost: number;
    freightPerQ: number;
    spoilageLossKg: number;
    spoilageLossInr: number;
    spoilagePercent: number;
    statutoryCessInr: number;
    statutoryPercent: number;
    weighingLossInr: number;
    totalDeductions: number;
    netFarmerInHand: number;
    effectivePricePerQ: number;
  };
  comparison: {
    extraProfitInr: number;
    profitIncreasePercent: number;
    freightSavedInr: number;
    freightSavingsPercent: number;
    spoilageSavedInr: number;
    commissionSavedInr: number;
    weighingSavedInr: number;
  };
}

export interface SmsAlertRecord {
  id: string;
  timestamp: string;
  phoneNumber: string;
  recipientName: string;
  category: 'READY_TO_SELL' | 'OTP' | 'BID_UPDATE' | 'DISPATCH';
  message: string;
  provider: string;
  lotId?: string;
  commodity?: string;
  quantityQuintals?: number;
}

export interface CommodityFreshnessInfo {
  commodity: string;
  category: 'ULTRA_PERISHABLE' | 'MEDIUM_PERISHABLE' | 'DURABLE';
  baseShelfLifeHours: number;
  safeHoursRemaining: number;
  freshnessPercent: number;
  spoilageKineticsMultiplier: number;
  qualityGrade: 'FAQ Grade-A' | 'FAQ Grade-B' | 'Spoilage Imminent';
  safeUntilDate: string;
  statusMessage: string;
  recommendedAction: string;
  storageCondition: 'AMBIENT_AIR' | 'REEFER_COLD_CHAIN';
}

export interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  weatherCondition: string;
  weatherCode?: number;
  source: 'OPENWEATHER_API' | 'OPEN_METEO_AUTO_REALTIME' | 'CLIMATIC_MODEL';
  apiKeyConfigured: boolean;
  apiKeyActive: boolean;
  isDeviceLocation?: boolean;
  accuracyMeters?: number;
  timestamp: string;
  weatherNotification: string;
  notificationSeverity: 'INFO' | 'WARNING' | 'ALERT';
  freshness: CommodityFreshnessInfo;
}

export interface UserOrderHistoryRecord {
  orderId: string;
  pledgeId: string;
  ewayBill: string;
  date: string;
  deliveryDate?: string;
  commodity: CommodityType;
  variety: string;
  quantityQuintals: number;
  quantityBags: number;
  status: 'IN_TRANSIT' | 'DELIVERED_PAID' | 'AUCTIONED_SOLD' | 'PROCESSING';
  statusDisplay: string;
  destinationMandi: string;
  originHub: string;
  sellingPricePerQ: number;
  grossAmountInr: number;
  transportCostInr: number;
  soloTransportCostInr: number;
  netRealizationInr: number;
  savingsVsSoloInr: number;
  commissionSavedInr: number;
  totalSavedInr: number;
  dbtPaymentStatus: 'CREDITED_DBT' | 'IN_ESCROW' | 'PROCESSING';
  dbtUtrNumber: string;
  dbtBankName: string;
  dbtAccountNumberMasked: string;
  truckRegistration: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  invoiceNumber: string;
  qualityGrade: string;
  freshnessPercent: number;
}

export interface UserBankAccountInfo {
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  accountType: string;
  dbtVerificationStatus: 'VERIFIED_ACTIVE' | 'PENDING';
  totalCreditedInr: number;
  escrowPendingInr: number;
  lastCreditDate: string;
  lastCreditAmountInr: number;
  lastUtrNumber: string;
}

export interface UserHistoryStatement {
  farmerName: string;
  farmerPhone: string;
  village: string;
  kisanId: string;
  memberSince: string;
  totalOrdersCount: number;
  totalSalesInr: number;
  totalFreightSavedInr: number;
  totalCommissionSavedInr: number;
  totalCumulativeSavingsInr: number;
  totalQuintalsDispatched: number;
  averageNetPriceRealizedPerQ: number;
  dbtSuccessRatePercent: number;
  bankAccount: UserBankAccountInfo;
  savingsBreakdown: {
    freightSavedInr: number;
    commissionSavedInr: number;
    spoilagePreventedInr: number;
    weighingLossPreventedInr: number;
    totalProfitBoostInr: number;
    percentageProfitBoost: number;
  };
  orders: UserOrderHistoryRecord[];
}

export type DatasetAlgorithm =
  | 'LINEAR_REGRESSION'
  | 'RANDOM_FOREST'
  | 'GRADIENT_BOOST_XGB'
  | 'NEURAL_NETWORK_MLP';

export interface DatasetSampleComparison {
  id: number;
  crop: string;
  variety: string;
  mandiName: string;
  arrivalQtyTonnes: number;
  grade: 'A' | 'B' | 'C';
  actualPriceInrQ: number;
  predictedPriceInrQ: number;
  varianceInrQ: number;
  sampleAccuracyPct: number;
  status: 'EXACT' | 'ACCURATE' | 'ACCEPTABLE' | 'DEVIATED';
}

export interface DatasetRunResult {
  runId: string;
  timestamp: string;
  algorithm: DatasetAlgorithm;
  algorithmName: string;
  epochs: number;
  testSplitPct: number;
  learningRate: number;
  totalRecordsProcessed: number;
  trainRecordsCount: number;
  testRecordsCount: number;
  accuracyPercentage: number;
  validationAccuracyPct: number;
  r2Score: number;
  meanAbsoluteErrorInr: number;
  meanSquaredError: number;
  rootMeanSquaredError: number;
  f1Score: number;
  inferenceLatencyMs: number;
  trainingDurationSec: number;
  commodityAccuracy: {
    crop: string;
    accuracyPct: number;
    sampleCount: number;
  }[];
  mandiAccuracy: {
    mandiName: string;
    accuracyPct: number;
    sampleCount: number;
  }[];
  epochLossHistory: {
    epoch: number;
    trainingLoss: number;
    validationAccuracy: number;
  }[];
  sampleComparisons: DatasetSampleComparison[];
  terminalLogs: string[];
}

