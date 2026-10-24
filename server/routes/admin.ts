import { Router, Request, Response } from 'express';
import { store } from '../store';

export const adminRouter = Router();

adminRouter.get('/audit-logs', (req: Request, res: Response) => {
  const filter = (req.query.tag as string) || 'ALL';
  const logs = filter === 'ALL' 
    ? store.auditLogs 
    : store.auditLogs.filter(l => l.complianceTag === filter);

  return res.json({
    success: true,
    count: logs.length,
    data: logs,
  });
});

adminRouter.post('/policy', (req: Request, res: Response) => {
  const { commissionRate, mandiCess } = req.body as { commissionRate?: number; mandiCess?: number };

  if (commissionRate !== undefined) store.commissionRate = Number(commissionRate);
  if (mandiCess !== undefined) store.mandiCess = Number(mandiCess);

  store.addAuditLog(
    'POLICY_PARAMETERS_UPDATED',
    `Directorate updated platform fiscal parameters: Mandi Cess: ${store.mandiCess}%, Arhatiya Commission: ${store.commissionRate}%.`,
    'DPDP_ACT_2023',
    'Dr. Ananya Sen (Directorate)',
    'admin'
  );

  return res.json({
    success: true,
    message: 'APMC regulatory policies committed',
    data: {
      commissionRate: store.commissionRate,
      mandiCess: store.mandiCess,
    },
  });
});

adminRouter.get('/stats', (_req: Request, res: Response) => {
  const totalVolumeQuintals = store.pledges.reduce((acc, p) => acc + p.quantityQuintals, 0);
  const totalLots = store.enamLots.length;
  const activeBids = store.enamLots.reduce((acc, l) => acc + l.totalBidsCount, 0);
  const totalWeighedKg = store.gateWeighments.reduce((acc, w) => acc + (w.actualNetWeightKg || 0), 0);
  const totalFreightSavedInr = store.pledges.reduce((acc, p) => acc + (p.freightSoloInr - p.freightCoalitionInr), 0);
  const carbonOffsetKgCo2 = Math.round(totalFreightSavedInr * 0.082);

  return res.json({
    success: true,
    data: {
      totalVolumeQuintals,
      totalLots,
      activeBids,
      totalWeighedKg,
      totalFreightSavedInr,
      carbonOffsetKgCo2,
      activeTrucks: 1,
      totalPledges: store.pledges.length,
      auditLogCount: store.auditLogs.length,
    },
  });
});
