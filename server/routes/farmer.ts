import { Router, Request, Response } from 'express';
import { store } from '../store';
import {
  fetchAmbientAgriWeather,
  setRuntimeOpenWeatherApiKey,
  getRuntimeOpenWeatherApiKey,
} from '../services/weather';
import { sendReadyToSellSms } from '../services/sms';

export const farmerRouter = Router();

farmerRouter.get('/pledges', (_req: Request, res: Response) => {
  return res.json({ success: true, count: store.pledges.length, data: store.pledges });
});

farmerRouter.get('/orders-history', (_req: Request, res: Response) => {
  return res.json({ success: true, data: store.orderHistory });
});

farmerRouter.post('/pledges', async (req: Request, res: Response) => {
  const pledgeData = req.body;
  if (!pledgeData.quantityQuintals || pledgeData.quantityQuintals <= 0) {
    return res.status(400).json({ error: 'Valid quantity in quintals is required' });
  }

  const created = store.addFarmerPledge(pledgeData);

  // If marked immediately as ready to sell
  let smsResult = null;
  if (pledgeData.status === 'READY_TO_SELL' || pledgeData.isReadyToSell) {
    created.status = 'READY_TO_SELL';
    smsResult = await sendReadyToSellSms(
      created.farmerName,
      created.farmerPhone,
      created.quantityQuintals,
      created.commodity,
      created.expectedRealizationPerQ,
      created.locationVillage
    );
  }

  return res.status(201).json({ success: true, data: created, smsResult });
});

farmerRouter.post('/notify-ready-to-sell', async (req: Request, res: Response) => {
  const { pledgeId, farmerName, farmerPhone, commodity, quantityQuintals, expectedPrice, locationVillage } = req.body;

  let pledge = null;
  if (pledgeId) {
    pledge = store.markPledgeReadyToSell(pledgeId);
  }

  const name = pledge?.farmerName || farmerName || 'Rameshwar Patil';
  const phone = pledge?.farmerPhone || farmerPhone || '+91 98231 44021';
  const qty = pledge?.quantityQuintals || quantityQuintals || 25;
  const comm = pledge?.commodity || commodity || 'Tomato (Hybrid)';
  const price = pledge?.expectedRealizationPerQ || expectedPrice || 2400;
  const hub = pledge?.locationVillage || locationVillage || 'Pimpalgaon Baswant';

  const smsResult = await sendReadyToSellSms(name, phone, qty, comm, price, hub);

  return res.json({
    success: true,
    message: `SMS notification dispatched to farmer +91 ${smsResult.phoneNumber}. Lot is marked READY TO SELL.`,
    smsResult,
    pledge,
  });
});

farmerRouter.get('/weather', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || undefined;
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
  const accuracyMeters = req.query.accuracyMeters ? parseFloat(req.query.accuracyMeters as string) : undefined;
  const isDeviceLocation = req.query.isDeviceLocation === 'true';
  const apiKey = (req.query.apiKey as string) || undefined;
  const commodity = (req.query.commodity as string) || 'Tomato (Hybrid)';
  const harvestDate = (req.query.harvestDate as string) || undefined;
  const isReefer = req.query.isReefer === 'true';

  const weather = await fetchAmbientAgriWeather({
    city,
    lat,
    lon,
    accuracyMeters,
    isDeviceLocation,
    apiKey,
    commodity,
    harvestDate,
    isReefer,
  });

  return res.json({ success: true, data: weather });
});

farmerRouter.post('/weather/configure-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (typeof apiKey !== 'string') {
    return res.status(400).json({ error: 'Valid apiKey string is required' });
  }

  setRuntimeOpenWeatherApiKey(apiKey.trim());

  // Test the key against Nashik / Delhi
  const testWeather = await fetchAmbientAgriWeather({
    city: 'Nashik',
    apiKey: apiKey.trim(),
  });

  return res.json({
    success: true,
    message: testWeather.apiKeyActive
      ? 'OpenWeatherMap API Key verified and active! Real-time satellite/ground telemetry enabled.'
      : 'API Key saved. If testing failed, Open-Meteo auto-detection will continue providing real-time weather.',
    apiKeyActive: testWeather.apiKeyActive,
    source: testWeather.source,
    data: testWeather,
  });
});

farmerRouter.get('/weather/current-key', (_req: Request, res: Response) => {
  const key = getRuntimeOpenWeatherApiKey();
  return res.json({
    configured: Boolean(key),
    keyMasked: key ? `${key.slice(0, 4)}...${key.slice(-4)}` : null,
  });
});

farmerRouter.post('/profit-comparison', (req: Request, res: Response) => {
  const { commodity, quantityQuintals, distanceKm, modalPricePerQ } = req.body;
  const qty = Math.max(1, Number(quantityQuintals) || 25);
  const dist = Math.max(10, Number(distanceKm) || 150);
  const price = Math.max(100, Number(modalPricePerQ) || 2500);
  const comm = commodity || 'Tomato (Hybrid)';

  const totalKg = qty * 100;
  const grossRevenue = qty * price;

  const isHighPerishable = [
    'Tomato (Hybrid)',
    'Green Chilli (G4)',
    'Cauliflower (Snowball)',
    'Cabbage (Golden Acre)',
    'Capsicum (Green Bell)',
    'Eggplant (Brinjal)',
    'Okra / Bhindi (Lady Finger)',
    'Green Peas (Matar)',
  ].includes(comm);

  // Traditional Route
  const tradFreightPerQ = Math.round(dist * 0.72 + 65);
  const tradFreightCost = Math.round(qty * tradFreightPerQ);
  const tradSpoilagePct = isHighPerishable ? 18.5 : 7.5;
  const tradSpoilageKg = Math.round((totalKg * tradSpoilagePct) / 100);
  const tradSpoilageLossInr = Math.round((tradSpoilageKg / 100) * price);
  const tradMiddlemanCutInr = Math.round((grossRevenue * 9.5) / 100);
  const tradWeighingLossKg = Math.round((totalKg * 4.0) / 100);
  const tradWeighingLossInr = Math.round((tradWeighingLossKg / 100) * price);
  const tradTotalDeductions = tradFreightCost + tradSpoilageLossInr + tradMiddlemanCutInr + tradWeighingLossInr;
  const tradNetInHand = Math.max(0, grossRevenue - tradTotalDeductions);
  const tradEffectivePricePerQ = Math.round(tradNetInHand / qty);

  // MandiFlow Smart Route
  const mfFreightPerQ = Math.round(dist * 0.36 + 28);
  const mfFreightCost = Math.round(qty * mfFreightPerQ);
  const mfSpoilagePct = 1.2;
  const mfSpoilageKg = Math.round((totalKg * mfSpoilagePct) / 100);
  const mfSpoilageLossInr = Math.round((mfSpoilageKg / 100) * price);
  const mfStatutoryCutInr = Math.round((grossRevenue * 2.5) / 100);
  const mfTotalDeductions = mfFreightCost + mfSpoilageLossInr + mfStatutoryCutInr;
  const mfNetInHand = Math.max(0, grossRevenue - mfTotalDeductions);
  const mfEffectivePricePerQ = Math.round(mfNetInHand / qty);

  // Deltas
  const extraProfitInr = mfNetInHand - tradNetInHand;
  const profitIncreasePct = tradNetInHand > 0 ? Math.round((extraProfitInr / tradNetInHand) * 1000) / 10 : 0;
  const freightSavedInr = tradFreightCost - mfFreightCost;
  const spoilageSavedInr = tradSpoilageLossInr - mfSpoilageLossInr;
  const brokerageSavedInr = tradMiddlemanCutInr - mfStatutoryCutInr;
  const weighingSavedInr = tradWeighingLossInr;

  return res.json({
    success: true,
    data: {
      input: { commodity: comm, quantityQuintals: qty, distanceKm: dist, modalPricePerQ: price },
      traditional: {
        freightInr: tradFreightCost,
        freightPerQuintal: tradFreightPerQ,
        spoilageWeightQuintals: tradSpoilageKg / 100,
        spoilageLossInr: tradSpoilageLossInr,
        brokerageCommissionInr: tradMiddlemanCutInr,
        weighingLossInr: tradWeighingLossInr,
        totalDeductionsInr: tradTotalDeductions,
        netFarmerInhandInr: tradNetInHand,
        effectivePricePerQ: tradEffectivePricePerQ,
      },
      mandiFlow: {
        freightInr: mfFreightCost,
        freightPerQuintal: mfFreightPerQ,
        spoilageWeightQuintals: mfSpoilageKg / 100,
        spoilageLossInr: mfSpoilageLossInr,
        brokerageCommissionInr: mfStatutoryCutInr,
        weighingLossInr: 0,
        totalDeductionsInr: mfTotalDeductions,
        netFarmerInhandInr: mfNetInHand,
        effectivePricePerQ: mfEffectivePricePerQ,
      },
      comparison: {
        extraProfitInr,
        profitIncreasePct,
        freightSavedInr,
        spoilageSavedInr,
        brokerageSavedInr,
        weighingSavedInr,
      },
    },
  });
});

