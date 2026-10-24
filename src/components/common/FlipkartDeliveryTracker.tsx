import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Radio,
  Thermometer,
  Box,
  Layers,
  ArrowRight,
  User,
  Share2,
  AlertTriangle,
  RotateCw,
  X,
  Compass,
  Satellite,
  Activity,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';
import { FarmerPledge } from '../../types';

interface FlipkartDeliveryTrackerProps {
  pledge?: FarmerPledge;
  onClose?: () => void;
  isModal?: boolean;
}

export interface CorridorWaypoint {
  km: number;
  name: string;
  shortName: string;
  state: string;
  lat: number;
  lng: number;
  tollName?: string;
  type: 'hub' | 'toll' | 'border' | 'logistics' | 'mandi';
  desc: string;
}

export const CORRIDOR_WAYPOINTS: CorridorWaypoint[] = [
  {
    km: 0,
    name: 'Sahyadri FPO Center, Pimpalgaon Baswant',
    shortName: 'Pimpalgaon Hub',
    state: 'Maharashtra',
    lat: 20.1754,
    lng: 73.9877,
    type: 'hub',
    desc: 'Origin Farm Hub: Cold chamber loaded & sealed with botanical ethylene barrier at 06:00 AM.',
  },
  {
    km: 145,
    name: 'Dhule NH-52 Junction Fastag Toll',
    shortName: 'Dhule Toll',
    state: 'Maharashtra',
    lat: 20.9042,
    lng: 74.7749,
    tollName: 'Dhule Bypass Fastag Plaza',
    type: 'toll',
    desc: 'Automated Fastag RFID cleared. e-Way Bill active & verified.',
  },
  {
    km: 250,
    name: 'Sendhwa MP Inter-State Border Checkpost',
    shortName: 'MP Border',
    state: 'Madhya Pradesh',
    lat: 21.6881,
    lng: 75.0938,
    tollName: 'Sendhwa Gateway Barrier',
    type: 'border',
    desc: 'Commercial Tax & Agricultural Interstate transit manifest scanned automatically.',
  },
  {
    km: 410,
    name: 'Indore Multi-Modal Freight Logistics Park',
    shortName: 'Indore Hub',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
    type: 'logistics',
    desc: 'Cold-chain telemetry audit checkpoint. Reefer chamber steady at optimal setpoint.',
  },
  {
    km: 660,
    name: 'Kota Chambal Expressway Bridge',
    shortName: 'Kota Bridge',
    state: 'Rajasthan',
    lat: 25.1825,
    lng: 75.8398,
    tollName: 'Chambal River Hanging Bridge Plaza',
    type: 'toll',
    desc: 'High-speed 6-lane express freight corridor transit.',
  },
  {
    km: 810,
    name: 'Jaipur South Smart Freight Corridor (NH-48)',
    shortName: 'Jaipur Bypass',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    tollName: 'Jaipur Ring Road Expressway Toll',
    type: 'logistics',
    desc: 'Automated ANPR vehicle scan & driver telematics checkpoint passed.',
  },
  {
    km: 890,
    name: 'NH-48 Kotputli Smart Freight Corridor',
    shortName: 'Kotputli (Active)',
    state: 'Rajasthan',
    lat: 27.7025,
    lng: 76.1983,
    tollName: 'Kotputli North Toll Plaza (KM 884)',
    type: 'toll',
    desc: 'CURRENT REAL-TIME POSITION: Live GPS ping confirmed. Speed 58 km/h.',
  },
  {
    km: 1020,
    name: 'Manesar Electronic Weighbridge & Toll',
    shortName: 'Manesar Toll',
    state: 'Haryana',
    lat: 28.3512,
    lng: 76.9428,
    tollName: 'KMP Expressway Inter-Connect Plaza',
    type: 'toll',
    desc: 'Pre-mandi automated gross weight screening & priority digital gate ticket.',
  },
  {
    km: 1140,
    name: 'Azadpur APMC Mandi Inbound Gate 4 (Delhi)',
    shortName: 'Azadpur Mandi',
    state: 'Delhi NCT',
    lat: 28.7155,
    lng: 77.1810,
    type: 'mandi',
    desc: 'Final Destination: e-NAM Electronic Bidding Yard Bay 4 & Kisan Direct Payout.',
  },
];

export const FlipkartDeliveryTracker: React.FC<FlipkartDeliveryTrackerProps> = ({
  pledge: propPledge,
  onClose,
  isModal = false,
}) => {
  const {
    truckTelemetry,
    pledges,
    userSession,
    advanceTruckMilestone,
    advanceTruckLocation,
    updateTruckTelemetryData,
    toggleReeferFault,
    signTruckEpod,
    addToast,
  } = useApp();

  // If a specific pledge wasn't provided, use the first allocated/pledged one or default
  const [selectedPledgeId, setSelectedPledgeId] = useState<string>(
    propPledge?.id || pledges[0]?.id || 'PLG-2026-881'
  );

  const activePledge =
    pledges.find((p) => p.id === selectedPledgeId) ||
    propPledge ||
    pledges[0];

  const [callActive, setCallActive] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [liveAutoTrack, setLiveAutoTrack] = useState<boolean>(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState<CorridorWaypoint | null>(null);

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((truckTelemetry.distanceCoveredKm / truckTelemetry.totalDistanceKm) * 100))
  );

  const isReeferWarning = truckTelemetry.reeferStatus === 'TEMP_WARNING';
  const remainingKm = Math.max(0, truckTelemetry.totalDistanceKm - truckTelemetry.distanceCoveredKm);

  // Derive order identifiers based on pledge and vehicle
  const orderId = `OD-MF-${activePledge?.id.replace('PLG-', '') || '881'}-${truckTelemetry.registrationNumber.slice(-4)}`;
  const ewayBill = `EWB-2026-${truckTelemetry.registrationNumber.replace(/[^0-9]/g, '').slice(-4) || '8921'}`;

  // Find current waypoint along the corridor
  const activeWaypoint =
    [...CORRIDOR_WAYPOINTS]
      .reverse()
      .find((wp) => truckTelemetry.distanceCoveredKm >= wp.km) || CORRIDOR_WAYPOINTS[0];

  // Find next upcoming waypoint
  const nextWaypoint = CORRIDOR_WAYPOINTS.find((wp) => wp.km > truckTelemetry.distanceCoveredKm) || null;
  const kmToNextWaypoint = nextWaypoint ? Math.max(0, nextWaypoint.km - truckTelemetry.distanceCoveredKm) : 0;

  // Auto-track live GPS simulation effect (pings and advances position)
  useEffect(() => {
    if (!liveAutoTrack) return;

    const interval = setInterval(() => {
      // Don't advance past total distance
      if (truckTelemetry.distanceCoveredKm >= truckTelemetry.totalDistanceKm) {
        return;
      }
      // Advance by +2.5 km smoothly
      advanceTruckLocation(2.5);
    }, 3800);

    return () => clearInterval(interval);
  }, [liveAutoTrack, truckTelemetry.distanceCoveredKm, truckTelemetry.totalDistanceKm, advanceTruckLocation]);

  const handleShareLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    addToast('info', 'Tracking Link Copied', `Sharable live GPS delivery link for ${orderId} copied to clipboard.`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCallDriver = () => {
    setCallActive(true);
    addToast('info', `Calling ${truckTelemetry.driverName}`, `Dialing registered driver phone: ${truckTelemetry.driverPhone}...`);
    setTimeout(() => setCallActive(false), 4000);
  };

  const handleFastForward = () => {
    advanceTruckLocation(25);
    addToast('success', 'Fast-Forwarded Route', 'Advanced truck GPS position by +25 km along NH-48 corridor.');
  };

  const handleResetRoute = () => {
    updateTruckTelemetryData({
      distanceCoveredKm: 145,
      currentLocation: {
        name: 'Dhule NH-52 Junction Fastag Toll',
        lat: 20.9042,
        lng: 74.7749,
      },
      speedKmH: 58,
      headingDeg: 22,
      headingText: 'NNE',
    });
    addToast('info', 'Route Reset', 'Truck GPS location reset to Dhule NH-52 Toll for simulation replay.');
  };

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        color: '#f8fafc',
        fontFamily: 'inherit',
      }}
    >
      <style>{`
        @keyframes radarRipple {
          0% { transform: scale(0.9); opacity: 0.95; }
          60% { transform: scale(2.6); opacity: 0.35; }
          100% { transform: scale(3.6); opacity: 0; }
        }
        @keyframes radarRippleInner {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.8); opacity: 0.4; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes liveGpsBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes roadDashFlow {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Flipkart Style Order Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          padding: '20px 24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #10b981, #fbbf24)',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.18)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#38bdf8',
                    animation: 'liveGpsBlink 1.5s infinite',
                  }}
                />
                LIVE REAL-TIME GPS TRACKER
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Order ID: <strong style={{ color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{orderId}</strong>
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                e-Way Bill: <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{ewayBill}</strong>
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {activePledge?.commodity} ({activePledge?.quantityQuintals} Quintals / {(activePledge?.quantityQuintals * 100).toLocaleString()} kg)
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
              Harvest Consignment booked by <strong style={{ color: '#38bdf8' }}>{activePledge?.farmerName}</strong> from <strong style={{ color: '#cbd5e1' }}>{activePledge?.locationVillage}, Nashik</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleShareLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} />
              <span>{copiedLink ? 'Link Copied!' : 'Share Live GPS'}</span>
            </button>

            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Route From → To Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '14px 18px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              📍 Dispatch Origin (Farm / Hub)
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {activePledge?.locationVillage || 'Pimpalgaon Baswant'}, Nashik (MH)
            </div>
            <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
              Sahyadri FPO Agro-Collection Center (KM 0)
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <Truck size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
                {truckTelemetry.distanceCoveredKm} km done • {remainingKm} km left
              </span>
              <ArrowRight size={14} color="#38bdf8" />
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
              Speed: <strong style={{ color: '#34d399' }}>{truckTelemetry.speedKmH || 58} km/h</strong> • ETA ~{Math.max(1, Math.round(remainingKm / 60))}h remaining
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              🏁 Delivery Destination (APMC Mandi)
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
              {truckTelemetry.routeDestination}
            </div>
            <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
              e-NAM Electronic Bidding Yard Bay 4 (KM {truckTelemetry.totalDistanceKm})
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 FEATURE HIGHLIGHT: LIVE SATELLITE GPS CORRIDOR & REAL-TIME TRUCK RADAR */}
      {/* ========================================================================= */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Control Bar of Map */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Satellite size={18} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Live Interstate GPS Highway Radar & Satellite Corridor
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    background: liveAutoTrack ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: liveAutoTrack ? '#34d399' : '#f87171',
                    border: `1px solid ${liveAutoTrack ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: liveAutoTrack ? '#10b981' : '#ef4444',
                      animation: liveAutoTrack ? 'liveGpsBlink 1.2s infinite' : 'none',
                    }}
                  />
                  {liveAutoTrack ? 'LIVE TELEMETRY STREAMING' : 'STREAM PAUSED'}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Active Route: NH-48 / NH-52 Dedicated Freight Corridor • Tracking Vehicle <strong style={{ color: '#38bdf8' }}>{truckTelemetry.registrationNumber}</strong>
              </p>
            </div>
          </div>

          {/* Quick Simulation & Live Tracking Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setLiveAutoTrack(!liveAutoTrack);
                addToast(
                  'info',
                  liveAutoTrack ? 'Live Auto-Tracking Paused' : 'Live Auto-Tracking Resumed',
                  liveAutoTrack
                    ? 'GPS interval paused. Manual simulation still available.'
                    : 'GPS live streaming active. Truck moving along highway corridor.'
                );
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: liveAutoTrack ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                border: `1px solid ${liveAutoTrack ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`,
                color: liveAutoTrack ? '#34d399' : '#38bdf8',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {liveAutoTrack ? <Pause size={13} /> : <Play size={13} />}
              <span>{liveAutoTrack ? 'Pause Live GPS' : 'Resume Live GPS'}</span>
            </button>

            <button
              type="button"
              onClick={handleFastForward}
              title="Advance truck GPS by +25 km"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FastForward size={13} />
              <span>Drive +25 km</span>
            </button>

            <button
              type="button"
              onClick={handleResetRoute}
              title="Reset truck to Dhule waypoint"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Real-time Highway Radar Corridor Canvas */}
        <div
          style={{
            position: 'relative',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(14, 27, 49, 0.9) 0%, rgba(8, 12, 22, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '40px 30px 48px 30px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Radar Background Grid Lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />

          {/* State Boundary Badges on Top */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.64rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 700,
              pointerEvents: 'none',
            }}
          >
            <span>Maharashtra (Nashik Hub)</span>
            <span>Madhya Pradesh (MP)</span>
            <span>Rajasthan (NH-48)</span>
            <span>Haryana (NCR)</span>
            <span>Delhi (Azadpur Mandi)</span>
          </div>

          {/* SVG Road Track with Traveled vs Remaining Neon Stroke */}
          <div style={{ position: 'relative', width: '100%', height: '56px', display: 'flex', alignItems: 'center' }}>
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
              }}
              preserveAspectRatio="none"
              viewBox="0 0 1000 60"
            >
              <defs>
                <linearGradient id="neonTraveledGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Road bed shadow */}
              <line
                x1="0"
                y1="30"
                x2="1000"
                y2="30"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Remaining route (dashed slate line) */}
              <line
                x1="0"
                y1="30"
                x2="1000"
                y2="30"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="6 6"
              />

              {/* Traveled route (glowing neon line up to progressPercent) */}
              <line
                x1="0"
                y1="30"
                x2={Math.max(10, progressPercent * 10)}
                y2="30"
                stroke="url(#neonTraveledGlow)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#corridorGlow)"
              />

              {/* Animated pulses on traveled road */}
              <line
                x1="0"
                y1="30"
                x2={Math.max(10, progressPercent * 10)}
                y2="30"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="8 16"
                strokeOpacity="0.7"
                style={{ animation: 'roadDashFlow 1.5s linear infinite' }}
              />
            </svg>

            {/* Waypoint Checkpoint Markers along the Track */}
            {CORRIDOR_WAYPOINTS.map((wp, idx) => {
              const wpPercent = Math.round((wp.km / truckTelemetry.totalDistanceKm) * 100);
              const isPassed = truckTelemetry.distanceCoveredKm >= wp.km;
              const isTargetActive = wp.name === activeWaypoint.name;

              return (
                <div
                  key={wp.km}
                  onClick={() => setSelectedWaypoint(wp)}
                  style={{
                    position: 'absolute',
                    left: `${wpPercent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: isTargetActive ? 8 : 4,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  title={`${wp.shortName} (KM ${wp.km}) — Click for details`}
                >
                  <div
                    style={{
                      width: isTargetActive ? '16px' : '11px',
                      height: isTargetActive ? '16px' : '11px',
                      borderRadius: '50%',
                      background: isPassed
                        ? isTargetActive
                          ? '#38bdf8'
                          : '#10b981'
                        : '#475569',
                      border: isTargetActive
                        ? '3px solid #ffffff'
                        : '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: isPassed
                        ? isTargetActive
                          ? '0 0 16px #38bdf8'
                          : '0 0 8px rgba(16, 185, 129, 0.6)'
                        : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Waypoint Name below dot */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '22px',
                      fontSize: '0.66rem',
                      fontWeight: isTargetActive ? 800 : 600,
                      color: isTargetActive
                        ? '#38bdf8'
                        : isPassed
                        ? '#94a3b8'
                        : '#64748b',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {wp.shortName}
                  </span>
                </div>
              );
            })}

            {/* ========================================================= */}
            {/* 🚚 DYNAMIC LIVE TRUCK GPS BEACON (REAL-TIME MOVING MARKER) */}
            {/* ========================================================= */}
            <div
              style={{
                position: 'absolute',
                left: `${progressPercent}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                transition: 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {/* Floating Live Callout Tooltip right above truck */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '36px',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(2, 132, 199, 0.95))',
                  border: '1px solid rgba(56, 189, 248, 0.7)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 20,
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e',
                    animation: 'liveGpsBlink 1.2s infinite',
                  }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff' }}>
                  {truckTelemetry.registrationNumber} • {truckTelemetry.speedKmH || 58} km/h
                </span>
                <span style={{ fontSize: '0.68rem', color: '#7dd3fc', fontWeight: 600 }}>
                  ({progressPercent}%)
                </span>
              </div>

              {/* Radar Sonar Ping Outer Rings */}
              <div
                style={{
                  position: 'absolute',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.25)',
                  animation: 'radarRipple 2.2s infinite',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.35)',
                  animation: 'radarRippleInner 2.2s infinite',
                  pointerEvents: 'none',
                }}
              />

              {/* Truck Icon Capsule */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.9), 0 4px 12px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  zIndex: 12,
                }}
              >
                <Truck size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Waypoint Modal / Popover Info */}
        {selectedWaypoint && (
          <div
            style={{
              marginTop: '14px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedWaypoint.state} • Checkpoint Details
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  KM {selectedWaypoint.km} / {truckTelemetry.totalDistanceKm}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                {selectedWaypoint.name}
              </div>
              <p style={{ fontSize: '0.76rem', color: '#cbd5e1', margin: '3px 0 0' }}>
                {selectedWaypoint.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedWaypoint(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Telematics HUD Bar (Heads-Up Telemetry Display) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {/* Card 1: Exact Current Coordinates */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <MapPin size={13} color="#38bdf8" />
              <span>CURRENT GPS COORDINATES</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
              {truckTelemetry.currentLocation.lat.toFixed(4)}° N, {truckTelemetry.currentLocation.lng.toFixed(4)}° E
            </div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {truckTelemetry.currentLocation.name}
            </div>
          </div>

          {/* Card 2: Speedometer & Heading */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <Activity size={13} color="#34d399" />
              <span>LIVE SPEEDOMETER & HEADING</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span>{truckTelemetry.speedKmH || 58} km/h</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                ({truckTelemetry.headingText || 'NNE'} {truckTelemetry.headingDeg || 24}°)
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
              Cruise control active • NH-48 speed limit 80 km/h
            </div>
          </div>

          {/* Card 3: Satellite GNSS Precision */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <Satellite size={13} color="#fbbf24" />
              <span>GNSS SATELLITE FIX</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
              {truckTelemetry.gnssSatellites || 12} Satellites Locked
            </div>
            <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
              High-Precision DGPS (±1.1m error margin) • Alt: {truckTelemetry.altitudeM || 312}m
            </div>
          </div>

          {/* Card 4: Next Fastag Toll Checkpoint */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
              <Radio size={13} color="#c084fc" />
              <span>UPCOMING FASTAG RFID TOLL</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#e2e8f0', marginTop: '4px' }}>
              {nextWaypoint?.shortName || 'Azadpur Mandi Gate'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#c084fc', marginTop: '2px' }}>
              {kmToNextWaypoint} km remaining (ETA ~{Math.round(kmToNextWaypoint / 1.0)} mins)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Status Timeline (Left) & Telematics Driver Details (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {/* LEFT COLUMN: Flipkart Style Step-by-Step Delivery Progress */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>
                Consignment Delivery Progress
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '3px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              {progressPercent}% EN ROUTE
            </span>
          </div>

          {/* Flipkart Visual Vertical Step Flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
            {/* Step 1: Pledged */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
              {/* Connector line */}
              <div
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '30px',
                  bottom: 0,
                  width: '2px',
                  background: '#10b981',
                }}
              />
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                    Harvest Produce Pledged & Reported
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>23 Oct, 06:30 AM</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0' }}>
                  Farmer <strong>{activePledge?.farmerName}</strong> booked {activePledge?.quantityQuintals} Q of {activePledge?.commodity} at {activePledge?.locationVillage} Collection Center.
                </p>
              </div>
            </div>

            {/* Step 2: Quality Assayed & Reefer Loaded */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '30px',
                  bottom: 0,
                  width: '2px',
                  background: '#10b981',
                }}
              />
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                    Quality Assayed & Loaded in Reefer
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>23 Oct, 08:30 AM</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0' }}>
                  FAQ Grade-A certified. Aggregated into <strong>{truckTelemetry.model} ({truckTelemetry.registrationNumber})</strong> with botanical ethylene isolation.
                </p>
              </div>
            </div>

            {/* Step 3: In Transit (CURRENT ACTIVE WAYPOINT) */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '30px',
                  bottom: 0,
                  width: '2px',
                  background: progressPercent >= 95 ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.8)',
                  flexShrink: 0,
                  animation: 'pulse 2s infinite',
                }}
              >
                <Truck size={17} />
              </div>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Radio size={14} color="#38bdf8" />
                    <span>In Transit — Live Highway Corridor</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                    CURRENT LOCATION
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                  📍 {truckTelemetry.currentLocation.name}
                </div>
                <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 0' }}>
                  Distance: <strong>{truckTelemetry.distanceCoveredKm} km covered</strong> ({remainingKm} km to destination). Fastag toll & RFID verified.
                </p>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>
                    Chamber: {truckTelemetry.chamberTempC}°C (Safe)
                  </span>
                  <span>•</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                    Speed: {truckTelemetry.speedKmH || 58} km/h
                  </span>
                  <span>•</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                    ETA: ~{Math.max(1, Math.round(remainingKm / 60))}h remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4: Mandi Gate & Weighbridge */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '30px',
                  bottom: 0,
                  width: '2px',
                  background: progressPercent >= 100 ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: progressPercent >= 100 ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                  color: progressPercent >= 100 ? '#ffffff' : '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  flexShrink: 0,
                }}
              >
                {progressPercent >= 100 ? <CheckCircle2 size={18} /> : <Clock size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
                    APMC Mandi Inbound Gate & Smart Weighbridge
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {progressPercent >= 100 ? 'Arrived' : 'Expected ~03:15 PM'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0' }}>
                  Electronic gate pass scan and certified digital weighment at {truckTelemetry.routeDestination}.
                </p>
              </div>
            </div>

            {/* Step 5: e-NAM Auction & Payment */}
            <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: truckTelemetry.epodSigned ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                  color: truckTelemetry.epodSigned ? '#ffffff' : '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  flexShrink: 0,
                }}
              >
                {truckTelemetry.epodSigned ? <CheckCircle2 size={18} /> : <ShieldCheck size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
                    e-NAM Auction Hammer & Escrow Payout
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {truckTelemetry.epodSigned ? 'Completed' : 'Expected ~04:30 PM'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0' }}>
                  National electronic bidding hammer cleared. Net realization credited directly to Kisan DBT bank account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Driver Details, Telematics & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Driver & Transporter Card (Flipkart Delivery Partner Card) */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px' }}>
              Assigned Delivery Partner & Reefer Vehicle
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                }}
              >
                <User size={26} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {truckTelemetry.driverName}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    ★ 4.9 Verified
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Phone: <strong style={{ color: '#38bdf8' }}>{truckTelemetry.driverPhone}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Vehicle: {truckTelemetry.registrationNumber} ({truckTelemetry.model})
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={handleCallDriver}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: callActive ? '#059669' : 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Phone size={15} />
                <span>{callActive ? 'Dialing Driver...' : 'Call Driver'}</span>
              </button>

              <button
                type="button"
                onClick={() => addToast('info', 'Messaging Driver', `SMS channel opened with driver at ${truckTelemetry.driverPhone}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MessageSquare size={15} />
                <span>SMS Driver</span>
              </button>
            </div>
          </div>

          {/* IoT Cold Chain Telematics Status */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              background: isReeferWarning ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.85)',
              border: isReeferWarning ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Live Reefer Cargo Environment
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isReeferWarning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isReeferWarning ? '#f87171' : '#34d399',
                  fontWeight: 700,
                }}
              >
                {isReeferWarning ? '⚠️ TEMP ALERT' : '✅ OPTIMAL COOLING'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Chamber Temp</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isReeferWarning ? '#f87171' : '#34d399', marginTop: '2px' }}>
                  {truckTelemetry.chamberTempC}°C
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Humidity</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {truckTelemetry.chamberHumidityPercent}%
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ethylene gas</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                  {truckTelemetry.ethylenePpm} ppm
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Driver Action Buttons */}
          <div
            className="glass-panel"
            style={{
              padding: '18px',
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#c4b5fd', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
              Live Telemetry Simulation & Checkpoint Controls
            </div>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 12px' }}>
              Both the truck driver and seller see live updates as checkpoints are reached along the national corridor.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={advanceTruckMilestone}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <RotateCw size={15} />
                <span>Advance to Next Checkpoint Milestone (+95 km)</span>
              </button>

              <button
                type="button"
                onClick={toggleReeferFault}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isReeferWarning ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${isReeferWarning ? '#10b981' : 'rgba(239, 68, 68, 0.35)'}`,
                  color: isReeferWarning ? '#34d399' : '#f87171',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <AlertTriangle size={14} />
                <span>{isReeferWarning ? 'Resolve Cooling Fault' : 'Simulate Chamber Temp Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: '20px',
            background: '#0f172a',
            padding: '24px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};
