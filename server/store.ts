import {
  CommodityMarketData,
  FarmerPledge,
  FpoCoalition,
  EnamAuctionLot,
  MandiGateWeighment,
  TruckTelemetry,
  AdminAuditRecord,
  UserRole,
} from '../src/types';
import {
  INITIAL_MARKET_DATA,
  INITIAL_FARMER_PLEDGES,
  INITIAL_COALITIONS,
  INITIAL_ENAM_LOTS,
  INITIAL_GATE_WEIGHMENTS,
  INITIAL_TRUCK_TELEMETRY,
  INITIAL_AUDIT_LOGS,
  INITIAL_USER_ORDER_HISTORY,
} from '../src/mock/mockData';
import { wsManager } from './websocket';
import crypto from 'crypto';

class BackendStore {
  public commodities: CommodityMarketData[] = JSON.parse(JSON.stringify(INITIAL_MARKET_DATA));
  public pledges: FarmerPledge[] = JSON.parse(JSON.stringify(INITIAL_FARMER_PLEDGES));
  public coalitions: FpoCoalition[] = JSON.parse(JSON.stringify(INITIAL_COALITIONS));
  public enamLots: EnamAuctionLot[] = JSON.parse(JSON.stringify(INITIAL_ENAM_LOTS));
  public gateWeighments: MandiGateWeighment[] = JSON.parse(JSON.stringify(INITIAL_GATE_WEIGHMENTS));
  public truckTelemetry: TruckTelemetry = JSON.parse(JSON.stringify(INITIAL_TRUCK_TELEMETRY));
  public auditLogs: AdminAuditRecord[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
  public orderHistory = JSON.parse(JSON.stringify(INITIAL_USER_ORDER_HISTORY));
  public commissionRate: number = 2.5;
  public mandiCess: number = 1.0;

  public addAuditLog(action: string, details: string, tag: AdminAuditRecord['complianceTag'] = 'DPDP_ACT_2023', actor = 'System Agent', actorRole: UserRole = 'admin') {
    const rawData = `${new Date().toISOString()}|${actor}|${action}|${details}`;
    const hashSha256 = crypto.createHash('sha256').update(rawData).digest('hex');

    const record: AdminAuditRecord = {
      id: 'AUD-' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
      actor,
      actorRole,
      action,
      details,
      hashSha256,
      complianceTag: tag,
    };

    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 200) this.auditLogs.pop();

    wsManager.broadcast('AUDIT_LOG_ENTRY', record);
    return record;
  }

  public updateCommodityPrices(updated: CommodityMarketData[]) {
    this.commodities = updated;
    wsManager.broadcast('COMMODITY_PRICE_UPDATE', this.commodities);
  }

  public addFarmerPledge(pledgeData: Partial<FarmerPledge>): FarmerPledge {
    const qtyQ = pledgeData.quantityQuintals || 25;
    const qtyKg = qtyQ * 100;
    const soloFreight = qtyQ * 160;
    const coalitionFreight = qtyQ * 98;
    const savingsPercent = Math.round(((soloFreight - coalitionFreight) / soloFreight) * 1000) / 10;

    const commName = pledgeData.commodity || 'Tomato (Hybrid)';
    const commObj = this.commodities.find(c => c.name === commName) || this.commodities[0];
    const isMspSafe = commObj ? (commObj.modalPrice >= commObj.msp) : true;

    const newPledge: FarmerPledge = {
      id: 'PLG-2026-' + Math.floor(900 + Math.random() * 99),
      farmerName: pledgeData.farmerName || 'Rameshwar Patil',
      farmerPhone: pledgeData.farmerPhone || '+91 98231 44021',
      locationVillage: pledgeData.locationVillage || 'Pimpalgaon Baswant',
      district: pledgeData.district || 'Nashik',
      state: 'Maharashtra',
      commodity: commName,
      quantityQuintals: qtyQ,
      quantityKg: qtyKg,
      harvestDate: new Date().toISOString().split('T')[0],
      baseSli: 0.94,
      currentSli: 0.94,
      tempExposureC: pledgeData.tempExposureC || 18,
      status: 'PLEDGED',
      expectedRealizationPerQ: commObj ? commObj.modalPrice : 2850,
      freightSoloInr: soloFreight,
      freightCoalitionInr: coalitionFreight,
      shapleySavingsPercent: savingsPercent,
      mspCompliant: isMspSafe,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    this.pledges.unshift(newPledge);

    // Auto-integrate with FPO Coalition
    if (this.coalitions.length > 0) {
      const activeCo = this.coalitions[0];
      activeCo.currentWeightKg += qtyKg;
      activeCo.currentVolumeM3 = Math.round((activeCo.currentWeightKg / 300) * 10) / 10;
      activeCo.fillRatePercent = Math.min(100, Math.round((activeCo.currentWeightKg / activeCo.maxCapacityKg) * 100));
      if (!activeCo.pledgeIds.includes(newPledge.id)) {
        activeCo.pledgeIds.push(newPledge.id);
      }
      wsManager.broadcast('COALITION_UPDATED', activeCo);
    }

    this.addAuditLog(
      'FARMER_PLEDGE_CREATED',
      `Farmer ${newPledge.farmerName} pledged ${qtyQ} Q of ${newPledge.commodity}. Shapley savings: ${savingsPercent}%.`,
      'APMC_MODEL_ACT',
      newPledge.farmerName,
      'farmer'
    );

    wsManager.broadcast('NEW_PLEDGE', newPledge);
    return newPledge;
  }

  public markPledgeReadyToSell(pledgeId: string): FarmerPledge | null {
    const pledge = this.pledges.find(p => p.id === pledgeId);
    if (!pledge) return null;

    pledge.status = 'READY_TO_SELL';

    this.addAuditLog(
      'PLEDGE_READY_TO_SELL',
      `Farmer ${pledge.farmerName}'s lot ${pledge.id} (${pledge.quantityQuintals} Q of ${pledge.commodity}) marked READY TO SELL. SMS alert triggered to ${pledge.farmerPhone}.`,
      'DPDP_ACT_2023',
      pledge.farmerName,
      'farmer'
    );

    wsManager.broadcast('PLEDGE_UPDATED', pledge);
    return pledge;
  }

  public placeEnamBid(lotNumber: string, bidAmount: number, bidderName: string): EnamAuctionLot | null {
    const lot = this.enamLots.find(l => l.lotNumber === lotNumber);
    if (!lot) return null;

    if (bidAmount > lot.currentHighestBidInr) {
      lot.currentHighestBidInr = bidAmount;
      lot.highestBidder = bidderName;
      lot.totalBidsCount += 1;

      this.addAuditLog(
        'BID_PLACED_ENAM',
        `Bidder ${bidderName} placed high bid ₹${bidAmount}/Q on lot ${lotNumber} (${lot.commodity}).`,
        'AGMARK_STANDARDS',
        bidderName,
        'enam'
      );

      wsManager.broadcast('NEW_BID', lot);
    }
    return lot;
  }

  public hammerEnamAuction(lotNumber: string): EnamAuctionLot | null {
    const lot = this.enamLots.find(l => l.lotNumber === lotNumber);
    if (!lot) return null;

    lot.status = 'HAMMER_SOLD';

    this.addAuditLog(
      'AUCTION_HAMMER_STRUCK',
      `Auction concluded for lot ${lotNumber}. Sold to ${lot.highestBidder} at ₹${lot.currentHighestBidInr}/Q. e-NWR: ${lot.enwrNumber}.`,
      'AGMARK_STANDARDS',
      'e-NAM Assayer Desk',
      'enam'
    );

    wsManager.broadcast('AUCTION_HAMMERED', lot);
    return lot;
  }

  public commitMandiWeighment(gatePassId: string, grossWeightKg: number, tareWeightKg: number): MandiGateWeighment | null {
    const weighment = this.gateWeighments.find(g => g.gatePassId === gatePassId);
    if (!weighment) return null;

    const netKg = grossWeightKg - tareWeightKg;
    const discrepancyKg = netKg - weighment.expectedWeightKg;
    const discrepancyPercent = Math.round((discrepancyKg / weighment.expectedWeightKg) * 10000) / 100;
    const isTolerancePass = Math.abs(discrepancyPercent) <= 2.0;

    weighment.grossWeightKg = grossWeightKg;
    weighment.tareWeightKg = tareWeightKg;
    weighment.actualNetWeightKg = netKg;
    weighment.discrepancyKg = discrepancyKg;
    weighment.discrepancyPercent = discrepancyPercent;
    weighment.discrepancyStatus = isTolerancePass ? 'TOLERANCE_PASS' : 'DISCREPANCY_FLAGGED';
    weighment.status = 'WEIGHED';

    this.addAuditLog(
      'WEIGHMENT_COMMITTED',
      `GatePass ${gatePassId} (${weighment.vehicleNumber}) weighment finalized: Gross ${grossWeightKg}kg, Tare ${tareWeightKg}kg, Net ${netKg}kg. Tolerance: ${weighment.discrepancyStatus} (${discrepancyPercent}%).`,
      'APMC_MODEL_ACT',
      'Weighbridge Inspector',
      'mandi'
    );

    wsManager.broadcast('WEIGHMENT_COMMITTED', weighment);
    return weighment;
  }

  public updateTruckTelemetry(partial: Partial<TruckTelemetry>): TruckTelemetry {
    this.truckTelemetry = { ...this.truckTelemetry, ...partial };
    wsManager.broadcast('TELEMETRY_TICK', this.truckTelemetry);
    return this.truckTelemetry;
  }
}

export const store = new BackendStore();
