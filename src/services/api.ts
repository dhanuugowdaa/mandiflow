import {
  CommodityMarketData,
  FarmerPledge,
  FpoCoalition,
  EnamAuctionLot,
  MandiGateWeighment,
  TruckTelemetry,
  AdminAuditRecord,
  UserRole,
  UserSession,
  WeatherData,
  UserHistoryStatement,
  DatasetAlgorithm,
  DatasetRunResult,
} from '../types';
import { executeDatasetRun } from './enamModelTrainer';

const API_BASE = '/api';

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  uptimeSeconds: number;
  agmarknetLiveApiKeyConfigured: boolean;
  smsProvider: string;
  weatherApiKeyConfigured: boolean;
  openRouteServiceConfigured: boolean;
}

export class MandiFlowApiClient {
  private ws: WebSocket | null = null;
  private wsSubscribers: ((event: { type: string; payload: any }) => void)[] = [];
  private isConnectingWs = false;

  constructor() {
    this.initWebSocket();
  }

  // ---------------------------------------------------------------------------
  // WebSocket PubSub Connection
  // ---------------------------------------------------------------------------
  public initWebSocket() {
    if (typeof window === 'undefined' || this.isConnectingWs) return;

    try {
      this.isConnectingWs = true;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[ApiClient: WebSocket] Connected to real-time live events feed');
        this.isConnectingWs = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.wsSubscribers.forEach((cb) => cb(parsed));
        } catch {
          // ignore
        }
      };

      this.ws.onclose = () => {
        this.isConnectingWs = false;
        // Auto-reconnect in 4 seconds
        setTimeout(() => this.initWebSocket(), 4000);
      };

      this.ws.onerror = () => {
        this.isConnectingWs = false;
      };
    } catch (err) {
      this.isConnectingWs = false;
    }
  }

  public subscribe(callback: (event: { type: string; payload: any }) => void): () => void {
    this.wsSubscribers.push(callback);
    return () => {
      this.wsSubscribers = this.wsSubscribers.filter((cb) => cb !== callback);
    };
  }

  // ---------------------------------------------------------------------------
  // REST API Methods
  // ---------------------------------------------------------------------------

  public async getHealth(): Promise<HealthStatus | null> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch {
      // offline
    }
    return null;
  }

  public async login(role: UserRole, customName?: string): Promise<{ success: boolean; session: UserSession } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, customName }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[ApiClient] Backend login fetch error, fallback to local:', err);
    }
    return null;
  }

  public async sendOtp(phone: string): Promise<{ success: boolean; message: string; demoOtp: string } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) return await res.json();
    } catch {
      // offline
    }
    return null;
  }

  public async verifyOtp(phone: string, otp: string, role: UserRole): Promise<{ success: boolean; session: UserSession } | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, role }),
      });
      if (res.ok) return await res.json();
    } catch {
      // offline
    }
    return null;
  }

  public async getCommodities(): Promise<CommodityMarketData[] | null> {
    try {
      const res = await fetch(`${API_BASE}/commodities`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async syncAgmarknetLive(): Promise<CommodityMarketData[] | null> {
    try {
      const res = await fetch(`${API_BASE}/commodities/sync-live`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getPledges(): Promise<FarmerPledge[] | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/pledges`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async createPledge(pledgeData: Partial<FarmerPledge>): Promise<FarmerPledge | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/pledges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pledgeData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async notifyReadyToSell(data: {
    pledgeId?: string;
    farmerName?: string;
    farmerPhone?: string;
    commodity?: string;
    quantityQuintals?: number;
    expectedPrice?: number;
    locationVillage?: string;
  }): Promise<{ success: boolean; message: string; smsResult: any; pledge: FarmerPledge | null } | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/notify-ready-to-sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getOrdersHistory(): Promise<UserHistoryStatement | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/orders-history`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async runDataset(options?: {
    algorithm?: DatasetAlgorithm;
    epochs?: number;
    testSplitPct?: number;
    learningRate?: number;
  }): Promise<DatasetRunResult> {
    try {
      const res = await fetch(`${API_BASE}/enam/run-dataset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options || {}),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // offline fallback
    }
    // Guaranteed fallback engine execution
    return executeDatasetRun(options);
  }

  public async getWeather(params: {
    city?: string;
    lat?: number;
    lon?: number;
    accuracyMeters?: number;
    isDeviceLocation?: boolean;
    apiKey?: string;
    commodity?: string;
    harvestDate?: string;
    isReefer?: boolean;
  } = {}): Promise<WeatherData | null> {
    try {
      const searchParams = new URLSearchParams();
      if (params.city) searchParams.set('city', params.city);
      if (params.lat !== undefined) searchParams.set('lat', params.lat.toString());
      if (params.lon !== undefined) searchParams.set('lon', params.lon.toString());
      if (params.accuracyMeters !== undefined) searchParams.set('accuracyMeters', params.accuracyMeters.toString());
      if (params.isDeviceLocation) searchParams.set('isDeviceLocation', 'true');
      if (params.apiKey) searchParams.set('apiKey', params.apiKey);
      if (params.commodity) searchParams.set('commodity', params.commodity);
      if (params.harvestDate) searchParams.set('harvestDate', params.harvestDate);
      if (params.isReefer) searchParams.set('isReefer', 'true');

      const res = await fetch(`${API_BASE}/farmer/weather?${searchParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async configureWeatherApiKey(apiKey: string): Promise<{
    success: boolean;
    message: string;
    apiKeyActive: boolean;
    source: string;
    data: WeatherData;
  } | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/weather/configure-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getWeatherKeyStatus(): Promise<{ configured: boolean; keyMasked: string | null } | null> {
    try {
      const res = await fetch(`${API_BASE}/farmer/weather/current-key`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getCoalitions(): Promise<FpoCoalition[] | null> {
    try {
      const res = await fetch(`${API_BASE}/fpo/coalitions`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async optimizeCoalition(coalitionId?: string): Promise<FpoCoalition | null> {
    try {
      const res = await fetch(`${API_BASE}/fpo/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coalitionId }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getEnamLots(): Promise<EnamAuctionLot[] | null> {
    try {
      const res = await fetch(`${API_BASE}/enam/lots`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async placeBid(lotNumber: string, bidAmount: number, bidderName: string): Promise<EnamAuctionLot | null> {
    try {
      const res = await fetch(`${API_BASE}/enam/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotNumber, bidAmount, bidderName }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async hammerAuction(lotNumber: string): Promise<EnamAuctionLot | null> {
    try {
      const res = await fetch(`${API_BASE}/enam/hammer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotNumber }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async predictPrice(params: any): Promise<number | null> {
    try {
      const res = await fetch(`${API_BASE}/enam/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data.predictedPriceInr;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getGateWeighments(): Promise<MandiGateWeighment[] | null> {
    try {
      const res = await fetch(`${API_BASE}/mandi/weighments`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async commitWeighment(gatePassId: string, grossWeightKg: number, tareWeightKg: number): Promise<MandiGateWeighment | null> {
    try {
      const res = await fetch(`${API_BASE}/mandi/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatePassId, grossWeightKg, tareWeightKg }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getTruckTelemetry(): Promise<TruckTelemetry | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/telemetry`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async toggleTruckFault(): Promise<TruckTelemetry | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/toggle-fault`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async advanceTruckMilestone(): Promise<TruckTelemetry | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/milestone`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async updateTruckTelemetry(update: Partial<TruckTelemetry>): Promise<TruckTelemetry | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/update-telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async advanceTruckLocation(kmDelta = 20): Promise<TruckTelemetry | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/location-advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kmDelta }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async signTruckEpod(recipientName?: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/truck/epod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  }

  public async getAuditLogs(tag = 'ALL'): Promise<AdminAuditRecord[] | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs?tag=${encodeURIComponent(tag)}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // offline
    }
    return null;
  }

  public async updatePolicy(commissionRate?: number, mandiCess?: number): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/admin/policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRate, mandiCess }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline
    }
    return null;
  }
}

export const api = new MandiFlowApiClient();
