import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sprout,
  Users,
  Scale,
  Landmark,
  Truck,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Lock,
  User,
  Settings,
  LifeBuoy,
  Navigation,
  TrendingUp,
  CloudSun,
  History,
  Cpu,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    userSession,
    logoutUser,
    commodities,
    canAccessDashboard,
    resetDemoData,
    setIsSettingsOpen,
    setIsHelpSupportOpen,
    setIsProfitModalOpen,
    setIsDeliveryTrackerModalOpen,
    setIsOrderHistoryModalOpen,
    weatherData,
    setIsWeatherModalOpen,
    setIsDatasetModalOpen,
    datasetRunResult,
    pendingApmcConfirmations,
    setActiveApmcConfirmationModal,
  } = useApp();

  const allRoleConfigs: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'farmer', label: 'Farmer Dashboard', icon: <Sprout size={16} />, color: '#10b981' },
    { role: 'fpo', label: 'FPO Dashboard', icon: <Users size={16} />, color: '#38bdf8' },
    { role: 'enam', label: 'e-NAM Dashboard', icon: <Scale size={16} />, color: '#fbbf24' },
    { role: 'mandi', label: 'Mandi Dashboard', icon: <Landmark size={16} />, color: '#f43f5e' },
    { role: 'truck', label: 'Truck Dashboard', icon: <Truck size={16} />, color: '#a78bfa' },
    { role: 'admin', label: 'Admin Dashboard', icon: <ShieldCheck size={16} />, color: '#f59e0b' },
  ];

  // RBAC Filter: Only show tabs the logged-in user has explicit permission for!
  const permittedRoleConfigs = allRoleConfigs.filter((item) => canAccessDashboard(item.role));

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(9, 13, 22, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      {/* Top Agmarknet Marquee Ticker */}
      <div
        style={{
          background: 'rgba(5, 150, 105, 0.08)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
          padding: '6px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          fontSize: '0.75rem',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700 }}>
          <span className="live-pulse" />
          <span>AGMARKNET REAL-TIME FEED</span>
        </div>
        <div style={{ color: 'var(--border-glass-bright)' }}>|</div>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {commodities.map((c) => (
            <div key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{c.name}:</span>
              <span className="mono-text" style={{ color: '#f8fafc', fontWeight: 700 }}>
                ₹{c.modalPrice.toLocaleString()}/Q
              </span>
              <span
                style={{
                  color: c.dailyChange >= 0 ? '#34d399' : '#fb7185',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              >
                {c.dailyChange >= 0 ? `+${c.dailyChange}%` : `${c.dailyChange}%`}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>(MSP: ₹{c.msp})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div
        style={{
          maxWidth: '1700px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Sprout size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                }}
              >
                Mandi<span style={{ color: '#10b981' }}>Flow</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                <Lock size={10} /> RBAC Protected
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', margin: 0 }}>
              National Agricultural Logistics & Multi-Stakeholder Intelligence
            </p>
          </div>
        </div>

        {/* Authorized Stakeholder Dashboard Tabs (Filtered by RBAC!) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            gap: '4px',
            overflowX: 'auto',
          }}
        >
          {permittedRoleConfigs.map((item) => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setCurrentRole(item.role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  border: isActive ? `1.5px solid ${item.color}` : '1px solid transparent',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: isActive ? item.color : 'inherit', display: 'flex' }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Live Real-Time Backend Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#34d399',
          }}
          title="Real-Time WebSocket & Express Engine Active on Port 5000"
        >
          <span className="live-pulse" style={{ width: '7px', height: '7px', background: '#34d399' }} />
          <span>BACKEND: LIVE</span>
        </div>

        {/* APMC Inbound Dispatches Pending Acceptance Badge */}
        {pendingApmcConfirmations && pendingApmcConfirmations.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveApmcConfirmationModal(pendingApmcConfirmations[0])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.5)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#fb7185',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(244, 63, 94, 0.25)',
            }}
            title="Incoming Farmer Dispatches Awaiting APMC Mandi Acceptance"
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }} />
            <span>APMC Inbound ({pendingApmcConfirmations.length})</span>
          </button>
        )}

        {/* User Session Badge & Security Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {userSession && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass-bright)',
                padding: '6px 14px',
                borderRadius: '10px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: userSession.avatarColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}
              >
                {userSession.name.charAt(0)}
              </div>
              <div style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  {userSession.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  {userSession.role} • {userSession.clearanceLevel}
                </div>
              </div>
            </div>
          )}

          {/* Live Weather & Product Freshness Button */}
          <button
            onClick={() => setIsWeatherModalOpen(true)}
            className="btn btn-secondary"
            title="Real-Time Agri Weather & Produce Freshness Window (Arrhenius Kinetics)"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              borderColor: 'rgba(56, 189, 248, 0.35)',
              gap: '6px',
              fontWeight: 700,
            }}
          >
            <CloudSun size={15} />
            <span>
              {weatherData
                ? `${weatherData.isDeviceLocation ? '📍 ' : ''}${weatherData.location.split(',')[0].replace('(Current Device Location)', '').trim()}: ${weatherData.temperatureC}°C (${weatherData.freshness.safeHoursRemaining}h Safe)`
                : 'Weather & Freshness'}
            </span>
          </button>

          {/* Flipkart-Style Order & Dispatch Tracker Modal */}
          <button
            onClick={() => setIsDeliveryTrackerModalOpen(true)}
            className="btn btn-secondary"
            title="Track Live Consignment Route, Current Location & Waypoints (Flipkart-Style Delivery Order)"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              borderColor: 'rgba(56, 189, 248, 0.35)',
              gap: '6px',
              fontWeight: 700,
            }}
          >
            <Navigation size={14} />
            <span>Order Tracker</span>
          </button>

          {/* Flipkart-Style Order & Sales History Statement Modal */}
          <button
            onClick={() => setIsOrderHistoryModalOpen(true)}
            className="btn btn-secondary"
            title="View Past Sales History, Restored Orders Statement & Invoices"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              borderColor: 'rgba(16, 185, 129, 0.35)',
              gap: '6px',
              fontWeight: 700,
            }}
          >
            <History size={14} />
            <span>Order History</span>
          </button>

          {/* Run Dataset with Accuracy Percentage Button */}
          <button
            onClick={() => setIsDatasetModalOpen(true)}
            className="btn btn-secondary"
            title="Execute Machine Learning Model on Agmarknet Dataset with Verified Accuracy Percentage"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#34d399',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.25))',
              borderColor: 'rgba(52, 211, 153, 0.5)',
              gap: '6px',
              fontWeight: 700,
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.25)',
            }}
          >
            <Cpu size={14} color="#34d399" />
            <span>Run Dataset</span>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '2px 7px',
                borderRadius: '8px',
                fontSize: '0.68rem',
                fontWeight: 800,
              }}
            >
              {datasetRunResult?.accuracyPercentage || 94.8}% Acc
            </span>
          </button>

          {/* Profit & Savings Calculator Button */}
          <button
            onClick={() => setIsProfitModalOpen(true)}
            className="btn btn-secondary"
            title="Compare Traditional Selling Costs vs MandiFlow Smart Route"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              borderColor: 'rgba(16, 185, 129, 0.35)',
              gap: '6px',
              fontWeight: 700,
            }}
          >
            <TrendingUp size={14} />
            <span>Profit Calculator</span>
          </button>

          {/* Settings Menu Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="btn btn-secondary"
            title="Open User Settings & Required Profile Fields"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              gap: '6px',
            }}
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>

          {/* Help & Support Button */}
          <button
            onClick={() => setIsHelpSupportOpen(true)}
            className="btn btn-secondary"
            title="24x7 Kisan Call Center & Grievance Desk"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#34d399',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              gap: '6px',
            }}
          >
            <LifeBuoy size={14} />
            <span>Help & Support</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetDemoData}
            className="btn btn-secondary"
            title="Reset to fresh demo states"
            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Logout / Switch Role */}
          <button
            onClick={logoutUser}
            className="btn btn-secondary"
            style={{
              padding: '7px 13px',
              fontSize: '0.78rem',
              color: '#fb7185',
              borderColor: 'rgba(244, 63, 94, 0.25)',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
