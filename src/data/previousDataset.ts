// User's authentic previous dataset from xevryn/data/sample/
export interface HistoricalMarketPriceRecord {
  id: number;
  marketId: number;
  marketName: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  grade: 'A' | 'B' | 'C';
  minPriceInrKg: number;
  modalPriceInrKg: number;
  maxPriceInrKg: number;
  modalPricePerQuintal: number;
  arrivalQtyTonnes: number;
  observedAt: string;
  source: string;
}

export interface HistoricalMarketInfo {
  id: number;
  name: string;
  apmcCode: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  commissionRatePct: number;
  cessRatePct: number;
  platformFeePct: number;
}

export interface HistoricalFarmerRecord {
  id: number;
  name: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: string;
  identityRef: string;
  fpoId: number;
}

export interface HistoricalPledgeRecord {
  id: number;
  farmerId: number;
  farmerName: string;
  crop: string;
  variety: string;
  grade: string;
  quantityKg: number;
  quantityQuintals: number;
  harvestReadyAt: string;
  collectionPoint: string;
  spoilageWindowHours: number;
  status: string;
}

// Exactly imported from previous dataset files:
export const PREVIOUS_MARKETS: HistoricalMarketInfo[] = [
  { id: 1, name: 'Kolar APMC Mandi', apmcCode: 'KA-KOL-APMC-01', district: 'Kolar', state: 'Karnataka', latitude: 13.1367, longitude: 78.1340, commissionRatePct: 6.0, cessRatePct: 1.5, platformFeePct: 1.5 },
  { id: 2, name: 'Yeshwanthpur APMC Bangalore', apmcCode: 'KA-BLR-APMC-02', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 13.0238, longitude: 77.5529, commissionRatePct: 6.5, cessRatePct: 2.0, platformFeePct: 1.5 },
  { id: 3, name: 'Binny Mill (Flower & Veg) Mandi', apmcCode: 'KA-BLR-APMC-03', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9716, longitude: 77.5645, commissionRatePct: 5.5, cessRatePct: 1.5, platformFeePct: 1.5 },
  { id: 4, name: 'Chintamani APMC', apmcCode: 'KA-CHI-APMC-04', district: 'Chikkaballapur', state: 'Karnataka', latitude: 13.4011, longitude: 78.0569, commissionRatePct: 6.0, cessRatePct: 1.5, platformFeePct: 1.5 },
  { id: 5, name: 'Hosur Uzhavar Sandhai', apmcCode: 'TN-KRI-APMC-05', district: 'Krishnagiri', state: 'Tamil Nadu', latitude: 12.7409, longitude: 77.8253, commissionRatePct: 5.0, cessRatePct: 1.0, platformFeePct: 1.5 },
  { id: 6, name: 'Madanapalle Tomato Yard', apmcCode: 'AP-ANN-APMC-06', district: 'Annamayya', state: 'Andhra Pradesh', latitude: 13.5560, longitude: 78.5010, commissionRatePct: 7.0, cessRatePct: 2.0, platformFeePct: 1.5 },
];

export const PREVIOUS_FARMERS: HistoricalFarmerRecord[] = [
  { id: 1, name: 'Ramesh Gowda', village: 'Vokkaleri', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90812', fpoId: 1 },
  { id: 2, name: 'Manjunath Reddy', village: 'Mulbagal', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90813', fpoId: 1 },
  { id: 3, name: 'Anjanamma K', village: 'Bangarapet', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90814', fpoId: 1 },
  { id: 4, name: 'Venkataswamy N', village: 'Chintamani Rural', district: 'Chikkaballapur', state: 'Karnataka', preferredLanguage: 'te', identityRef: 'PARTNER-REF-90815', fpoId: 2 },
  { id: 5, name: 'Suresh Babu', village: 'Shidlaghatta', district: 'Chikkaballapur', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90816', fpoId: 2 },
  { id: 6, name: 'Lakshmi Devi', village: 'Malur Town', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90817', fpoId: 3 },
  { id: 7, name: 'Mohammed Ismail', village: 'Srinivaspur', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'ur', identityRef: 'PARTNER-REF-90818', fpoId: 4 },
  { id: 8, name: 'Narayanappa', village: 'Kurugal', district: 'Kolar', state: 'Karnataka', preferredLanguage: 'kn', identityRef: 'PARTNER-REF-90819', fpoId: 1 },
];

export const PREVIOUS_MARKET_PRICES: HistoricalMarketPriceRecord[] = [
  { id: 1, marketId: 1, marketName: 'Kolar APMC Mandi', district: 'Kolar', state: 'Karnataka', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', minPriceInrKg: 18.00, modalPriceInrKg: 22.50, maxPriceInrKg: 26.00, modalPricePerQuintal: 2250.00, arrivalQtyTonnes: 85.5, observedAt: '2026-10-23T04:30:00Z', source: 'Agmarknet Kolar' },
  { id: 2, marketId: 2, marketName: 'Yeshwanthpur APMC Bangalore', district: 'Bengaluru Urban', state: 'Karnataka', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', minPriceInrKg: 22.00, modalPriceInrKg: 27.00, maxPriceInrKg: 31.00, modalPricePerQuintal: 2700.00, arrivalQtyTonnes: 120.0, observedAt: '2026-10-23T04:00:00Z', source: 'Agmarknet BLR' },
  { id: 3, marketId: 3, marketName: 'Binny Mill (Flower & Veg) Mandi', district: 'Bengaluru Urban', state: 'Karnataka', crop: 'Tomato (Hybrid)', variety: 'Local', grade: 'B', minPriceInrKg: 16.00, modalPriceInrKg: 20.00, maxPriceInrKg: 24.00, modalPricePerQuintal: 2000.00, arrivalQtyTonnes: 45.0, observedAt: '2026-10-23T03:45:00Z', source: 'Agmarknet BLR' },
  { id: 4, marketId: 4, marketName: 'Chintamani APMC', district: 'Chikkaballapur', state: 'Karnataka', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', minPriceInrKg: 17.50, modalPriceInrKg: 21.00, maxPriceInrKg: 25.00, modalPricePerQuintal: 2100.00, arrivalQtyTonnes: 60.0, observedAt: '2026-10-23T04:15:00Z', source: 'Agmarknet Chintamani' },
  { id: 5, marketId: 5, marketName: 'Hosur Uzhavar Sandhai', district: 'Krishnagiri', state: 'Tamil Nadu', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', minPriceInrKg: 21.00, modalPriceInrKg: 25.50, maxPriceInrKg: 29.00, modalPricePerQuintal: 2550.00, arrivalQtyTonnes: 95.0, observedAt: '2026-10-23T04:45:00Z', source: 'TN Uzhavar Sandhai' },
  { id: 6, marketId: 6, marketName: 'Madanapalle Tomato Yard', district: 'Annamayya', state: 'Andhra Pradesh', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', minPriceInrKg: 19.00, modalPriceInrKg: 23.00, maxPriceInrKg: 27.50, modalPricePerQuintal: 2300.00, arrivalQtyTonnes: 150.0, observedAt: '2026-10-23T05:10:00Z', source: 'AP Madanapalle APMC' },
  { id: 7, marketId: 1, marketName: 'Kolar APMC Mandi', district: 'Kolar', state: 'Karnataka', crop: 'Potato (Kufri Jyoti)', variety: 'Jyoti', grade: 'A', minPriceInrKg: 16.00, modalPriceInrKg: 19.50, maxPriceInrKg: 22.00, modalPricePerQuintal: 1950.00, arrivalQtyTonnes: 40.0, observedAt: '2026-10-23T04:00:00Z', source: 'Agmarknet Kolar' },
  { id: 8, marketId: 2, marketName: 'Yeshwanthpur APMC Bangalore', district: 'Bengaluru Urban', state: 'Karnataka', crop: 'Potato (Kufri Jyoti)', variety: 'Jyoti', grade: 'A', minPriceInrKg: 18.00, modalPriceInrKg: 22.00, maxPriceInrKg: 25.00, modalPricePerQuintal: 2200.00, arrivalQtyTonnes: 75.0, observedAt: '2026-10-23T04:00:00Z', source: 'Agmarknet BLR' },
  { id: 9, marketId: 1, marketName: 'Kolar APMC Mandi', district: 'Kolar', state: 'Karnataka', crop: 'Onion (Nashik Red)', variety: 'Nashik Red', grade: 'A', minPriceInrKg: 24.00, modalPriceInrKg: 29.00, maxPriceInrKg: 34.00, modalPricePerQuintal: 2900.00, arrivalQtyTonnes: 55.0, observedAt: '2026-10-23T04:30:00Z', source: 'Agmarknet Kolar' },
  { id: 10, marketId: 2, marketName: 'Yeshwanthpur APMC Bangalore', district: 'Bengaluru Urban', state: 'Karnataka', crop: 'Onion (Nashik Red)', variety: 'Nashik Red', grade: 'A', minPriceInrKg: 27.00, modalPriceInrKg: 33.50, maxPriceInrKg: 38.00, modalPricePerQuintal: 3350.00, arrivalQtyTonnes: 90.0, observedAt: '2026-10-23T04:00:00Z', source: 'Agmarknet BLR' },
  { id: 11, marketId: 4, marketName: 'Chintamani APMC', district: 'Chikkaballapur', state: 'Karnataka', crop: 'Cabbage (Golden Acre)', variety: 'Green', grade: 'A', minPriceInrKg: 10.00, modalPriceInrKg: 13.00, maxPriceInrKg: 16.00, modalPricePerQuintal: 1300.00, arrivalQtyTonnes: 30.0, observedAt: '2026-10-23T04:30:00Z', source: 'Agmarknet Chintamani' },
  { id: 12, marketId: 2, marketName: 'Yeshwanthpur APMC Bangalore', district: 'Bengaluru Urban', state: 'Karnataka', crop: 'Capsicum (Green Bell)', variety: 'Indra', grade: 'A', minPriceInrKg: 28.00, modalPriceInrKg: 36.00, maxPriceInrKg: 42.00, modalPricePerQuintal: 3600.00, arrivalQtyTonnes: 25.0, observedAt: '2026-10-23T04:00:00Z', source: 'Agmarknet BLR' },
];

export const PREVIOUS_PLEDGES: HistoricalPledgeRecord[] = [
  { id: 1, farmerId: 1, farmerName: 'Ramesh Gowda', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', quantityKg: 1800.0, quantityQuintals: 18.0, harvestReadyAt: '2026-10-23T10:00:00Z', collectionPoint: 'Vokkaleri Village Center', spoilageWindowHours: 48, status: 'active' },
  { id: 2, farmerId: 2, farmerName: 'Manjunath Reddy', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', quantityKg: 2400.0, quantityQuintals: 24.0, harvestReadyAt: '2026-10-23T11:00:00Z', collectionPoint: 'Mulbagal Bypass Hub', spoilageWindowHours: 48, status: 'active' },
  { id: 3, farmerId: 3, farmerName: 'Anjanamma K', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', quantityKg: 1600.0, quantityQuintals: 16.0, harvestReadyAt: '2026-10-23T09:30:00Z', collectionPoint: 'Bangarapet Milk Society', spoilageWindowHours: 48, status: 'active' },
  { id: 4, farmerId: 4, farmerName: 'Venkataswamy N', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', quantityKg: 2200.0, quantityQuintals: 22.0, harvestReadyAt: '2026-10-23T12:00:00Z', collectionPoint: 'Chintamani Yard Gate 2', spoilageWindowHours: 48, status: 'active' },
  { id: 5, farmerId: 8, farmerName: 'Narayanappa', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'A', quantityKg: 1500.0, quantityQuintals: 15.0, harvestReadyAt: '2026-10-23T10:30:00Z', collectionPoint: 'Kurugal Crossroads', spoilageWindowHours: 48, status: 'active' },
  { id: 6, farmerId: 6, farmerName: 'Lakshmi Devi', crop: 'Potato (Kufri Jyoti)', variety: 'Jyoti', grade: 'A', quantityKg: 3000.0, quantityQuintals: 30.0, harvestReadyAt: '2026-10-24T08:00:00Z', collectionPoint: 'Malur APMC Cold Storage Gate', spoilageWindowHours: 120, status: 'active' },
  { id: 7, farmerId: 7, farmerName: 'Mohammed Ismail', crop: 'Tomato (Hybrid)', variety: 'Hybrid', grade: 'B', quantityKg: 900.0, quantityQuintals: 9.0, harvestReadyAt: '2026-10-23T14:00:00Z', collectionPoint: 'Srinivaspur Fruit Yard', spoilageWindowHours: 36, status: 'active' },
];
