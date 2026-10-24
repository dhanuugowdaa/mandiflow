import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Thermometer,
  Droplets,
  Wind,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Zap,
  MapPin,
  Clock,
  Radio,
} from 'lucide-react';
import { FlipkartDeliveryTracker } from '../common/FlipkartDeliveryTracker';

export const TruckDashboard: React.FC = () => {
  const {
    truckTelemetry,
    toggleReeferFault,
    advanceTruckMilestone,
    signTruckEpod,
    userSession,
  } = useApp();

  const [recipientName, setRecipientName] = useState<string>('Azadpur APMC Superintendent (Bay 4)');

  const isWarning = truckTelemetry.reeferStatus === 'TEMP_WARNING';
  const progressPercent = Math.round((truckTelemetry.distanceCoveredKm / truckTelemetry.totalDistanceKm) * 100);

  const handleEpodSign = (e: React.FormEvent) => {
    e.preventDefault();
    signTruckEpod(recipientName);
  };

  return (
    <div style={{ padding: '28px 24px', maxWidth: '1700px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(167, 139, 250, 0.15)',
                border: '1px solid #a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={20} color="#a78bfa" />
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#f8fafc' }}>
              Truck Dashboard <span style={{ color: '#a78bfa' }}>(Logistics Fleet & Reefer Telematics)</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Vehicle: <strong>{truckTelemetry.registrationNumber} ({truckTelemetry.model})</strong> | Driver: <strong>{truckTelemetry.driverName} ({truckTelemetry.driverPhone})</strong> | Fastag RFID Active
          </p>
        </div>
      </div>

      {/* Flipkart Style Consignment Route & Delivery Tracker (Driver View) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 10px #38bdf8',
              }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Live Consignment Route & Delivery Tracker (Driver Cockpit)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Shared real-time with Farmer / Seller • Fastag GPS Active
          </span>
        </div>

        <FlipkartDeliveryTracker isModal={false} />
      </div>

      {/* 4 IoT Telematics Live Gauges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        {/* Gauge 1: Chamber Temp */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            border: isWarning ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid var(--border-glass)',
            background: isWarning ? 'rgba(244, 63, 94, 0.08)' : 'rgba(15, 23, 42, 0.75)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Reefer Chamber Temp
            </span>
            <Thermometer size={18} color={isWarning ? '#fb7185' : '#34d399'} />
          </div>
          <div className="mono-text" style={{ fontSize: '2.1rem', fontWeight: 800, color: isWarning ? '#fb7185' : '#34d399', marginBottom: '4px' }}>
            {truckTelemetry.chamberTempC}°C
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${isWarning ? 'badge-rose' : 'badge-emerald'}`}>
              {isWarning ? 'COMPRESSOR FAULT' : 'OPTIMAL COLD CHAIN'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Target: {truckTelemetry.targetTempC}°C
            </span>
          </div>
        </div>

        {/* Gauge 2: Humidity */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Relative Humidity
            </span>
            <Droplets size={18} color="#38bdf8" />
          </div>
          <div className="mono-text" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
            {truckTelemetry.chamberHumidityPercent}% <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>RH</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Moisture loss prevention zone for vegetable transit
          </div>
        </div>

        {/* Gauge 3: Ethylene Sensor */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Ethylene Gas Concentration
            </span>
            <Wind size={18} color="#fbbf24" />
          </div>
          <div className="mono-text" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
            {truckTelemetry.ethylenePpm} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>PPM</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Strict botanical quarantine threshold &lt; 0.20 PPM
          </div>
        </div>

        {/* Gauge 4: Spoilage Risk Score */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Spoilage Risk Probability
            </span>
            <ShieldCheck size={18} color={isWarning ? '#fb7185' : '#34d399'} />
          </div>
          <div className="mono-text" style={{ fontSize: '2.1rem', fontWeight: 800, color: isWarning ? '#fb7185' : '#34d399', marginBottom: '4px' }}>
            {truckTelemetry.spoilageRiskScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {isWarning ? 'Rerouting recommendation triggered' : 'Cargo safety guaranteed to delivery'}
          </div>
        </div>
      </div>

      {/* Corridor Route Tracker & IoT Telematics Simulator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* GPS Transit Corridor & Milestones */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={20} color="#a78bfa" />
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
                Smart Freight Corridor GPS Board
              </h3>
            </div>
            <span className="badge badge-sky">
              <Radio size={12} /> Live Satellite Beacon
            </span>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Corridor Progress:</span>
              <span className="mono-text" style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>
                {truckTelemetry.distanceCoveredKm} / {truckTelemetry.totalDistanceKm} km ({progressPercent}%)
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #38bdf8)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <MapPin size={14} color="#f43f5e" />
              <span>Current Checkpoint: <strong>{truckTelemetry.currentLocation.name}</strong></span>
            </div>
          </div>

          {/* Waypoint Milestones List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {truckTelemetry.milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: m.completed ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  border: m.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-glass)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: m.completed ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {m.completed ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: m.completed ? '#f8fafc' : 'var(--text-muted)', fontWeight: m.completed ? 600 : 400 }}>
                    {m.name}
                  </span>
                </div>
                {m.timestamp && (
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {m.timestamp}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={advanceTruckMilestone}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
          >
            <Clock size={16} />
            <span>Simulate Advancing Next GPS Waypoint</span>
          </button>
        </div>

        {/* Cold-Chain Stress Test & Digital Proof of Delivery (ePoD) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Compressor Fault Stress-Test Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Zap size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                IoT Reefer Telematics Simulator
              </h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Simulate an unexpected compressor failure or thermal heatwave spike to verify how MandiFlow triggers automatic audio-visual alerts and reprioritizes the route.
            </p>

            <button
              onClick={toggleReeferFault}
              className={`btn ${isWarning ? 'btn-primary' : 'btn-danger'}`}
              style={{ width: '100%', padding: '11px', fontSize: '0.88rem' }}
            >
              <AlertTriangle size={16} />
              <span>{isWarning ? 'Recover Secondary Cooling System' : 'Simulate Compressor Breakdown & Heatwave (+23.4°C)'}</span>
            </button>
          </div>

          {/* ePoD Digital Proof of Delivery Pad */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <FileCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                Digital Proof of Delivery (ePoD)
              </h3>
            </div>

            {truckTelemetry.epodSigned ? (
              <div
                style={{
                  padding: '18px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={32} color="#34d399" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '4px' }}>
                  ePoD Cryptographically Executed
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Signed by: <strong>{truckTelemetry.epodRecipientName}</strong> at <strong>{truckTelemetry.epodTimestamp}</strong>. Driver escrow balance ₹38,500 released.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEpodSign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Mandi Receiving Officer / Buyer Agent
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-glass-bright)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-glass-bright)',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    [ Cryptographic HMAC-SHA256 ePoD Digital Pad ]
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '11px', fontSize: '0.88rem' }}
                >
                  <FileCheck size={16} />
                  <span>Execute Digital ePoD Signature & Release Escrow</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
