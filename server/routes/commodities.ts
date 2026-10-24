import { Router, Request, Response } from 'express';
import { store } from '../store';
import { fetchAgmarknetLiveFeed } from '../services/agmarknet';

export const commoditiesRouter = Router();

commoditiesRouter.get('/', (_req: Request, res: Response) => {
  return res.json({ success: true, count: store.commodities.length, data: store.commodities });
});

commoditiesRouter.post('/sync-live', async (_req: Request, res: Response) => {
  const result = await fetchAgmarknetLiveFeed();
  return res.json({
    success: true,
    source: result.source,
    message: result.source === 'REAL_API' 
      ? 'Live prices synchronized from data.gov.in Agmarknet API' 
      : 'Live prices updated via high-fidelity Mandi volatility simulator',
    data: result.data,
  });
});
