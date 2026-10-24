import React, { useState, useId } from 'react';
import { useApp } from '../../context/AppContext';
import { CommodityType } from '../../types';
import { calculateProfitComparison } from '../../services/profitCalculator';
import {
  DollarSign,
  TrendingUp,
  Truck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Sliders,
  Scale,
  Thermometer,
} from 'lucide-react';

interface ProfitComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommodity?: CommodityType;
  initialQuantity?: number;
}

export const ProfitComparisonModal: React.FC<ProfitComparisonModalProps> = ({
  isOpen,
  onClose,
  initialCommodity,
  initialQuantity,
}) => {
  const { commodities, addPledge, currentRole } = useApp();

  const [commodity, setCommodity] = useState<CommodityType>(initialCommodity || 'Tomato (Hybrid)');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(initialQuantity || 45);
  const [distanceKm, setDistanceKm] = useState<number>(240); // e.g. Nashik to Mumbai / APMC Terminal

  // Match live Agmarknet modal price
  const commObj = commodities.find((c) => c.name === commodity) || commodities[0];
  const [pricePerQ, setPricePerQ] = useState<number>(commObj ? commObj.modalPrice : 2850);

  const cropSelectId = useId();
  const quantityInputId = useId();
  const quantityRangeId = useId();
  const distanceInputId = useId();
  const distanceRangeId = useId();
  const priceInputId = useId();

  if (!isOpen) return null;

  const result = calculateProfitComparison({
    commodity,
    quantityQuintals,
    distanceKm,
    modalPricePerQ: pricePerQ,
  });

  const handleApplyPledge = () => {
    addPledge({
      commodity,
      quantityQuintals,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(5, 9, 17, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '1050px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(12, 18, 32, 0.96)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.2)',
          borderRadius: '20px',
          padding: '30px',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 14px', borderRadius: '20px', marginBottom: '10px' }}>
            <Sparkles size={14} color="#34d399" />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
              TRANSPARENT ECONOMIC COMPARISON ENGINE
            </span>
          </div>
          <h2 style={{ fontSize: '1.9rem', color: '#f8fafc', marginBottom: '6px' }}>
            Why MandiFlow is More Profitable Than Selling Outside
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, maxWidth: '820px' }}>
            See exactly how hiring solo open trucks and selling through village middlemen cuts into your hard-earned money versus
            using <strong>MandiFlow Shared Cold-Chain Coalitions + e-NAM National AI Price Realization</strong>.
          </p>
        </div>

        {/* Interactive Sliders & Inputs Panel */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-glass-bright)',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '26px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700 }}>
            <Sliders size={16} />
            <span>Adjust Your Farm Produce & Logistics Parameters</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Commodity Selector */}
            <div>
              <label htmlFor={cropSelectId} style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
                Select Vegetable Crop
              </label>
              <select
                id={cropSelectId}
                value={commodity}
                onChange={(e) => {
                  const newComm = e.target.value as CommodityType;
                  setCommodity(newComm);
                  const found = commodities.find((c) => c.name === newComm);
                  if (found) setPricePerQ(found.modalPrice);
                }}
                className="input-field"
                style={{ width: '100%', padding: '9px', background: 'rgba(15, 23, 42, 0.9)', color: '#f8fafc', fontSize: '0.84rem' }}
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.name} style={{ background: '#0f172a' }}>
                    {c.name} (Modal: ₹{c.modalPrice}/Q)
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label htmlFor={quantityInputId} style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Harvest Quantity
                </label>
                <span className="mono-text" style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>
                  {quantityQuintals} Quintals ({(quantityQuintals * 100).toLocaleString()} kg)
                </span>
              </div>
              <input
                id={quantityRangeId}
                type="range"
                min="5"
                max="300"
                step="5"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                aria-label="Harvest quantity slider"
              />
              <input
                id={quantityInputId}
                type="number"
                min="1"
                max="1000"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', padding: '6px 10px', marginTop: '6px', fontSize: '0.82rem', textAlign: 'center' }}
              />
            </div>

            {/* Distance Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label htmlFor={distanceInputId} style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Distance to Mandi Market
                </label>
                <span className="mono-text" style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
                  {distanceKm} km
                </span>
              </div>
              <input
                id={distanceRangeId}
                type="range"
                min="20"
                max="900"
                step="10"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                aria-label="Distance to Mandi Market slider"
              />
              <input
                id={distanceInputId}
                type="number"
                min="10"
                max="2500"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', padding: '6px 10px', marginTop: '6px', fontSize: '0.82rem', textAlign: 'center' }}
              />
            </div>

            {/* Modal Price */}
            <div>
              <label htmlFor={priceInputId} style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '6px' }}>
                Benchmark Price (₹/Quintal)
              </label>
              <input
                id={priceInputId}
                type="number"
                min="500"
                max="15000"
                value={pricePerQ}
                onChange={(e) => setPricePerQ(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', padding: '9px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Live Agmarknet modal rate for {commodity}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Profit Delta Highlight Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(4, 120, 87, 0.28) 100%)',
            border: '1.5px solid #10b981',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <TrendingUp size={22} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a7f3d0' }}>
                YOUR EXTRA NET PROFIT WITH MANDIFLOW
              </span>
            </div>
            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              +₹{result.comparison.extraProfitInr.toLocaleString()}{' '}
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399' }}>
                (+{result.comparison.profitIncreasePercent}% More In-Hand Money!)
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', margin: '6px 0 0 0' }}>
              For <strong>{quantityQuintals} Quintals</strong> of <strong>{commodity}</strong> transported over <strong>{distanceKm} km</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                🚚 Transport Saved: ₹{result.comparison.freightSavedInr.toLocaleString()} (-{result.comparison.freightSavingsPercent}%)
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                ❄️ Spoilage Prevented: ₹{result.comparison.spoilageSavedInr.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                ⚖️ Weighing Gouging Avoided: ₹{result.comparison.weighingSavedInr.toLocaleString()}
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                🏛️ Brokerage Cut Saved: ₹{result.comparison.commissionSavedInr.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px', marginBottom: '26px' }}>
          {/* Card 1: Traditional Selling Route */}
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1.5px solid rgba(244, 63, 94, 0.35)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#fb7185" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                    Traditional Route (Selling Outside)
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#fb7185', fontWeight: 600 }}>
                    Solo Mini-Truck + Village Dalal + Non-Reefer Transit
                  </span>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gross Harvest Value:</span>
                  <span className="mono-text" style={{ color: '#ffffff', fontWeight: 600 }}>
                    ₹{result.traditional.grossRevenue.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                  <span>Solo Transport / Freight Charges:</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.traditional.freightCost.toLocaleString()} (₹{result.traditional.freightPerQ}/Q)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                  <span>Open Truck Heat & Decay Spoilage ({result.traditional.spoilagePercent}%):</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.traditional.spoilageLossInr.toLocaleString()} ({result.traditional.spoilageLossKg} kg lost)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                  <span>Unregulated Dalal / Broker Cut ({result.traditional.middlemanPercent}%):</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.traditional.middlemanCutInr.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185' }}>
                  <span>Manual Weighbridge Tare Gouging (4.0%):</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.traditional.weighingLossInr.toLocaleString()} ({result.traditional.weighingLossKg} kg cut)
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(244, 63, 94, 0.25)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Total Middleman & Logistics Cut:</span>
                  <span className="mono-text" style={{ color: '#fb7185', fontWeight: 700 }}>
                    -₹{result.traditional.totalDeductions.toLocaleString()} ({Math.round((result.traditional.totalDeductions / result.traditional.grossRevenue) * 100)}% of value!)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Net In Hand */}
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: 700 }}>
                Traditional Take-Home Cash In Hand
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fb7185', margin: '4px 0' }}>
                ₹{result.traditional.netFarmerInHand.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Effective realization: <strong>₹{result.traditional.effectivePricePerQ}/Q</strong>
              </div>
            </div>
          </div>

          {/* Card 2: MandiFlow Smart App Route */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.15)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#34d399" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                    MandiFlow Smart App Route
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700 }}>
                    Shapley Shared Reefer + Near-Zero Spoilage + e-NAM National Floor
                  </span>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gross Harvest Value:</span>
                  <span className="mono-text" style={{ color: '#ffffff', fontWeight: 600 }}>
                    ₹{result.mandiFlow.grossRevenue.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Shapley Shared Reefer Freight:</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.mandiFlow.freightCost.toLocaleString()} (₹{result.mandiFlow.freightPerQ}/Q)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Cold-Chain Reefer Spoilage (&lt;1.2%):</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.mandiFlow.spoilageLossInr.toLocaleString()} ({result.mandiFlow.spoilageLossKg} kg)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Statutory Mandi Cess Only (2.5%):</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    -₹{result.mandiFlow.statutoryCessInr.toLocaleString()} (Zero Hidden Cuts)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Certified Digital Weighbridge Loss:</span>
                  <span className="mono-text" style={{ fontWeight: 600 }}>
                    ₹0 (100% Calibrated Precision)
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.3)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Total Transparent App Fees:</span>
                  <span className="mono-text" style={{ color: '#34d399', fontWeight: 700 }}>
                    -₹{result.mandiFlow.totalDeductions.toLocaleString()} (Only {Math.round((result.mandiFlow.totalDeductions / result.mandiFlow.grossRevenue) * 100)}% of value!)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Net In Hand */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(4, 120, 87, 0.2))',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 800 }}>
                MandiFlow Verified Cash In Farmer Account
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#34d399', margin: '4px 0' }}>
                ₹{result.mandiFlow.netFarmerInHand.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Effective realization: <strong style={{ color: '#34d399' }}>₹{result.mandiFlow.effectivePricePerQ}/Q</strong> (+₹{result.mandiFlow.effectivePricePerQ - result.traditional.effectivePricePerQ}/Q higher!)
              </div>
            </div>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '580px' }}>
            * Economic comparison modeled on real-world APMC agricultural survey data: traditional Tata Ace solo transit vs 16T FPO cooperative reefer logistics, verified by Directorate of Marketing & Inspection.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              Close Calculator
            </button>
            {currentRole === 'farmer' && (
              <button onClick={handleApplyPledge} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.92rem', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Pledge {quantityQuintals} Q on MandiFlow Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
