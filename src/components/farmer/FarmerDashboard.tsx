import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommodityType, FarmerPledge } from '../../types';
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  Percent,
  Clock,
  Thermometer,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  Sliders,
  Truck,
  Scale,
  XCircle,
  Check,
  Smartphone,
  Bell,
  CheckCheck,
  MapPin,
  Navigation,
  CloudSun,
  History,
  FileText,
  Download,
  Star,
  PiggyBank,
  Landmark,
} from 'lucide-react';
import { calculateProfitComparison } from '../../services/profitCalculator';
import { FlipkartDeliveryTracker } from '../common/FlipkartDeliveryTracker';

export const FarmerDashboard: React.FC = () => {
  const {
    pledges,
    addPledge,
    markPledgeReadyToSell,
    commodities,
    userSession,
    setIsProfitModalOpen,
    weatherData,
    setIsWeatherModalOpen,
    detectDeviceLocationAndWeather,
    isLoadingWeather,
    userOrderHistory,
    setIsOrderHistoryModalOpen,
    setIsDeliveryTrackerModalOpen,
    setIsDatasetModalOpen,
    datasetRunResult,
  } = useApp();

  // New Pledge Form State
  const [commodity, setCommodity] = useState<CommodityType>('Tomato (Hybrid)');
  const [farmerName, setFarmerName] = useState<string>('Rameshwar Patil');
  const [farmerPhone, setFarmerPhone] = useState<string>(userSession?.phone || '+91 98231 44021');
  const [village, setVillage] = useState<string>('Pimpalgaon Baswant');
  const [quantityQ, setQuantityQ] = useState<number>(45);
  const [isReadyToSellNow, setIsReadyToSellNow] = useState<boolean>(true);
  const [trackingModalPledge, setTrackingModalPledge] = useState<FarmerPledge | null>(null);

  // Spoilage Slider
  const [simulatedTemp, setSimulatedTemp] = useState<number>(18);

  const selectedCommObj = commodities.find((c) => c.name === commodity) || commodities[0];

  // Dynamic calculations
  const soloFreightPerQ = 160;
  const coalitionFreightPerQ = 98;
  const totalSoloFreight = quantityQ * soloFreightPerQ;
  const totalCoalitionFreight = quantityQ * coalitionFreightPerQ;
  const shapleySavings = totalSoloFreight - totalCoalitionFreight;
  const shapleyPercent = Math.round((shapleySavings / totalSoloFreight) * 1000) / 10;

  // Realization deductions:
  // Gross = Modal * Q
  // Deduct: Freight (coalition) + APMC Comm (6%) + APMC Cess (1.5%) + Platform fee (1.5%) = 9% + Freight
  const grossValue = selectedCommObj.modalPrice * quantityQ;
  const statutoryDeductions = grossValue * 0.09;
  const netRealizationTotal = grossValue - totalCoalitionFreight - statutoryDeductions;
  const netRealizationPerQ = Math.round(netRealizationTotal / quantityQ);

  const isMspSafe = netRealizationPerQ >= selectedCommObj.msp;

  const liveComparison = calculateProfitComparison({
    commodity,
    quantityQuintals: quantityQ,
    distanceKm: 240, // Nashik to Mumbai/Vashi
    modalPricePerQ: selectedCommObj.modalPrice,
  });

  // SLI Arrhenius Calculation: SLI(t) = exp(-k * t), k increases with temp
  const q10 = 2.2;
  const decayRate = 0.005 * Math.pow(q10, (simulatedTemp - selectedCommObj.tempOptimalC) / 10);
  const remainingHours = Math.max(12, Math.round(selectedCommObj.baseShelfLifeHours / (1 + decayRate * 10)));
  const sliPercent = Math.max(25, Math.min(100, Math.round((remainingHours / selectedCommObj.baseShelfLifeHours) * 100)));

  // Safe fallback descriptors for Bank Settlement and Savings Analytics
  const bank = userOrderHistory?.bankAccount || {
    bankName: 'State Bank of India',
    accountNumberMasked: '•••• •••• •••• 4402',
    ifscCode: 'SBIN0001428',
    branchName: 'Pimpalgaon Baswant Agri Branch',
    accountHolderName: 'Rameshwar B. Patil',
    accountType: 'Kisan Credit Account (KCC)',
    dbtVerificationStatus: 'VERIFIED_ACTIVE',
    totalCreditedInr: 410350,
    escrowPendingInr: 106700,
    lastCreditDate: '15 Oct 2026',
    lastCreditAmountInr: 101650,
    lastUtrNumber: 'UTR-SBIN-20261015-88319',
  };

  const savings = userOrderHistory?.savingsBreakdown || {
    freightSavedInr: 10420,
    commissionSavedInr: 18077,
    spoilagePreventedInr: 11600,
    weighingLossPreventedInr: 4200,
    totalProfitBoostInr: 44297,
    percentageProfitBoost: 22.8,
  };

  const totalCumulativeSavings = userOrderHistory?.totalCumulativeSavingsInr ?? 28497;
  const totalOrdersCount = userOrderHistory?.totalOrdersCount ?? 4;

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPledge({
      farmerName,
      farmerPhone,
      locationVillage: village,
      commodity,
      quantityQuintals: quantityQ,
      expectedRealizationPerQ: netRealizationPerQ,
      isReadyToSell: isReadyToSellNow,
      status: isReadyToSellNow ? 'READY_TO_SELL' : 'PLEDGED',
    });
  };

  const getLifecycleBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="badge badge-indigo">Draft</span>;
      case 'PLEDGED':
        return <span className="badge badge-sky">Reported Lot</span>;
      case 'READY_TO_SELL':
        return (
          <span
            className="badge"
            style={{
              background: 'rgba(16, 185, 129, 0.22)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.55)',
              fontWeight: 700,
            }}
          >
            🟢 Ready to Sell (SMS Sent)
          </span>
        );
      case 'MATCHED':
        return <span className="badge badge-saffron">Matched</span>;
      case 'ALLOCATED':
        return <span className="badge badge-emerald">Coalition Allocated</span>;
      case 'IN_TRANSIT':
        return <span className="badge badge-sky">In Transit</span>;
      case 'DELIVERED':
        return <span className="badge badge-emerald">Delivered Mandi</span>;
      case 'WEIGHED_APMC':
        return <span className="badge badge-saffron">Weighed APMC</span>;
      case 'AUCTIONED_SOLD':
        return <span className="badge badge-emerald">Sold at Auction</span>;
      case 'SETTLED':
        return <span className="badge badge-emerald">Settled & Escrow Paid</span>;
      default:
        return <span className="badge badge-indigo">{status}</span>;
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
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sprout size={20} color="#34d399" />
            </div>
            <h1 style={{ fontSize: '1.9rem', color: '#f8fafc' }}>
              Farmer Dashboard <span style={{ color: '#10b981' }}>(Krishi Seva & Pledge Portal)</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Active Farmer: <strong>{userSession?.name || 'Rameshwar Patil'}</strong> |{' '}
            Current Location:{' '}
            <strong style={{ color: '#38bdf8' }}>
              {weatherData?.isDeviceLocation ? '📍 ' : ''}
              {weatherData?.location || 'Detecting Current Location...'}
            </strong>{' '}
            | Mandi: <strong>Azadpur / Vashi Express Route</strong>
          </p>
        </div>

        {/* Profitability Comparator Trigger Button */}
        <button
          onClick={() => setIsProfitModalOpen(true)}
          className="btn btn-primary"
          style={{
            padding: '11px 22px',
            fontSize: '0.9rem',
            gap: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          <TrendingUp size={18} />
          <span>💰 Compare Profit: Selling Outside vs MandiFlow</span>
        </button>
      </div>

      {/* Live Auto-Detected Weather & Spoilage Alert Banner */}
      {weatherData && (
        <div
          style={{
            marginBottom: '22px',
            padding: '14px 20px',
            borderRadius: '16px',
            background:
              weatherData.notificationSeverity === 'ALERT'
                ? 'linear-gradient(90deg, rgba(244, 63, 94, 0.16), rgba(15, 23, 42, 0.95))'
                : weatherData.notificationSeverity === 'WARNING'
                ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.16), rgba(15, 23, 42, 0.95))'
                : 'linear-gradient(90deg, rgba(56, 189, 248, 0.14), rgba(15, 23, 42, 0.95))',
            border: `1px solid ${
              weatherData.notificationSeverity === 'ALERT'
                ? 'rgba(244, 63, 94, 0.35)'
                : weatherData.notificationSeverity === 'WARNING'
                ? 'rgba(245, 158, 11, 0.35)'
                : 'rgba(56, 189, 248, 0.35)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudSun size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                {weatherData.weatherNotification}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                📍 {weatherData.location} • {weatherData.temperatureC}°C • {weatherData.humidityPercent}% RH • Auto-Detected via {weatherData.source === 'OPENWEATHER_API' ? 'OpenWeatherMap API Key' : 'Open-Meteo Satellite Feed'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '6px 12px',
                borderRadius: '10px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#a7f3d0', fontWeight: 600 }}>PRODUCT SAFE FOR</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>
                {weatherData.freshness.safeHoursRemaining} Hours
              </div>
            </div>

            <button
              onClick={() => detectDeviceLocationAndWeather(true)}
              disabled={isLoadingWeather}
              className="btn btn-primary"
              style={{
                padding: '8px 14px',
                fontSize: '0.78rem',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                gap: '6px',
                fontWeight: 700,
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
              }}
              title="Detect current device location and check local weather and produce safety window"
            >
              <MapPin size={14} />
              <span>{isLoadingWeather ? 'Detecting Location...' : 'Detect Device Location'}</span>
            </button>

            <button
              onClick={() => setIsWeatherModalOpen(true)}
              className="btn btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '0.78rem',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                gap: '6px',
                fontWeight: 700,
              }}
            >
              <CloudSun size={14} />
              <span>Weather & API Key</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 SELLER FINANCIAL SUMMARY: SAVINGS (VS OUTSIDE SELLING) & BANK CREDITS */}
      {/* ========================================================================= */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing Top Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 50%, #fbbf24 100%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                SELLER REALIZATION & BANK SETTLEMENT COCKPIT
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Designated Account: <strong style={{ color: '#f8fafc' }}>{bank.bankName}</strong> ({bank.accountNumberMasked})
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Money Saved vs Selling Outside & Live Bank Credits
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px' }}>
              Direct verified comparison of earnings on MandiFlow vs traditional local market middlemen and transport.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsProfitModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <TrendingUp size={14} />
              <span>Full Cost Comparison</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOrderHistoryModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.35))',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                color: '#34d399',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FileText size={14} />
              <span>Bank Passbook & Invoices</span>
            </button>
          </div>
        </div>

        {/* The Two Main Hero Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px',
          }}
        >
          {/* ======================================================== */}
          {/* HERO CARD 1: HOW MUCH MONEY SAVED VS SELLING OUTSIDE     */}
          {/* ======================================================== */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.3) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.45)',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PiggyBank size={18} color="#34d399" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                      MONEY SAVED USING MANDIFLOW
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                      Compared to selling manually at outside market
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(16, 185, 129, 0.25)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontWeight: 800,
                  }}
                >
                  +{savings.percentageProfitBoost}% PROFIT BOOST
                </span>
              </div>

              {/* Big Saved Amount */}
              <div style={{ margin: '14px 0 6px 0' }}>
                <div style={{ fontSize: '2.3rem', fontWeight: 900, color: '#34d399', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  ₹{totalCumulativeSavings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '4px', fontWeight: 600 }}>
                  Direct Net Money Saved Across {totalOrdersCount} Completed Sales
                </div>
              </div>

              {/* 4 Detailed Comparison Breakdown Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>🚚 Transport Freight Saved</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                    +₹{savings.freightSavedInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>Shared Reefer vs Solo Truck</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>🤝 Brokerage / Commission</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                    +₹{savings.commissionSavedInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>1.5% e-NAM vs 6.0% Outside</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>❄️ Spoilage Loss Prevented</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                    +₹{savings.spoilagePreventedInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>0% Rot in Reefer vs 15% Heat</div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>⚖️ Weighbridge Protection</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>
                    +₹{savings.weighingLossPreventedInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b' }}>Zero Tamper Certified Net</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.25)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                Total Extra In-Pocket Value: <strong style={{ color: '#ffffff' }}>₹{savings.totalProfitBoostInr.toLocaleString()}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsProfitModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#34d399',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Compare Calculator</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* HERO CARD 2: HOW MUCH CREDITED TO BANK ACCOUNT VIA DBT   */}
          {/* ======================================================== */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '14px',
              padding: '22px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Landmark size={18} color="#38bdf8" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#7dd3fc', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                      DIRECT BENEFIT TRANSFER (DBT) SETTLEMENT
                    </span>
                    <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                      Exact money already credited directly to your bank account
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>DBT ACTIVE</span>
                </span>
              </div>

              {/* Big Bank Credited Amount */}
              <div style={{ margin: '14px 0 6px 0' }}>
                <div style={{ fontSize: '2.3rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  ₹{bank.totalCreditedInr.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Already Credited in Bank Account</span>
                  <span style={{ color: '#475569' }}>•</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                    +₹{bank.escrowPendingInr.toLocaleString()} Escrow Pending
                  </span>
                </div>
              </div>

              {/* Verified Bank Account Details Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginTop: '16px',
                  fontSize: '0.76rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Designated Bank:</span>
                  <strong style={{ color: '#ffffff' }}>{bank.bankName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Account Number:</span>
                  <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{bank.accountNumberMasked}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>IFSC & Branch:</span>
                  <span style={{ color: '#cbd5e1' }}>{bank.ifscCode} ({bank.branchName})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8' }}>Account Holder:</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{bank.accountHolderName}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.25)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Latest Credit: <strong style={{ color: '#34d399' }}>₹{bank.lastCreditAmountInr.toLocaleString()}</strong> ({bank.lastCreditDate})
              </span>
              <button
                type="button"
                onClick={() => setIsOrderHistoryModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View Bank Passbook</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Highlight Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Modal Price Discovery */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Agmarknet Modal Price
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setIsDatasetModalOpen(true)}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  borderRadius: '6px',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="View Agmarknet Dataset Run Accuracy Percentage"
              >
                <span>⚡ {datasetRunResult?.accuracyPercentage || 94.8}% Accuracy</span>
              </button>
              <TrendingUp size={18} color="#34d399" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            ₹{selectedCommObj.modalPrice.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dim)' }}>/ Quintal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">+{selectedCommObj.dailyChange}% Today</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Range: ₹{selectedCommObj.minPrice} - ₹{selectedCommObj.maxPrice}
            </span>
          </div>
        </div>

        {/* Card 2: Net Realization & MSP Guard */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Expected Net Realization
            </span>
            <ShieldCheck size={18} color={isMspSafe ? '#34d399' : '#fb7185'} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
            ₹{netRealizationPerQ.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dim)' }}>/ Quintal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isMspSafe ? (
              <span className="badge badge-emerald">
                <CheckCircle2 size={12} /> MSP Protected (+₹{netRealizationPerQ - selectedCommObj.msp}/Q)
              </span>
            ) : (
              <span className="badge badge-rose">
                <AlertCircle size={12} /> Below MSP Floor
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>CACP MSP: ₹{selectedCommObj.msp}</span>
          </div>
        </div>

        {/* Card 3: Shapley Freight Savings */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Shapley Pooled Freight
            </span>
            <Percent size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
            +{shapleyPercent}% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1' }}>Direct Savings</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Solo Freight: <span className="mono-text" style={{ textDecoration: 'line-through' }}>₹{totalSoloFreight.toLocaleString()}</span> → Pooled: <strong className="mono-text" style={{ color: '#34d399' }}>₹{totalCoalitionFreight.toLocaleString()}</strong>
          </div>
        </div>

        {/* Card 4: Shelf Life Index (SLI) & Live Weather Guard */}
        <div
          className="glass-panel"
          style={{ padding: '20px', cursor: 'pointer' }}
          onClick={() => setIsWeatherModalOpen(true)}
          title="Click to view live weather telemetry & safe hours kinetics"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Freshness & Weather Guard
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudSun size={16} color="#38bdf8" />
              <Thermometer size={16} color={weatherData ? '#34d399' : '#fbbf24'} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
            {weatherData ? `${weatherData.freshness.freshnessPercent}% Fresh` : `${sliPercent}% Fresh`}{' '}
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8' }}>
              ({weatherData ? weatherData.freshness.safeHoursRemaining : remainingHours}h Safe)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Ambient: <strong style={{ color: '#f8fafc' }}>{weatherData ? `${weatherData.temperatureC}°C` : `${simulatedTemp}°C`}</strong> ({weatherData?.location.split(',')[0] || 'Nashik'})</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Configure API Key →</span>
          </div>
        </div>
      </div>

      {/* Embedded Live Profit & Cost Comparison Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Direct Economic Proof
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Why Sell on MandiFlow vs Outside Market?
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
              Live cost breakdown for your current lot of <strong style={{ color: '#38bdf8' }}>{quantityQ} Quintals</strong> of <strong style={{ color: '#34d399' }}>{commodity}</strong> over ~240 km transport.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsProfitModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(16, 185, 129, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Sliders size={16} />
            Adjust Custom Values & Sliders
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '22px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: '4px' }}>
              Extra Cash In Your Pocket
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399' }}>
              +₹{liveComparison.comparison.extraProfitInr.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>
              +{liveComparison.comparison.profitIncreasePercent}% more profit per harvest
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', marginBottom: '4px' }}>
              Transport & Freight Saved
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8' }}>
              ₹{liveComparison.comparison.freightSavedInr.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#bae6fd' }}>
              Shapley pooled reefer vs solo mini-truck
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fde68a', textTransform: 'uppercase', marginBottom: '4px' }}>
              Spoilage & Weighing Saved
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fbbf24' }}>
              ₹{(liveComparison.comparison.spoilageSavedInr + liveComparison.comparison.weighingSavedInr).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fef08a' }}>
              Active cold chain + IoT certified scales
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '18px',
          }}
        >
          {/* Traditional Route Outside */}
          <div
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} color="#ef4444" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#fca5a5', fontWeight: 700 }}>
                  Traditional Selling Outside
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Solo Transport & Middlemen
              </span>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Net Cash in Hand:</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f87171' }}>
                ₹{liveComparison.traditional.netFarmerInHand.toLocaleString()}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginLeft: '6px' }}>
                  (₹{liveComparison.traditional.effectivePricePerQ}/Q effective)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="#f87171" /> Solo Mini-Truck Freight (Bolero/Ace):
                </span>
                <span style={{ color: '#fca5a5', fontWeight: 700 }}>-₹{liveComparison.traditional.freightCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} color="#f87171" /> Transit Spoilage & Heat Rotting:
                </span>
                <span style={{ color: '#fca5a5', fontWeight: 700 }}>
                  -₹{liveComparison.traditional.spoilageLossInr.toLocaleString()} ({(liveComparison.traditional.spoilageLossKg / 100).toFixed(1)} Q)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={14} color="#f87171" /> Unregulated Dalal / Agent Cut (~9.5%):
                </span>
                <span style={{ color: '#fca5a5', fontWeight: 700 }}>-₹{liveComparison.traditional.middlemanCutInr.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={14} color="#f87171" /> Weighbridge Discrepancy & Deduction:
                </span>
                <span style={{ color: '#fca5a5', fontWeight: 700 }}>-₹{liveComparison.traditional.weighingLossInr.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#94a3b8' }}>Total Money Sunk Outside:</span>
                <span style={{ color: '#ef4444' }}>-₹{liveComparison.traditional.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* MandiFlow Smart App Route */}
          <div
            style={{
              padding: '18px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#6ee7b7', fontWeight: 700 }}>
                  MandiFlow Smart App Route
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                e-NAM + Shared Reefer
              </span>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Net Cash in Hand:</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34d399' }}>
                ₹{liveComparison.mandiFlow.netFarmerInHand.toLocaleString()}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6ee7b7', marginLeft: '6px' }}>
                  (₹{liveComparison.mandiFlow.effectivePricePerQ}/Q effective)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={14} color="#34d399" /> Shapley Pooled Reefer Transport:
                </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>-₹{liveComparison.mandiFlow.freightCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#34d399" /> Cold-Chain Spoilage Protection (&lt;1.2%):
                </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>
                  -₹{liveComparison.mandiFlow.spoilageLossInr.toLocaleString()} ({(liveComparison.mandiFlow.spoilageLossKg / 100).toFixed(1)} Q)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#34d399" /> Statutory APMC Mandi Cess Only (2.5%):
                </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>-₹{liveComparison.mandiFlow.statutoryCessInr.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={14} color="#34d399" /> IoT Certified Smart Weighbridge:
                </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>₹0 Loss (100% Verified)</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#94a3b8' }}>Total MandiFlow Deductions:</span>
                <span style={{ color: '#34d399' }}>-₹{liveComparison.mandiFlow.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '18px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.84rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span>
            <span>
              <strong>Summary:</strong> By using MandiFlow instead of selling outside, you keep an extra{' '}
              <strong style={{ color: '#34d399' }}>₹{liveComparison.comparison.extraProfitInr.toLocaleString()}</strong> in your pocket on this lot alone.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsProfitModalOpen(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#059669',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Detailed Interactive Simulator →
          </button>
        </div>
      </div>

      {/* Main Grid: Pledge Form & Spoilage Simulator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Quick Harvest Pledge Form */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <PlusCircle size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Pledge Fresh Harvest Lot</h3>
          </div>

          <form onSubmit={handlePledgeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Village / Hub
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
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
            </div>

            {/* Kisan Mobile Phone for SMS Alert */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>
                  Kisan Mobile Phone (Instant SMS Alert Delivered Here)
                </label>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>
                  📱 SMS Enabled (Fast2SMS / Twilio)
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+91 98231 44021"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass-bright)',
                    color: '#38bdf8',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                />
                <Smartphone size={17} color="#38bdf8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Vegetable Produce (10 Varieties)
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                    100% Fresh Vegetables
                  </span>
                </div>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value as CommodityType)}
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
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.name} style={{ background: '#0f172a' }}>
                      {c.name} — {c.variety} (Modal: ₹{c.modalPrice}/Q)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Quantity (Quintals)
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={quantityQ}
                  onChange={(e) => setQuantityQ(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass-bright)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>
            </div>

            {/* Financial Preview Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gross Agmarknet Realization:</span>
                <span className="mono-text" style={{ color: '#ffffff', fontWeight: 600 }}>
                  ₹{grossValue.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>MandiFlow Pooled Freight:</span>
                <span className="mono-text" style={{ color: '#34d399', fontWeight: 600 }}>
                  -₹{totalCoalitionFreight.toLocaleString()} (Saved ₹{shapleySavings.toLocaleString()})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>APMC Cess & Statutory Fees (9%):</span>
                <span className="mono-text" style={{ color: '#fb7185' }}>
                  -₹{Math.round(statutoryDeductions).toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-glass-bright)',
                  paddingTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ color: '#a7f3d0' }}>Estimated In-Hand Farmer Payout:</span>
                <span className="mono-text" style={{ color: '#34d399' }}>
                  ₹{Math.round(netRealizationTotal).toLocaleString()} (₹{netRealizationPerQ}/Q)
                </span>
              </div>
            </div>

            {/* Ready to Sell SMS Alert Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: isReadyToSellNow ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isReadyToSellNow ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setIsReadyToSellNow(!isReadyToSellNow)}
            >
              <input
                type="checkbox"
                checked={isReadyToSellNow}
                onChange={(e) => setIsReadyToSellNow(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isReadyToSellNow ? '#34d399' : '#cbd5e1' }}>
                  Produce is Ready to Sell Immediately (Send Kisan SMS Notification)
                </div>
                <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                  Dispatches real-time SMS to <strong style={{ color: '#38bdf8' }}>{farmerPhone}</strong> with e-NAM expected clearing price & collection truck arrival.
                </div>
              </div>
              <Bell size={20} color={isReadyToSellNow ? '#34d399' : '#64748b'} />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                marginTop: '4px',
                background: isReadyToSellNow ? 'linear-gradient(135deg, #059669, #10b981)' : undefined,
                boxShadow: isReadyToSellNow ? '0 4px 15px rgba(16, 185, 129, 0.35)' : undefined,
              }}
            >
              <CheckCircle2 size={18} />
              <span>
                {isReadyToSellNow
                  ? 'Confirm Produce Ready to Sell & Dispatch SMS 📱'
                  : 'Report Advance Harvest Produce with FPO Coalition'}
              </span>
            </button>
          </form>
        </div>

        {/* Spoilage & Arrhenius Decay Kinetics Simulator */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Thermometer size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
              Perishable Arrhenius Decay Kinetics
            </h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
            {"Mathematical Arrhenius equation: k(T) = k₀ × Q₁₀^((T - T_base)/10)."}
            {" "}Test how ambient transit temperatures degrade the Shelf-Life Index (SLI) of <strong>{commodity}</strong>.
          </p>

          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
                Simulate Ambient Temperature
              </span>
              <span className="mono-text" style={{ fontSize: '0.9rem', color: simulatedTemp > 24 ? '#fb7185' : '#34d399', fontWeight: 700 }}>
                {simulatedTemp}°C
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="38"
              value={simulatedTemp}
              onChange={(e) => setSimulatedTemp(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: simulatedTemp > 24 ? '#f43f5e' : '#10b981',
                height: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>8°C (Cold Reefer)</span>
              <span>18°C (Mild)</span>
              <span>28°C (Warm)</span>
              <span>38°C (Heatwave)</span>
            </div>
          </div>

          {/* Dynamic Decay Visualizer */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: simulatedTemp > 26 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.08)',
              border: `1px solid ${simulatedTemp > 26 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              marginBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Current Shelf-Life Health
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}>
                {remainingHours} Hours Safe Window
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: `${sliPercent}%`,
                  height: '100%',
                  background:
                    sliPercent > 70
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : sliPercent > 40
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #f43f5e, #fb7185)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
              {simulatedTemp > 26
                ? '⚠️ Critical Alert: High heat accelerates respiration rate. MandiFlow auto-reroutes cargo to the nearest APMC Mandi if SLI drops below 70%.'
                : '✅ Safe Transit Zone: Respiration remains suppressed. Cargo suitable for long-haul interstate cold chain dispatch.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            <Info size={14} color="#38bdf8" />
            <span>Ethylene classification for {commodity}: <strong>{selectedCommObj.ethyleneType}</strong></span>
          </div>
        </div>
      </div>

      {/* Flipkart Style Live Consignment & Dispatch Tracker */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
              }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Live Consignment Delivery Tracker (Flipkart Order Mode)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Real-time GPS • Origin to Mandi Corridor • Cold Chain Monitored
          </span>
        </div>

        <FlipkartDeliveryTracker isModal={false} />
      </div>

      {/* ========================================================================= */}
      {/* 🌟 FLIPKART-STYLE ORDER & SALES HISTORY STATEMENT (4 SALES RESTORED) */}
      {/* ========================================================================= */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={18} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                My Sales & Order History Statement (Flipkart Orders)
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Restored history of {userOrderHistory.totalOrdersCount} sales on MandiFlow • Total Realized: <strong style={{ color: '#38bdf8' }}>₹{userOrderHistory.totalSalesInr.toLocaleString()}</strong> • Saved: <strong style={{ color: '#34d399' }}>+₹{userOrderHistory.totalCumulativeSavingsInr.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderHistoryModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FileText size={14} />
            <span>View Full Statement & Invoices</span>
          </button>
        </div>

        {/* 4 Restored Orders Grid (Flipkart Style Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {userOrderHistory.orders.map((order) => {
            const isInTransit = order.status === 'IN_TRANSIT';

            return (
              <div
                key={order.orderId}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: isInTransit
                    ? '1px solid rgba(56, 189, 248, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow Edge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: isInTransit ? '#38bdf8' : '#10b981',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                        {order.orderId}
                      </span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                        {order.commodity}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                        {order.variety} • {order.quantityQuintals} Quintals ({order.quantityBags} Bags)
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: isInTransit ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isInTransit ? '#38bdf8' : '#34d399',
                        border: `1px solid ${isInTransit ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        fontWeight: 700,
                      }}
                    >
                      {isInTransit ? 'In Transit' : 'Delivered & Paid'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    🏁 {order.destinationMandi} • {order.truckRegistration}
                  </div>

                  <div style={{ marginTop: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span style={{ color: '#94a3b8' }}>Net Realization:</span>
                      <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>₹{order.netRealizationInr.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginTop: '3px' }}>
                      <span style={{ color: '#64748b' }}>Profit Saved vs Solo:</span>
                      <strong style={{ color: '#38bdf8' }}>+₹{order.totalSavedInr.toLocaleString()}</strong>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '4px' }}>
                      DBT: <span style={{ color: '#cbd5e1' }}>{order.dbtUtrNumber}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    type="button"
                    onClick={() => setIsOrderHistoryModalOpen(true)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View Invoice
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeliveryTrackerModalOpen(true)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Pledges Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Active Farmer Pledges & Pipeline Status</h3>
          </div>
          <span className="badge badge-emerald">{pledges.length} Active Lots</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass-bright)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>PLEDGE ID</th>
                <th style={{ padding: '12px 14px' }}>FARMER & VILLAGE</th>
                <th style={{ padding: '12px 14px' }}>COMMODITY</th>
                <th style={{ padding: '12px 14px' }}>QUANTITY</th>
                <th style={{ padding: '12px 14px' }}>EXPECTED RETURN</th>
                <th style={{ padding: '12px 14px' }}>SHAPLEY SAVINGS</th>
                <th style={{ padding: '12px 14px' }}>LIFECYCLE STATUS</th>
                <th style={{ padding: '12px 14px' }}>ACTION / SMS ALERT</th>
              </tr>
            </thead>
            <tbody>
              {pledges.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                    {p.id}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{p.farmerName}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>{p.locationVillage}, {p.district}</div>
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>{p.commodity}</td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>
                    {p.quantityQuintals} Q <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>({p.quantityKg.toLocaleString()} kg)</span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#34d399' }}>
                    ₹{p.expectedRealizationPerQ}/Q
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-saffron">+{p.shapleySavingsPercent}% Saved</span>
                  </td>
                  <td style={{ padding: '14px' }}>{getLifecycleBadge(p.status)}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {p.status === 'READY_TO_SELL' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCheck size={14} color="#34d399" /> SMS Sent
                          </span>
                          <button
                            type="button"
                            onClick={() => markPledgeReadyToSell(p.id)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.12)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              color: '#38bdf8',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            title="Resend Kisan SMS"
                          >
                            Resend SMS
                          </button>
                        </div>
                      ) : p.status === 'PLEDGED' || p.status === 'MATCHED' ? (
                        <button
                          type="button"
                          onClick={() => markPledgeReadyToSell(p.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #059669, #10b981)',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <Bell size={13} />
                          <span>Mark Ready to Sell & Send SMS</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          In Pipeline
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setTrackingModalPledge(p)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#38bdf8',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        title="Open Flipkart-style Live Delivery Order Details"
                      >
                        <Navigation size={13} />
                        <span>Track Live Delivery</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flipkart Style Delivery Tracking Modal */}
      {trackingModalPledge && (
        <FlipkartDeliveryTracker
          pledge={trackingModalPledge}
          isModal={true}
          onClose={() => setTrackingModalPledge(null)}
        />
      )}
    </div>
  );
};
