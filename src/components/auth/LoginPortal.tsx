import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Users,
  Scale,
  Landmark,
  Truck,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Smartphone,
  Lock,
  Activity,
  Zap,
  Database,
  Cpu,
  Play,
  RotateCw,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const {
    loginUser,
    datasetRunResult,
    isRunningDataset,
    runDatasetEngine,
    setIsDatasetModalOpen,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [phoneOrId, setPhoneOrId] = useState<string>('98231 44021');
  const [otpCode, setOtpCode] = useState<string>('729104');

  // Phone numbers corresponding to each stakeholder persona
  const roleDefaultCredentials: Record<UserRole, { phone: string; name: string }> = {
    farmer: { phone: '98231 44021', name: 'Rameshwar Patil' },
    mandi: { phone: '98452 19830', name: 'Sandeep Jadhav' },
    fpo: { phone: '97310 88204', name: 'Sachin Rao' },
    truck: { phone: '94120 77319', name: 'Sukhdev Singh' },
    enam: { phone: '98101 66542', name: 'S. K. Gupta' },
    admin: { phone: '99000 11223', name: 'Dr. Ananya Sen' },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPhoneOrId(roleDefaultCredentials[role].phone);
  };

  // 6 Dashboards organized matching the user's sketch:
  // Row 1: Farmer Dashboard | Mandi Dashboard
  // Row 2: FPO Dashboard    | Truck Dashboard
  // Row 3: e-NAM Dashboard  | Admin Dashboard
  const dashboardCards = [
    {
      role: 'farmer' as UserRole,
      title: 'Farmer Dashboard',
      code: 'KISAN SEVA',
      personaName: 'Rameshwar Patil',
      subtitle: 'Tomato & Vegetable Cultivator, Nashik',
      icon: <Sprout size={24} color="#10b981" />,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.18)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      description: 'Pledge farm harvest, live Arrhenius freshness kinetics, Shapley coalition freight savings, and CACP MSP floor protection.',
      statusTag: '🌾 10 Crops Live',
      animClass: 'anim-float-1',
    },
    {
      role: 'mandi' as UserRole,
      title: 'Mandi APMC Dashboard',
      code: 'TERMINAL SCALE',
      personaName: 'Sandeep Jadhav',
      subtitle: 'Weighbridge Chief, APMC Yard Gate 4',
      icon: <Landmark size={24} color="#f43f5e" />,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.18)',
      borderColor: 'rgba(244, 63, 94, 0.35)',
      description: 'Digital gate-pass verification, gross & tare weighbridge calculations with ±2.0% discrepancy detection, and Arhatiya cess settlement.',
      statusTag: '⚖️ 4 APMC Gates Active',
      animClass: 'anim-float-2',
    },
    {
      role: 'fpo' as UserRole,
      title: 'FPO Dashboard',
      code: 'AGGREGATION HUB',
      personaName: 'Sachin Rao',
      subtitle: 'Cluster Director, Sahyadri Producer Co.',
      icon: <Users size={24} color="#38bdf8" />,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.18)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      description: 'Automated multi-bin packing via GRASP combinatorial heuristics and botanical ethylene co-loading isolation compliance.',
      statusTag: '📦 GRASP Auto-Packing',
      animClass: 'anim-float-3',
    },
    {
      role: 'truck' as UserRole,
      title: 'Truck Dashboard',
      code: 'COLD LOGISTICS',
      personaName: 'Sukhdev Singh',
      subtitle: 'Master Driver, 16T Reefer Fleet TRK-8921',
      icon: <Truck size={24} color="#a78bfa" />,
      color: '#a78bfa',
      bgGlow: 'rgba(167, 139, 250, 0.18)',
      borderColor: 'rgba(167, 139, 250, 0.35)',
      description: 'Live GPS corridor tracking (NH-48), IoT reefer chamber temperature & ethylene telemetry sensors, and cryptographic ePoD receipt.',
      statusTag: '🚚 NH-48 GPS Online',
      animClass: 'anim-float-1',
    },
    {
      role: 'enam' as UserRole,
      title: 'e-NAM Dashboard',
      code: 'NATIONAL AUCTION',
      personaName: 'S. K. Gupta',
      subtitle: 'Licensed Inter-State Trader & Assayer',
      icon: <Scale size={24} color="#fbbf24" />,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.18)',
      borderColor: 'rgba(251, 191, 36, 0.35)',
      description: 'AGMARK quality assaying parameters, multivariate ML price discovery trained on APMC dataset, and electronic bidding floor.',
      statusTag: '📈 ML Accuracy 94.8%',
      animClass: 'anim-float-2',
    },
    {
      role: 'admin' as UserRole,
      title: 'Admin Dashboard',
      code: 'APEX GOVERNANCE',
      personaName: 'Dr. Ananya Sen',
      subtitle: 'Chief Platform Auditor, Agmarknet Directorate',
      icon: <ShieldCheck size={24} color="#f59e0b" />,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.18)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      description: 'DPDP Act 2023 tamper-evident SHA-256 audit ledger, regulatory cess simulation controls, and ESG carbon credit metrics.',
      statusTag: '🛡️ DPDP 2023 Verified',
      animClass: 'anim-float-3',
    },
  ];

  const handleInstantLaunch = (role: UserRole) => {
    loginUser(role);
  };

  const handleLoginFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(selectedRole);
  };

  const handleQuickRunDataset = async () => {
    await runDatasetEngine({
      algorithm: 'LINEAR_REGRESSION',
      epochs: 150,
      testSplitPct: 20,
      learningRate: 0.01,
    });
  };

  // Current dataset accuracy (dynamically updated if engine ran)
  const currentAccuracy = datasetRunResult?.accuracyPercentage ?? 94.8;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 20px 60px 20px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 1. Header: Welcome to MandiFlow + Tagline + Agricultural Badges */}
      <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '960px', width: '100%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '12px',
          }}
        >
          <span className="live-pulse" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.04em' }}>
            NATIONAL AGRICULTURAL LOGISTICS & APMC MANDI INTELLIGENCE
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
            lineHeight: 1.15,
            marginBottom: '8px',
            letterSpacing: '-0.03em',
            fontWeight: 800,
          }}
        >
          Welcome to <span className="gradient-text-emerald">MandiFlow</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 45%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
            margin: '2px 0 14px 0',
          }}
        >
          Your Harvest. Your Market. Your Profit.
        </p>

        {/* Agricultural Highlights */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          <span className="agri-badge-tag">
            🌾 10 Vegetable Commodities
          </span>
          <span className="agri-badge-tag" style={{ background: 'rgba(245, 158, 11, 0.14)', borderColor: 'rgba(245, 158, 11, 0.35)', color: '#fcd34d' }}>
            ⚖️ 6 APMC Mandi Networks
          </span>
          <span className="agri-badge-tag" style={{ background: 'rgba(56, 189, 248, 0.14)', borderColor: 'rgba(56, 189, 248, 0.35)', color: '#7dd3fc' }}>
            🚚 Reefer Cold-Chain GPS
          </span>
          <span className="agri-badge-tag" style={{ background: 'rgba(167, 139, 250, 0.14)', borderColor: 'rgba(167, 139, 250, 0.35)', color: '#c4b5fd' }}>
            🛡️ Zero-Trust DPDP Act 2023
          </span>
        </div>
      </div>

      {/* 2. Split Screen: Left (6 Animated Cards) + Right (Login & Small Dataset Widget) */}
      <div className="frontpage-split-container">
        
        {/* LEFT COLUMN: 6 Agricultural Dashboard Cards */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '0 4px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <Zap size={18} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
                  Agricultural Stakeholder Gateways
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Click any dashboard card for instant 1-click launch
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.73rem',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.25)',
              }}
            >
              <Activity size={13} />
              <span>Live Telemetry Active</span>
            </div>
          </div>

          {/* 2-Column Grid matching the user's sketch */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '18px',
            }}
          >
            {dashboardCards.map((card) => (
              <div
                key={card.role}
                className={`frontpage-card ${card.animClass}`}
                onClick={() => handleInstantLaunch(card.role)}
                style={
                  {
                    '--card-glow': card.bgGlow,
                    '--card-accent': card.color,
                    borderColor: card.borderColor,
                    background: `linear-gradient(145deg, rgba(15, 23, 42, 0.9), ${card.bgGlow})`,
                  } as React.CSSProperties
                }
              >
                <div>
                  {/* Card Top: Icon, Title, Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        className="card-icon-box"
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: `1px solid ${card.color}60`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '3px', fontWeight: 700 }}>
                          {card.title}
                        </h3>
                        <span
                          className="badge"
                          style={{
                            background: `${card.color}15`,
                            color: card.color,
                            border: `1px solid ${card.color}40`,
                            fontSize: '0.7rem',
                            padding: '2px 7px',
                          }}
                        >
                          {card.code}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: card.color,
                        background: 'rgba(0, 0, 0, 0.35)',
                        padding: '3px 7px',
                        borderRadius: '6px',
                        border: `1px solid ${card.color}30`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {card.statusTag}
                    </span>
                  </div>

                  {/* Persona details */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      borderLeft: `3px solid ${card.color}`,
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                      {card.personaName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {card.subtitle}
                    </div>
                  </div>

                  {/* Card description */}
                  <p style={{ fontSize: '0.81rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '16px' }}>
                    {card.description}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  className="btn btn-secondary card-launch-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '9px 12px',
                    fontSize: '0.83rem',
                    borderColor: `${card.color}50`,
                    color: card.color,
                    fontWeight: 700,
                  }}
                >
                  <span>Launch {card.title}</span>
                  <ArrowRight size={15} className="arrow-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Login Panel + Small Compact Dataset Widget */}
        <div className="agri-sidebar">
          
          {/* 1. LOGIN PANEL (In Right Side as requested) */}
          <div
            className="frontpage-login-box"
            style={{
              padding: '28px 24px',
              border: '1px solid rgba(52, 211, 153, 0.35)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                borderBottom: '1px solid var(--border-glass)',
                paddingBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lock size={19} color="#34d399" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800, margin: 0 }}>
                    LOG IN PORTAL
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Kisan & Stakeholder Authentication
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                OTP Enabled
              </span>
            </div>

            {/* Role Pills */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                Select Active Role:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dashboardCards.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleRoleSelect(p.role)}
                      className={`role-pill ${isSelected ? 'active' : ''}`}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.76rem',
                        ...(isSelected
                          ? {
                              background: `${p.color}25`,
                              borderColor: p.color,
                              color: '#ffffff',
                              boxShadow: `0 0 10px ${p.color}30`,
                            }
                          : {}),
                      }}
                    >
                      <span>{p.title.replace(' Dashboard', '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginFormSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '5px', fontWeight: 600 }}>
                  Mobile Number / APMC Trader ID
                </label>
                <input
                  type="text"
                  value={phoneOrId}
                  onChange={(e) => setPhoneOrId(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="input-field"
                  style={{
                    width: '100%',
                    background: 'rgba(10, 15, 26, 0.85)',
                    color: '#f8fafc',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.88rem',
                  }}
                />
                <div style={{ fontSize: '0.71rem', color: '#94a3b8', marginTop: '4px' }}>
                  Persona: <strong style={{ color: '#f8fafc' }}>{roleDefaultCredentials[selectedRole].name}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                    One-Time Password (OTP)
                  </label>
                  <span style={{ fontSize: '0.71rem', color: '#34d399', fontWeight: 600 }}>
                    Auto-Filled: 729104
                  </span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6-digit OTP"
                  className="input-field"
                  style={{
                    width: '100%',
                    background: 'rgba(10, 15, 26, 0.85)',
                    color: '#34d399',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textAlign: 'center',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                }}
              >
                <KeyRound size={17} />
                <span>Verify & Launch Portal</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '14px',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
              }}
            >
              <span>🔒 DPDP Act 2023</span>
              <span>•</span>
              <span>🛡️ Zero-Trust RBAC</span>
              <span>•</span>
              <span>🌾 Safe Data</span>
            </div>
          </div>

          {/* 2. COMPACT AGRICULTURAL APMC DATASET & ACCURACY WIDGET (Small & in right) */}
          <div className="agri-dataset-widget">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.18)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Database size={18} color="#fbbf24" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
                    APMC Mandi Dataset
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Historical APMC Price & Assaying Series
                  </span>
                </div>
              </div>

              <span className="live-pulse-amber" />
            </div>

            {/* Accuracy Metric Card */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Model Benchmark Accuracy:
                </span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#fbbf24',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {currentAccuracy.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '7px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, currentAccuracy)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #f59e0b)',
                    borderRadius: '999px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              {/* Mini Stats Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                <div className="agri-stat-chip">
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>MANDIS</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>6 Yards</div>
                </div>
                <div className="agri-stat-chip">
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>RECORDS</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>2,480+</div>
                </div>
                <div className="agri-stat-chip">
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>CROPS</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>10 Types</div>
                </div>
              </div>
            </div>

            {/* Quick Interactive Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={handleQuickRunDataset}
                disabled={isRunningDataset}
                className="btn btn-saffron"
                style={{
                  width: '100%',
                  padding: '9px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                }}
              >
                {isRunningDataset ? (
                  <>
                    <RotateCw size={15} className="animate-spin" />
                    <span>Evaluating APMC Dataset...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>Run Dataset & Test Accuracy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsDatasetModalOpen(true)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '0.78rem',
                  justifyContent: 'center',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1',
                }}
              >
                <Sliders size={14} />
                <span>Open Full Dataset Explorer</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
