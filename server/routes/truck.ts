import { Router, Request, Response } from 'express';
import { store } from '../store';
import crypto from 'crypto';

export const truckRouter = Router();

truckRouter.get('/telemetry', (_req: Request, res: Response) => {
  return res.json({ success: true, data: store.truckTelemetry });
});

truckRouter.post('/toggle-fault', (_req: Request, res: Response) => {
  const currentStatus = store.truckTelemetry.reeferStatus;
  const isFault = currentStatus === 'TEMP_WARNING';

  const newStatus = isFault ? 'COOLING_OPTIMAL' : 'TEMP_WARNING';
  const newTemp = isFault ? 4.2 : 14.8;
  const newRisk = isFault ? 8 : 74;

  const updated = store.updateTruckTelemetry({
    reeferStatus: newStatus,
    chamberTempC: newTemp,
    spoilageRiskScore: newRisk,
  });

  store.addAuditLog(
    isFault ? 'REEFER_FAULT_RESOLVED' : 'REEFER_FAULT_TRIGGERED',
    `Vehicle TRK-8921 reefer status changed to ${newStatus}. Temp: ${newTemp}°C, Spoilage risk: ${newRisk}%.`,
    'AGMARK_STANDARDS',
    'IoT Cold-Chain Telemetry Unit',
    'truck'
  );

  return res.json({
    success: true,
    message: isFault ? 'Reefer compressor restored to optimal cooling' : 'High temperature threshold alert triggered!',
    data: updated,
  });
});

truckRouter.post('/milestone', (_req: Request, res: Response) => {
  const milestones = store.truckTelemetry.milestones;
  const nextPendingIdx = milestones.findIndex(m => !m.completed);

  if (nextPendingIdx !== -1) {
    milestones[nextPendingIdx].completed = true;
    milestones[nextPendingIdx].timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    const updatedDistance = Math.min(
      store.truckTelemetry.totalDistanceKm,
      store.truckTelemetry.distanceCoveredKm + 280
    );

    const updated = store.updateTruckTelemetry({
      milestones: [...milestones],
      distanceCoveredKm: updatedDistance,
    });

    store.addAuditLog(
      'CORRIDOR_MILESTONE_CLEARED',
      `Vehicle TRK-8921 cleared waypoint: ${milestones[nextPendingIdx].name}. Total km: ${updatedDistance} / ${store.truckTelemetry.totalDistanceKm} km.`,
      'APMC_MODEL_ACT',
      'Fastag Corridor Gateway',
      'truck'
    );

    return res.json({ success: true, message: `Waypoint ${milestones[nextPendingIdx].name} cleared!`, data: updated });
  }

  return res.json({ success: true, message: 'All corridor waypoints completed', data: store.truckTelemetry });
});

truckRouter.post('/epod', (req: Request, res: Response) => {
  const { recipientName } = req.body as { recipientName?: string };
  const recipient = recipientName || 'APMC Azadpur Superintendent (Bay 4)';

  const epodHash = 'epod_sha256_' + crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const updated = store.updateTruckTelemetry({
    epodSigned: true,
    epodRecipientName: recipient,
    epodTimestamp: timestamp,
  });

  store.addAuditLog(
    'EPOD_CRYPTOGRAPHICALLY_SIGNED',
    `Electronic Proof of Delivery (ePoD) signed by ${recipient}. Hash: ${epodHash}. Cargo delivered intact.`,
    'DPDP_ACT_2023',
    recipient,
    'truck'
  );

  return res.json({
    success: true,
    message: 'ePoD verified & cryptographically committed to DPDP ledger',
    data: {
      epodHash,
      recipient,
      timestamp,
      telemetry: updated,
    },
  });
});

truckRouter.post('/update-telemetry', (req: Request, res: Response) => {
  try {
    const update = req.body;
    const updated = store.updateTruckTelemetry(update);
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

truckRouter.post('/location-advance', (req: Request, res: Response) => {
  try {
    const kmDelta = Number(req.body.kmDelta) || 20;
    const current = store.truckTelemetry;
    const newDist = Math.min(current.totalDistanceKm, current.distanceCoveredKm + kmDelta);

    // Route corridor interpolation
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

    const speed = Math.floor(54 + Math.random() * 12);
    const updated = store.updateTruckTelemetry({
      distanceCoveredKm: newDist,
      currentLocation: {
        name: currentWaypoint.name,
        lat: currentWaypoint.lat + (Math.random() - 0.5) * 0.005,
        lng: currentWaypoint.lng + (Math.random() - 0.5) * 0.005,
      },
      speedKmH: speed,
      headingDeg: Math.floor(20 + Math.random() * 10),
      headingText: 'NNE',
      lastPingTimestamp: 'Just now (0s ago)',
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
