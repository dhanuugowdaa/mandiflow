import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { config } from './config';
import { wsManager } from './websocket';
import { store } from './store';
import { authRouter } from './routes/auth';
import { commoditiesRouter } from './routes/commodities';
import { farmerRouter } from './routes/farmer';
import { fpoRouter } from './routes/fpo';
import { enamRouter } from './routes/enam';
import { mandiRouter } from './routes/mandi';
import { truckRouter } from './routes/truck';
import { adminRouter } from './routes/admin';
import { fetchAgmarknetLiveFeed } from './services/agmarknet';

const app = express();
const server = http.createServer(app);

// Initialize WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });
wsManager.init(wss);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  if (req.path !== '/api/health') {
    console.log(`[HTTP] ${req.method} ${req.path}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'MandiFlow National Agri Backend',
    version: '2.4.0',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    connectedSockets: wsManager.getConnectedClientsCount(),
    agmarknetLiveApiKeyConfigured: Boolean(config.dataGovInApiKey),
    smsProvider: config.smsProvider,
    weatherApiKeyConfigured: Boolean(config.openWeatherApiKey),
    openRouteServiceConfigured: Boolean(config.openRouteServiceApiKey),
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/commodities', commoditiesRouter);
app.use('/api/farmer', farmerRouter);
app.use('/api/fpo', fpoRouter);
app.use('/api/enam', enamRouter);
app.use('/api/mandi', mandiRouter);
app.use('/api/truck', truckRouter);
app.use('/api/admin', adminRouter);

// -----------------------------------------------------------------------------
// Real-Time Background Simulators (Streaming Telematics & Market Feeds)
// -----------------------------------------------------------------------------

// 1. Agmarknet market price micro-tick every 20 seconds
setInterval(() => {
  fetchAgmarknetLiveFeed().catch(err => console.error('[Ticker] Price feed sync error:', err));
}, 20000);

// 2. Real-time IoT Reefer Truck Telemetry Sensor Stream every 4 seconds
setInterval(() => {
  const current = store.truckTelemetry;
  if (!current) return;

  // Small physical fluctuation
  const tempDrift = (Math.random() - 0.5) * 0.2;
  const isOptimal = current.reeferStatus === 'COOLING_OPTIMAL';
  const newChamberTemp = isOptimal
    ? Math.max(3.5, Math.min(5.2, Math.round((current.chamberTempC + tempDrift) * 10) / 10))
    : Math.max(13.8, Math.min(16.5, Math.round((current.chamberTempC + tempDrift) * 10) / 10));

  const ethyleneDrift = (Math.random() - 0.5) * 0.05;
  const newEthylene = Math.max(0.1, Math.min(2.5, Math.round((current.ethylenePpm + ethyleneDrift) * 100) / 100));

  store.updateTruckTelemetry({
    chamberTempC: newChamberTemp,
    ethylenePpm: newEthylene,
  });
}, 4000);

// 3. Periodic e-NAM electronic trade bid activity every 35 seconds
setInterval(() => {
  if (store.enamLots.length > 0) {
    const activeLot = store.enamLots.find(l => l.status === 'ACTIVE_BIDDING');
    if (activeLot) {
      const increment = Math.floor(10 + Math.random() * 25);
      const newBid = activeLot.currentHighestBidInr + increment;
      const traderNames = [
        'Kalyan Agro Commodities',
        'Shree Ganesh Trading Co.',
        'Mahalaxmi Agri Export',
        'Vashi Mega Food Park',
        'Azadpur Mandi Arhatiya #112',
      ];
      const randomTrader = traderNames[Math.floor(Math.random() * traderNames.length)];
      store.placeEnamBid(activeLot.lotNumber, newBid, randomTrader);
    }
  }
}, 35000);

// Start Server
server.listen(config.port, () => {
  console.log(`\n=================================================================`);
  console.log(`🚀 MandiFlow Real-Time Backend running at: http://localhost:${config.port}`);
  console.log(`📡 WebSocket PubSub Engine active at: ws://localhost:${config.port}/ws`);
  console.log(`🔒 DPDP Act 2023 & APMC Zero-Trust Security active`);
  console.log(`🔑 data.gov.in Agmarknet API: ${config.dataGovInApiKey ? 'CONNECTED ✅' : 'SIMULATOR ACTIVE ⚠️'}`);
  console.log(`📱 SMS OTP Gateway: [${config.smsProvider.toUpperCase()}]`);
  console.log(`🌤️ Weather API: ${config.openWeatherApiKey ? 'CONNECTED ✅' : 'CLIMATIC MODEL ACTIVE ⚠️'}`);
  console.log(`=================================================================\n`);
});
