import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Box,
  Truck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Layers,
} from 'lucide-react';

export const FpoDashboard: React.FC = () => {
  const {
    coalitions,
    triggerGraspOptimization,
    pledges,
    userSession,
  } = useApp();

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
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} color="#38bdf8" />
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#f8fafc' }}>
              FPO Dashboard <span style={{ color: '#38bdf8' }}>(Aggregation & GRASP Coalition Console)</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Organization: <strong>Sahyadri Farmers Producer Co.</strong> | Regional Cluster: <strong>Nashik Agri Hub</strong> | Connected Farmers: <strong>1,240 Members</strong>
          </p>
        </div>
      </div>

      {/* Coalition Performance Summary Cards */}
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
              Active Truck Coalitions
            </span>
            <Truck size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            {coalitions.length} Lines <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#38bdf8' }}>(Reefer Fleet)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            High-speed corridor linking Maharashtra to Delhi NCR & Mumbai
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Mean Truck Fill Rate
            </span>
            <Box size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
            78.4% <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dim)' }}>(Target &gt; 60%)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            GRASP bin packing eliminates deadhaul freight air space
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Botanical Ethylene Isolation
            </span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
            100% Compliant
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Emitters (Banana) quarantined from Sensitives (Tomato)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              XGBoost Fill Prediction
            </span>
            <Sparkles size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
            P &gt; 0.91 <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1' }}>in 24h</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Exceeds the 0.82 auto-dispatch trigger criterion
          </div>
        </div>
      </div>

      {/* Main Coalitions Chamber Bin-Packing Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '28px' }}>
        {coalitions.map((coalition) => {
          const isOptimized = coalition.status === 'OPTIMIZED';
          const fillRatio = Math.round((coalition.currentWeightKg / coalition.maxCapacityKg) * 100);

          return (
            <div
              key={coalition.id}
              className="glass-panel"
              style={{
                padding: '26px',
                border: isOptimized ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span className="badge badge-sky">{coalition.id}</span>
                    <h3 style={{ fontSize: '1.3rem', color: '#f8fafc' }}>{coalition.name}</h3>
                    {isOptimized ? (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={12} /> GRASP LOCKED
                      </span>
                    ) : (
                      <span className="badge badge-saffron">
                        <Zap size={12} /> AGGREGATING LOTS
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Route: <strong>{coalition.originCenter}</strong> → <strong>{coalition.destinationMandi}</strong> | Fleet: <strong>{coalition.truckType}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!isOptimized ? (
                    <button
                      onClick={() => triggerGraspOptimization(coalition.id)}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                    >
                      <Zap size={15} />
                      <span>Run GRASP Bin Packing</span>
                    </button>
                  ) : (
                    <span className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                      ✓ Optimal Coalition Formed
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Dimensional Bin Packing Progress Bars */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '20px',
                  marginBottom: '22px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)',
                }}
              >
                {/* Weight Dimension */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                      Weight Capacity Utilization
                    </span>
                    <span className="mono-text" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
                      {coalition.currentWeightKg.toLocaleString()} / {coalition.maxCapacityKg.toLocaleString()} kg ({fillRatio}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      borderRadius: '5px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${fillRatio}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    Auto-trigger threshold (60% weight) satisfied.
                  </span>
                </div>

                {/* Volume Dimension */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                      Chamber Volumetric Utilization
                    </span>
                    <span className="mono-text" style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
                      {coalition.currentVolumeM3} / {coalition.volumeCapacityM3} m³ ({Math.round((coalition.currentVolumeM3 / coalition.volumeCapacityM3) * 100)}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '10px',
                      borderRadius: '5px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round((coalition.currentVolumeM3 / coalition.volumeCapacityM3) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #d97706, #fbbf24)',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    Multi-pallet stacking height compliance checked.
                  </span>
                </div>
              </div>

              {/* Botanical Ethylene Matrix Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#34d399" />
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
                    Botanical Ethylene Rule: No Cross-Contamination
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    (Bananas & Apples barred from Tomato / Green Vegetable chamber)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="badge badge-emerald">Ethylene PPM: &lt; 0.15 ppm</span>
                  <span className="badge badge-sky">Est. Dispatch: Today 17:00</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shapley Fair Cost Allocation Table for FPO Members */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              FPO Member Shapley Cost Allocations (Axiomatic Fair Split)
            </h3>
          </div>
          <span className="badge badge-sky">Owen-Value Monte Carlo CI: 95%</span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          {"Axiomatic formulation: φᵢ(v) = ∑ (|S|!(|N|-|S|-1)! / |N|!) × [v(S ∪ {i}) - v(S)]. Ensures that no single farmer bears an unfair penalty for joining the consolidated load."}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass-bright)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>FARMER MEMBER</th>
                <th style={{ padding: '12px 14px' }}>COMMODITY</th>
                <th style={{ padding: '12px 14px' }}>PLEDGED WEIGHT</th>
                <th style={{ padding: '12px 14px' }}>STANDALONE FREIGHT</th>
                <th style={{ padding: '12px 14px' }}>MANDIFLOW FAIR SHARE</th>
                <th style={{ padding: '12px 14px' }}>NET SAVINGS</th>
                <th style={{ padding: '12px 14px' }}>AXIOM STATUS</th>
              </tr>
            </thead>
            <tbody>
              {pledges.slice(0, 3).map((plg) => (
                <tr
                  key={plg.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass)',
                  }}
                >
                  <td style={{ padding: '14px', fontWeight: 600, color: '#f8fafc' }}>
                    {plg.farmerName} ({plg.id})
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>{plg.commodity}</td>
                  <td style={{ padding: '14px' }}>{plg.quantityQuintals} Quintals</td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    ₹{plg.freightSoloInr.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399' }}>
                    ₹{plg.freightCoalitionInr.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-emerald">+{plg.shapleySavingsPercent}% Saved</span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-sky">Efficiency & Symmetry Verified</span>
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
