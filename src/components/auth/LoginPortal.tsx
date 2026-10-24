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
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { loginUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [phoneOrId, setPhoneOrId] = useState<string>('98231 44021');
  const [otpCode, setOtpCode] = useState<string>('729104');

  // Phone numbers corresponding to each stakeholder persona for authentic testing
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

  // 6 Dashboards organized exactly matching the user's sketch:
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
      statusTag: '📈 ML Assay Accuracy 94.8%',
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

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '36px 20px 60px 20px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 1. Header: Welcome to MandiFlow + Tagline */}
      <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '880px', width: '100%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '14px',
          }}
        >
          <span className="live-pulse" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6ee7b7', letterSpacing: '0.04em' }}>
            NATIONAL AGRICULTURAL LOGISTICS & TRADING NETWORK
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
            lineHeight: 1.15,
            marginBottom: '10px',
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
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 45%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
            margin: '4px 0 16px 0',
          }}
        >
          Your Harvest. Your Market. Your Profit.
        </p>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
          Real-time cold-chain logistics, Arrhenius spoilage kinetics, e-NAM multi-variate machine learning price discovery, and Zero-Trust DPDP Act 2023 governance.
        </p>
      </div>

      {/* 2. Top Section: 6 Dashboard Cards (matching user's sketch 2x3 layout with FEW ANIMATION) */}
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            padding: '0 4px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700, margin: 0 }}>
                Stakeholder Portals & Interactive Dashboards
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Select any dashboard card for 1-click instant launch with full mock telemetry
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.2)',
            }}
          >
            <Activity size={14} />
            <span>Interactive Animations Active</span>
          </div>
        </div>

        {/* 2-Column Responsive Grid matching sketch */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            width: '100%',
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
                  background: `linear-gradient(145deg, rgba(15, 23, 42, 0.88), ${card.bgGlow})`,
                } as React.CSSProperties
              }
            >
              <div>
                {/* Card Top: Icon, Title, Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      className="card-icon-box"
                      style={{
                        width: '48px',
                        height: '48px',
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
                      <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '4px', fontWeight: 700 }}>
                        {card.title}
                      </h3>
                      <span
                        className="badge"
                        style={{
                          background: `${card.color}15`,
                          color: card.color,
                          border: `1px solid ${card.color}40`,
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                        }}
                      >
                        {card.code}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.73rem',
                      fontWeight: 600,
                      color: card.color,
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '4px 8px',
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
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    borderLeft: `3px solid ${card.color}`,
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    {card.personaName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    {card.subtitle}
                  </div>
                </div>

                {/* Card description */}
                <p style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
                  {card.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-secondary card-launch-btn"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.86rem',
                  borderColor: `${card.color}50`,
                  color: card.color,
                  fontWeight: 700,
                }}
              >
                <span>Launch {card.title}</span>
                <ArrowRight size={16} className="arrow-icon" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Section: LOG IN PAGE (Large Box matching the user's sketch) */}
      <div style={{ width: '100%', maxWidth: '960px' }}>
        <div className="frontpage-login-box">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
              borderBottom: '1px solid var(--border-glass)',
              paddingBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={22} color="#34d399" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', color: '#f8fafc', fontWeight: 800, margin: 0 }}>
                  LOG IN PAGE
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Direct Stakeholder Authentication & Zero-Trust Portal Verification
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '6px 14px',
                borderRadius: '999px',
              }}
            >
              <Smartphone size={15} color="#38bdf8" />
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                Instant OTP Verification Enabled
              </span>
            </div>
          </div>

          {/* Quick Role Selection Pills */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '10px' }}>
              Select Active Stakeholder Role:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {dashboardCards.map((p) => {
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleRoleSelect(p.role)}
                    className={`role-pill ${isSelected ? 'active' : ''}`}
                    style={
                      isSelected
                        ? {
                            background: `${p.color}25`,
                            borderColor: p.color,
                            color: '#ffffff',
                            boxShadow: `0 0 14px ${p.color}35`,
                          }
                        : {}
                    }
                  >
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginFormSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '18px',
                marginBottom: '20px',
              }}
            >
              {/* Phone / License ID */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Mobile Number / APMC Trader ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={phoneOrId}
                    onChange={(e) => setPhoneOrId(e.target.value)}
                    placeholder="Enter registered 10-digit mobile number"
                    className="input-field"
                    style={{
                      width: '100%',
                      background: 'rgba(10, 15, 26, 0.8)',
                      color: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  Persona: <strong style={{ color: '#f8fafc' }}>{roleDefaultCredentials[selectedRole].name}</strong>
                </div>
              </div>

              {/* OTP */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
                    One-Time Password (OTP)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                    Auto-Filled: 729104
                  </span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-field"
                  style={{
                    width: '100%',
                    background: 'rgba(10, 15, 26, 0.8)',
                    color: '#34d399',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textAlign: 'center',
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 25px rgba(16, 185, 129, 0.35)',
              }}
            >
              <KeyRound size={20} />
              <span>Verify & Launch {dashboardCards.find((c) => c.role === selectedRole)?.title}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Trust & Compliance badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.76rem',
              color: 'var(--text-dim)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#34d399" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#38bdf8" />
              <span>Zero-Trust RBAC Enforced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#fbbf24" />
              <span>WDRA e-NWR Warehouse Verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#a78bfa" />
              <span>All Data Protected & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
