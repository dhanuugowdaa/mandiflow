import { WebSocket, WebSocketServer } from 'ws';

export interface WebSocketEvent {
  type: 
    | 'COMMODITY_PRICE_UPDATE'
    | 'NEW_PLEDGE'
    | 'COALITION_UPDATED'
    | 'NEW_BID'
    | 'AUCTION_HAMMERED'
    | 'WEIGHMENT_COMMITTED'
    | 'TELEMETRY_TICK'
    | 'AUDIT_LOG_ENTRY'
    | 'SYSTEM_ALERT';
  payload: any;
  timestamp: string;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  public init(wss: WebSocketServer) {
    this.wss = wss;

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);
      console.log(`[WebSocket] Client connected. Total active connections: ${this.clients.size}`);

      // Send immediate welcome handshake
      ws.send(
        JSON.stringify({
          type: 'SYSTEM_ALERT',
          payload: { message: 'Connected to MandiFlow Real-Time PubSub Engine' },
          timestamp: new Date().toISOString(),
        })
      );

      ws.on('message', (message: string) => {
        try {
          const parsed = JSON.parse(message.toString());
          console.log('[WebSocket] Inbound message received:', parsed.type);
        } catch {
          // ignore non-json
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WebSocket] Client disconnected. Total active connections: ${this.clients.size}`);
      });

      ws.on('error', (err) => {
        console.error('[WebSocket] Socket error:', err);
        this.clients.delete(ws);
      });
    });
  }

  public broadcast(type: WebSocketEvent['type'], payload: any) {
    if (!this.wss) return;

    const event: WebSocketEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    const message = JSON.stringify(event);

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (err) {
          console.error('[WebSocket] Failed to send to client:', err);
        }
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const wsManager = new WebSocketManager();
