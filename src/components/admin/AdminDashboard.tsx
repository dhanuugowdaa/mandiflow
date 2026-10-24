import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  SlidersHorizontal,
  Leaf,
  FileText,
  Activity,
  TrendingUp,
  Award,
  Sparkles,
  Lock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    auditLogs,
    commissionRate,
    setCommissionRate,
    mandiCess,
    setMandiCess,
    addToast,
    resetDemoData,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [dieselPrice, setDieselPrice] = useState<number>(94);
  const [poolingEfficiencyKm, setPoolingEfficiencyKm] = useState<number>(31500);

  // Carbon calculation:
  // km saved / 3.5 km/L diesel = litres of diesel saved
  // Litres * 2.68 kg CO2/L = kg CO2 saved
  const dieselLitresSaved = Math.round(poolingEfficiencyKm / 3.5);
  const carbonTonnesSaved = Math.round((dieselLitresSaved * 2.68) / 100) / 10;
  const dieselCostSavedInr = dieselLitresSaved * dieselPrice;

  const handleApplyPolicy = () => {
    confetti({
      particleCount: 100,
      spread: 70,
    });
    addToast(
      'success',
      'APMC Policy Updated',
      `Commission ceiling set to ${commissionRate}% and Mandi Cess to ${mandiCess}%. Broadcasted to all 1,361 APMC nodes.`
    );
  };

  const filteredLogs = activeFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter((l) => l.complianceTag === activeFilter);

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
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#f59e0b" />
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#f8fafc' }}>
              Admin Dashboard <span style={{ color: '#f59e0b' }}>(Apex Governance & Regulatory Oversight)</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Directorate of Marketing & Inspection | DPDP Act 2023 Compliant | Agmarknet & APMC Model Act Orchestrator
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              confetti({ particleCount: 150, spread: 90 });
              addToast('success', 'Pipeline Verified', 'All 6 MandiFlow supply-chain modules validated with mathematical precision!');
            }}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Sparkles size={16} />
            <span>Verify End-to-End Pipeline</span>
          </button>
        </div>
      </div>

      {/* 4 Apex KPI Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Produce Routed
            </span>
            <Activity size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            18,420 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#34d399' }}>Quintals</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            1,842 Metric Tonnes routed across 14 state corridors
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Farmer Freight Saved
            </span>
            <TrendingUp size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
            ₹28.4 Lakhs <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#a7f3d0' }}>(+37.2%)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Retained directly by smallholder farmers via Shapley load pooling
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Spoilage Loss Averted
            </span>
            <Award size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
            142.5 MT <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1' }}>Produce</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Preserved through real-time Arrhenius SLI kinetics and cold chain
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Carbon Emissions Offset
            </span>
            <Leaf size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
            {carbonTonnesSaved} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>tCO₂e</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Green freight credits issued to transport cooperatives
          </div>
        </div>
      </div>

      {/* Master Policy Sliders & ESG Simulator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Dynamic Regulatory Controls */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <SlidersHorizontal size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              Dynamic Mandi Statutory Policy Controls
            </h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            Regulate APMC market commission rate caps and cess percentages in real time. Changes propagate dynamically across all settlement ledgers.
          </p>

          {/* Slider 1: Commission Rate */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
                Arhatiya Commission Ceiling Cap
              </span>
              <span className="mono-text" style={{ fontSize: '0.95rem', color: '#fbbf24', fontWeight: 700 }}>
                {commissionRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', height: '6px', borderRadius: '4px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>1.0% (Subsidized)</span>
              <span>4.0% (Balanced)</span>
              <span>8.0% (Historical High)</span>
            </div>
          </div>

          {/* Slider 2: Mandi Cess */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
                State APMC Infrastructure Cess
              </span>
              <span className="mono-text" style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: 700 }}>
                {mandiCess.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.25"
              value={mandiCess}
              onChange={(e) => setMandiCess(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', height: '6px', borderRadius: '4px', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>0.5% (Low)</span>
              <span>1.5% (Standard)</span>
              <span>3.5% (Max)</span>
            </div>
          </div>

          <button
            onClick={handleApplyPolicy}
            className="btn btn-saffron"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
          >
            <CheckCircle2 size={16} />
            <span>Apply Statutory Changes & Update APMC Clearing House</span>
          </button>
        </div>

        {/* ESG & Carbon Reduction Simulator */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Leaf size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              Green Freight & Carbon Offset Simulator
            </h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            {"Verified emission formulation: CO₂ Saved = (km saved ÷ 3.5 km/L) × 2.68 kg CO₂/L. Consolidating farm truck routes avoids wasteful empty return miles."}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
                Total Deadhaul Kilometers Prevented
              </span>
              <span className="mono-text" style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 700 }}>
                {poolingEfficiencyKm.toLocaleString()} km
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="80000"
              step="2500"
              value={poolingEfficiencyKm}
              onChange={(e) => setPoolingEfficiencyKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', height: '6px', borderRadius: '4px', cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Diesel Fuel Saved:</span>
              <span className="mono-text" style={{ color: '#ffffff', fontWeight: 700 }}>
                {dieselLitresSaved.toLocaleString()} Litres
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fuel Cost Retained by Transporters:</span>
              <span className="mono-text" style={{ color: '#fbbf24', fontWeight: 700 }}>
                ₹{dieselCostSavedInr.toLocaleString()} INR
              </span>
            </div>
            <div
              style={{
                borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                paddingTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.95rem',
                fontWeight: 800,
              }}
            >
              <span style={{ color: '#34d399' }}>Verified CO₂ Emissions Offset:</span>
              <span className="mono-text" style={{ color: '#34d399' }}>
                {carbonTonnesSaved} Metric Tonnes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable DPDP Act 2023 Tamper-Evident Audit Trail */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              DPDP Act 2023 Tamper-Evident Audit Stream
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'DPDP_ACT_2023', 'APMC_MODEL_ACT', 'AGMARK_STANDARDS'].map((filterTag) => (
              <button
                key={filterTag}
                onClick={() => setActiveFilter(filterTag)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: activeFilter === filterTag ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                  background: activeFilter === filterTag ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: activeFilter === filterTag ? '#fbbf24' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {filterTag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass-bright)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>AUDIT ID</th>
                <th style={{ padding: '12px 14px' }}>TIMESTAMP</th>
                <th style={{ padding: '12px 14px' }}>ACTOR & ROLE</th>
                <th style={{ padding: '12px 14px' }}>ACTION EVENT</th>
                <th style={{ padding: '12px 14px' }}>DETAILS & EVENT PAYLOAD</th>
                <th style={{ padding: '12px 14px' }}>SHA-256 HASH</th>
                <th style={{ padding: '12px 14px' }}>COMPLIANCE TAG</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass)',
                  }}
                >
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                    {log.id}
                  </td>
                  <td style={{ padding: '14px', fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{log.actor}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      {log.actorRole}
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600, color: '#fbbf24' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1', fontSize: '0.8rem', maxWidth: '320px' }}>
                    {log.details}
                  </td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {log.hashSha256.substring(0, 16)}...
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-emerald">{log.complianceTag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
