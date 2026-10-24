import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Landmark,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileText,
  DollarSign,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const MandiDashboard: React.FC = () => {
  const {
    gateWeighments,
    commitWeighment,
    commissionRate,
    mandiCess,
    userSession,
  } = useApp();

  const [selectedPassId, setSelectedPassId] = useState<string>(gateWeighments[0]?.gatePassId || '');
  const [grossInput, setGrossInput] = useState<number>(17420);
  const [tareInput, setTareInput] = useState<number>(6240);

  const activeGate = gateWeighments.find((g) => g.gatePassId === selectedPassId) || gateWeighments[0];

  const calculatedNet = grossInput - tareInput;
  const discrepancyKg = calculatedNet - (activeGate?.expectedWeightKg || 11200);
  const discrepancyPct = Math.round((discrepancyKg / (activeGate?.expectedWeightKg || 11200)) * 10000) / 100;
  const isTolerancePass = Math.abs(discrepancyPct) <= 2.0;

  // Commercial Settlement breakdown:
  // Assumes average modal price ₹2,850/Q = ₹28.5/kg
  const grossLotValue = calculatedNet * 28.5;
  const arhatiyaFee = grossLotValue * (commissionRate / 100);
  const cessFee = grossLotValue * (mandiCess / 100);
  const netFarmerTransfer = grossLotValue - arhatiyaFee - cessFee;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeGate) {
      commitWeighment(activeGate.gatePassId, grossInput, tareInput);
    }
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
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid #f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Landmark size={20} color="#f43f5e" />
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#f8fafc' }}>
              Mandi Dashboard <span style={{ color: '#f43f5e' }}>(APMC Yard & Digital Weighbridge)</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Mandi Yard: <strong>Azadpur APMC Fruit & Vegetable Yard, Delhi</strong> | Weighbridge: <strong>Bay #04 Digital Scale</strong> | Model APMC Act Compliant
          </p>
        </div>
      </div>

      {/* 4 Inbound Operational Cards */}
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
              Inbound Gate Passes
            </span>
            <Truck size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            {gateWeighments.length} Trucks <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#34d399' }}>(In Yard)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            HMAC cryptographic gate tokens validated
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Discrepancy Threshold
            </span>
            <Scale size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
            ±2.0% <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dim)' }}>Tolerance</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Automated moisture loss calibration for perishable freight
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Arhatiya Commission
            </span>
            <DollarSign size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
            {commissionRate}% <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dim)' }}>(APMC Ceiling)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Licensed commission agent legal escrow fee
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              State Mandi Cess
            </span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
            {mandiCess}% <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-dim)' }}>(Statutory)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Agricultural marketing development statutory fund
          </div>
        </div>
      </div>

      {/* Main Weighbridge Scale Terminal & Commercial Ledger */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Terminal: Digital Weighbridge Console */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={20} color="#f43f5e" />
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Digital Weighbridge Terminal</h3>
            </div>
            <span className="badge badge-rose">Bay #4 Live Scale</span>
          </div>

          {/* Select Gate Pass */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Active Gate Pass Ticket
            </label>
            <select
              value={selectedPassId}
              onChange={(e) => {
                setSelectedPassId(e.target.value);
                const g = gateWeighments.find((gw) => gw.gatePassId === e.target.value);
                if (g) {
                  setGrossInput(g.grossWeightKg);
                  setTareInput(g.tareWeightKg);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass-bright)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {gateWeighments.map((gw) => (
                <option key={gw.gatePassId} value={gw.gatePassId} style={{ background: '#0f172a' }}>
                  {gw.gatePassId} — {gw.vehicleNumber} ({gw.commodity})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCommit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Gross Loaded Weight (kg)
                </label>
                <input
                  type="number"
                  value={grossInput}
                  onChange={(e) => setGrossInput(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass-bright)',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Tare Empty Weight (kg)
                </label>
                <input
                  type="number"
                  value={tareInput}
                  onChange={(e) => setTareInput(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass-bright)',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            {/* Computed Net Weight Big Meter */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Certified Net Cargo Weight
              </div>
              <div className="mono-text" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {calculatedNet.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Expected Dispatch Weight: <span className="mono-text">{activeGate?.expectedWeightKg.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Discrepancy & Tolerance Card */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: isTolerancePass ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.1)',
                border: `1px solid ${isTolerancePass ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isTolerancePass ? (
                  <CheckCircle2 size={18} color="#34d399" />
                ) : (
                  <AlertTriangle size={18} color="#fb7185" />
                )}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                    {isTolerancePass ? 'Tolerance Check Passed' : 'Weight Discrepancy Flagged!'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Variance: <strong className="mono-text">{discrepancyKg > 0 ? `+${discrepancyKg}` : discrepancyKg} kg ({discrepancyPct}%)</strong>
                  </div>
                </div>
              </div>

              <span className={`badge ${isTolerancePass ? 'badge-emerald' : 'badge-rose'}`}>
                {isTolerancePass ? 'Within ±2.0%' : 'Audit Required'}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '0.92rem' }}
            >
              <FileText size={18} />
              <span>Commit & Stamp APMC Weighbridge Ticket</span>
            </button>
          </form>
        </div>

        {/* Commercial Arhatiya & Mandi Settlement Ledger */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <DollarSign size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              APMC Commercial & Commission Ledger
            </h3>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            Statutory breakdown according to the state APMC Model Act. Transparent accounting ensures zero illicit deductions from farmers.
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Gross Auction Lot Value (Estimated):</span>
              <span className="mono-text" style={{ color: '#ffffff', fontWeight: 600 }}>
                ₹{Math.round(grossLotValue).toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Arhatiya Commission ({commissionRate}% to {activeGate?.arhatiyaName}):
              </span>
              <span className="mono-text" style={{ color: '#fbbf24' }}>
                -₹{Math.round(arhatiyaFee).toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mandi Marketing Cess ({mandiCess}%):</span>
              <span className="mono-text" style={{ color: '#fb7185' }}>
                -₹{Math.round(cessFee).toLocaleString()}
              </span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-glass-bright)',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1rem',
                fontWeight: 800,
              }}
            >
              <span style={{ color: '#34d399' }}>Net Direct Payout to Farmer/FPO:</span>
              <span className="mono-text" style={{ color: '#34d399' }}>
                ₹{Math.round(netFarmerTransfer).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Arhatiya Shop Identity Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Assigned APMC Commission Agency
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
              {activeGate?.arhatiyaName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              License: <strong>APMC-AZD-LIC-901</strong> | Fastag RFID Gate-In: <strong>{activeGate?.entryTimestamp}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
