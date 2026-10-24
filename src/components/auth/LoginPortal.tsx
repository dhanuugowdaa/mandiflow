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
  ShieldAlert,
  Smartphone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { loginUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [phoneOrId, setPhoneOrId] = useState<string>('98231 44021');
  const [otpCode, setOtpCode] = useState<string>('729104');
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'persona' | 'credentials'>('persona');

  const personas = [
    {
      role: 'farmer' as UserRole,
      title: 'Farmer Dashboard (Kisan Seva)',
      personaName: 'Rameshwar Patil',
      subtitle: 'Tomato & Vegetable Cultivator, Nashik',
      badge: 'KRISHI BANDHU',
      icon: <Sprout size={24} color="#10b981" />,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      description: 'Pledge farm harvest, monitor Arrhenius decay kinetics, compare Shapley coalition freight savings, and verify CACP MSP guard.',
    },
    {
      role: 'fpo' as UserRole,
      title: 'FPO Dashboard (Aggregation Hub)',
      personaName: 'Sachin Rao',
      subtitle: 'Cluster Director, Sahyadri Producer Co.',
      badge: 'COLLECTION CENTER',
      icon: <Users size={24} color="#38bdf8" />,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      description: 'Automate combinatorial bin packing via GRASP, enforce botanical ethylene isolation rules, and monitor auto-trigger thresholds.',
    },
    {
      role: 'enam' as UserRole,
      title: 'e-NAM Dashboard (National Trade Hub)',
      personaName: 'S. K. Gupta',
      subtitle: 'Licensed Inter-State Trader & Assayer',
      badge: 'UNIFIED MARKET',
      icon: <Scale size={24} color="#fbbf24" />,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.15)',
      description: 'AI price discovery model trained on previous dataset, AGMARK quality assaying parameters, and electronic bidding floor.',
    },
    {
      role: 'mandi' as UserRole,
      title: 'Mandi Dashboard (APMC Yard & Scale)',
      personaName: 'Sandeep Jadhav',
      subtitle: 'Weighbridge Chief, APMC Yard Gate 4',
      badge: 'MANDI TERMINAL',
      icon: <Landmark size={24} color="#f43f5e" />,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      description: 'Digital gate-pass verification, gross & tare weighbridge calculations with ±2.0% discrepancy tolerance detection, and Arhatiya cess.',
    },
    {
      role: 'truck' as UserRole,
      title: 'Truck Dashboard (Cold Logistics)',
      personaName: 'Sukhdev Singh',
      subtitle: 'Master Driver, 16T Reefer Fleet TRK-8921',
      badge: 'KISAN RATH REEFER',
      icon: <Truck size={24} color="#a78bfa" />,
      color: '#a78bfa',
      bgGlow: 'rgba(167, 139, 250, 0.15)',
      description: 'Smart transit corridor GPS tracking, IoT reefer chamber temperature & ethylene monitoring, and cryptographic ePoD delivery receipt.',
    },
    {
      role: 'admin' as UserRole,
      title: 'Admin Dashboard (Apex Governance)',
      personaName: 'Dr. Ananya Sen',
      subtitle: 'Chief Platform Auditor, Agmarknet Directorate',
      badge: 'APEX GOVERNANCE',
      icon: <ShieldCheck size={24} color="#f59e0b" />,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      description: 'System-wide policy simulation, dynamic mandi cess controls, DPDP Act 2023 tamper-evident audit ledger, and carbon credit metrics.',
    },
  ];

  const handlePersonaSelect = (role: UserRole) => {
    setSelectedRole(role);
    loginUser(role);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
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
        justifyContent: 'center',
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Hero Welcome */}
      <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '860px' }}>
        <h1
          style={{
            fontSize: '2.8rem',
            lineHeight: 1.15,
            marginBottom: '12px',
            letterSpacing: '-0.03em',
          }}
        >
          Welcome to <span className="gradient-text-emerald">MandiFlow</span>
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
            margin: '6px 0 14px 0',
          }}
        >
          Your Harvest. Your Market. Your Profit.
        </p>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            marginTop: '22px',
          }}
        >
          <button
            onClick={() => setActiveTab('persona')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'persona' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'persona' ? '#34d399' : '#94a3b8',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={15} />
            <span>1-Click Persona Quick Launch</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'credentials' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeTab === 'credentials' ? '#38bdf8' : '#94a3b8',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Smartphone size={15} />
            <span>Kisan ID / OTP Login</span>
          </button>
        </div>
      </div>

      {/* Mode 1: 6 Persona Cards Grid */}
      {activeTab === 'persona' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '22px',
            width: '100%',
          }}
        >
          {personas.map((p) => (
            <div
              key={p.role}
              className="glass-panel glass-panel-glow"
              onClick={() => handlePersonaSelect(p.role)}
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(145deg, rgba(15, 23, 42, 0.8), ${p.bgGlow})`,
                border: '1px solid var(--border-glass)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${p.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '2px' }}>
                      {p.title}
                    </h3>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: p.color, border: `1px solid ${p.color}40` }}>
                      {p.badge}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    {p.personaName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {p.subtitle}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
                  {p.description}
                </p>
              </div>

              <button
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '0.85rem',
                  borderColor: `${p.color}40`,
                  color: p.color,
                }}
              >
                <span>Launch {p.title}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Mode 2: Standard OTP / Credential Form */
        <div
          className="glass-panel"
          style={{
            maxWidth: '520px',
            width: '100%',
            padding: '36px',
          }}
        >
          <h2 style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#f8fafc' }}>
            Kisan OTP Authentication
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>
            Select your assigned role and authenticate using registered Aadhaar/Kisan mobile number.
          </p>

          <form onSubmit={handleCredentialsSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Select Stakeholder Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="input-field"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px' }}
              >
                <option value="farmer">Farmer Dashboard (Kisan Seva Portal)</option>
                <option value="fpo">FPO Dashboard (Sahyadri Producer Co.)</option>
                <option value="enam">e-NAM Dashboard (National Auction Hub)</option>
                <option value="mandi">APMC Mandi Dashboard (Scale & Yard Terminal)</option>
                <option value="truck">Truck Driver Dashboard (Kisan Rath Logistics)</option>
                <option value="admin">Apex Admin Dashboard (Directorate of Marketing)</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Mobile Number / APMC Trader ID
              </label>
              <input
                type="text"
                value={phoneOrId}
                onChange={(e) => setPhoneOrId(e.target.value)}
                placeholder="Enter 10-digit mobile or license code"
                className="input-field"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px' }}
              />
            </div>

            {otpSent && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>One-Time Password (OTP)</label>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Demo OTP Auto-Filled: 729104</span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-field"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
            >
              <KeyRound size={18} />
              <span>Verify & Launch Authorized Dashboard</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
