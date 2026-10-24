import { Router, Request, Response } from 'express';
import { store } from '../store';

export const mandiRouter = Router();

mandiRouter.get('/weighments', (_req: Request, res: Response) => {
  return res.json({ success: true, count: store.gateWeighments.length, data: store.gateWeighments });
});

mandiRouter.post('/commit', (req: Request, res: Response) => {
  const { gatePassId, grossWeightKg, tareWeightKg } = req.body as {
    gatePassId: string;
    grossWeightKg: number;
    tareWeightKg: number;
  };

  if (!gatePassId || !grossWeightKg || !tareWeightKg || grossWeightKg <= tareWeightKg) {
    return res.status(400).json({ error: 'Valid gatePassId, grossWeightKg, and tareWeightKg are required' });
  }

  const updated = store.commitMandiWeighment(gatePassId, Number(grossWeightKg), Number(tareWeightKg));
  if (!updated) {
    return res.status(404).json({ error: 'Gate pass weighment not found' });
  }

  return res.json({
    success: true,
    message: `Weighment recorded. Net weight: ${updated.actualNetWeightKg} kg. Discrepancy: ${updated.discrepancyPercent}% (${updated.discrepancyStatus}).`,
    data: updated,
  });
});
