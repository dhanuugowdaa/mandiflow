import { Router, Request, Response } from 'express';
import { store } from '../store';
import {
  predictEnamLot,
  trainEnamModelOnPreviousData,
  getModelMetrics,
  executeDatasetRun,
} from '../../src/services/enamModelTrainer';

export const enamRouter = Router();

// Initialize trained model
trainEnamModelOnPreviousData();

enamRouter.get('/lots', (_req: Request, res: Response) => {
  return res.json({ success: true, count: store.enamLots.length, data: store.enamLots });
});

enamRouter.post('/bid', (req: Request, res: Response) => {
  const { lotNumber, bidAmount, bidderName } = req.body as {
    lotNumber: string;
    bidAmount: number;
    bidderName: string;
  };

  if (!lotNumber || !bidAmount || bidAmount <= 0) {
    return res.status(400).json({ error: 'Valid lotNumber and bidAmount are required' });
  }

  const updatedLot = store.placeEnamBid(lotNumber, bidAmount, bidderName || 'Licensed Trader');
  if (!updatedLot) {
    return res.status(404).json({ error: 'Lot not found or bid was lower than highest bid' });
  }

  return res.json({ success: true, data: updatedLot });
});

enamRouter.post('/hammer', (req: Request, res: Response) => {
  const { lotNumber } = req.body as { lotNumber: string };
  if (!lotNumber) {
    return res.status(400).json({ error: 'lotNumber is required' });
  }

  const hammered = store.hammerEnamAuction(lotNumber);
  if (!hammered) {
    return res.status(404).json({ error: 'Lot not found' });
  }

  return res.json({ success: true, message: 'Auction struck with official gavel!', data: hammered });
});

enamRouter.post('/predict', (req: Request, res: Response) => {
  const { crop, variety, grade, quantityQuintals, localMandiId } = req.body;

  const prediction = predictEnamLot(
    crop || 'Tomato',
    variety || 'Hybrid',
    (grade as 'A' | 'B') || 'A',
    Number(quantityQuintals) || 25,
    Number(localMandiId) || 1
  );

  const metrics = getModelMetrics();

  return res.json({
    success: true,
    data: {
      predictedPriceInr: prediction.predictedClearingPrice,
      recommendedReservePrice: prediction.recommendedReservePrice,
      expectedBidRange: prediction.expectedBidRange,
      bestArbitrageMandi: prediction.bestArbitrageMandi,
      modelMetrics: {
        rSquared: metrics.r2Score,
        maeInr: metrics.maeInr,
        datasetSampleCount: metrics.trainingSamplesCount,
        epochs: metrics.epochs,
      },
    },
  });
});

enamRouter.post('/run-dataset', (req: Request, res: Response) => {
  const { algorithm, epochs, testSplitPct, learningRate } = req.body;
  const result = executeDatasetRun({
    algorithm,
    epochs: Number(epochs) || 150,
    testSplitPct: Number(testSplitPct) || 20,
    learningRate: Number(learningRate) || 0.01,
  });

  store.addAuditLog(
    'DATASET_MODEL_RUN',
    `Executed ${result.algorithmName} on Agmarknet dataset (${result.totalRecordsProcessed} rows). Accuracy: ${result.accuracyPercentage}%, R²: ${result.r2Score}.`,
    'AGMARK_STANDARDS',
    'AI Model Engine',
    'admin'
  );

  return res.json({ success: true, data: result });
});

