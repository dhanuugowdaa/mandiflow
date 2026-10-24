import { CommodityType, ProfitComparisonParams, ProfitComparisonResult } from '../types';

export function calculateProfitComparison(params: ProfitComparisonParams): ProfitComparisonResult {
  const { commodity, quantityQuintals, distanceKm, modalPricePerQ } = params;
  const qty = Math.max(1, Number(quantityQuintals) || 25);
  const dist = Math.max(10, Number(distanceKm) || 150);
  const price = Math.max(100, Number(modalPricePerQ) || 2500);
  const totalKg = qty * 100;
  const grossRevenue = qty * price;

  // Commodity-specific spoilage vulnerability
  const isHighPerishable = [
    'Tomato (Hybrid)',
    'Green Chilli (G4)',
    'Cauliflower (Snowball)',
    'Cabbage (Golden Acre)',
    'Capsicum (Green Bell)',
    'Eggplant (Brinjal)',
    'Okra / Bhindi (Lady Finger)',
    'Green Peas (Matar)',
  ].includes(commodity);

  // ---------------------------------------------------------------------------
  // 1. TRADITIONAL SELLING OUTSIDE (Solo Truck, Middleman, Open Transit)
  // ---------------------------------------------------------------------------
  // Solo Freight: Mini-truck (Tata Ace / Bolero) charges ~₹0.72/Q-km + ₹65 base handling
  const tradFreightPerQ = Math.round(dist * 0.72 + 65);
  const tradFreightCost = Math.round(qty * tradFreightPerQ);

  // Spoilage in open trucks under ambient sun: 18.5% for high perishables, 7.5% for onions/potatoes
  const tradSpoilagePct = isHighPerishable ? 18.5 : 7.5;
  const tradSpoilageKg = Math.round((totalKg * tradSpoilagePct) / 100);
  const tradSpoilageLossInr = Math.round((tradSpoilageKg / 100) * price);

  // Unregulated village dalal / unauthorized broker commission: 9.5%
  const tradMiddlemanPct = 9.5;
  const tradMiddlemanCutInr = Math.round((grossRevenue * tradMiddlemanPct) / 100);

  // Manual weighbridge gouging / bag tare manipulation: 4.0%
  const tradWeighingLossKg = Math.round((totalKg * 4.0) / 100);
  const tradWeighingLossInr = Math.round((tradWeighingLossKg / 100) * price);

  const tradTotalDeductions = tradFreightCost + tradSpoilageLossInr + tradMiddlemanCutInr + tradWeighingLossInr;
  const tradNetInHand = Math.max(0, grossRevenue - tradTotalDeductions);
  const tradEffectivePricePerQ = Math.round(tradNetInHand / qty);

  // ---------------------------------------------------------------------------
  // 2. MANDIFLOW SMART ROUTE (FPO Coalition, Reefer Cold Chain, e-NAM Floor)
  // ---------------------------------------------------------------------------
  // Shapley Value Shared Reefer Freight: 16T/24T pooled dispatch ~₹0.36/Q-km + ₹28 base
  const mfFreightPerQ = Math.round(dist * 0.36 + 28);
  const mfFreightCost = Math.round(qty * mfFreightPerQ);

  // IoT Cold-Chain & Botanical Ethylene Protection: Spoilage reduced to <1.2%
  const mfSpoilagePct = 1.2;
  const mfSpoilageKg = Math.round((totalKg * mfSpoilagePct) / 100);
  const mfSpoilageLossInr = Math.round((mfSpoilageKg / 100) * price);

  // Statutory APMC Model Act fee: 2.5% total (1.5% commission + 1.0% mandi cess). 0% hidden dalal cuts
  const mfStatutoryPct = 2.5;
  const mfStatutoryCessInr = Math.round((grossRevenue * mfStatutoryPct) / 100);

  // Certified Digital Weighbridge: exact weight calibrated to APMC legal standards (0% gouging)
  const mfWeighingLossInr = 0;

  const mfTotalDeductions = mfFreightCost + mfSpoilageLossInr + mfStatutoryCessInr + mfWeighingLossInr;
  const mfNetInHand = Math.max(0, grossRevenue - mfTotalDeductions);
  const mfEffectivePricePerQ = Math.round(mfNetInHand / qty);

  // ---------------------------------------------------------------------------
  // 3. COMPARISON & PROFIT DELTA
  // ---------------------------------------------------------------------------
  const extraProfitInr = mfNetInHand - tradNetInHand;
  const profitIncreasePercent = tradNetInHand > 0
    ? Math.round((extraProfitInr / tradNetInHand) * 1000) / 10
    : 100;

  const freightSavedInr = tradFreightCost - mfFreightCost;
  const freightSavingsPercent = Math.round((freightSavedInr / (tradFreightCost || 1)) * 1000) / 10;
  const spoilageSavedInr = tradSpoilageLossInr - mfSpoilageLossInr;
  const commissionSavedInr = tradMiddlemanCutInr - mfStatutoryCessInr;
  const weighingSavedInr = tradWeighingLossInr - mfWeighingLossInr;

  return {
    params,
    traditional: {
      grossRevenue,
      freightCost: tradFreightCost,
      freightPerQ: tradFreightPerQ,
      spoilageLossKg: tradSpoilageKg,
      spoilageLossInr: tradSpoilageLossInr,
      spoilagePercent: tradSpoilagePct,
      middlemanCutInr: tradMiddlemanCutInr,
      middlemanPercent: tradMiddlemanPct,
      weighingLossInr: tradWeighingLossInr,
      weighingLossKg: tradWeighingLossKg,
      totalDeductions: tradTotalDeductions,
      netFarmerInHand: tradNetInHand,
      effectivePricePerQ: tradEffectivePricePerQ,
    },
    mandiFlow: {
      grossRevenue,
      freightCost: mfFreightCost,
      freightPerQ: mfFreightPerQ,
      spoilageLossKg: mfSpoilageKg,
      spoilageLossInr: mfSpoilageLossInr,
      spoilagePercent: mfSpoilagePct,
      statutoryCessInr: mfStatutoryCessInr,
      statutoryPercent: mfStatutoryPct,
      weighingLossInr: mfWeighingLossInr,
      totalDeductions: mfTotalDeductions,
      netFarmerInHand: mfNetInHand,
      effectivePricePerQ: mfEffectivePricePerQ,
    },
    comparison: {
      extraProfitInr,
      profitIncreasePercent,
      freightSavedInr,
      freightSavingsPercent,
      spoilageSavedInr,
      commissionSavedInr,
      weighingSavedInr,
    },
  };
}
