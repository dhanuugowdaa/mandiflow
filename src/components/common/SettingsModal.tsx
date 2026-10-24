import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  X,
  User,
  Building,
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  Palette,
  Check,
  RotateCcw,
  Save,
  LifeBuoy,
  KeyRound,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Smartphone,
  CloudSun,
  Key,
} from 'lucide-react';
import { PREVIOUS_MARKETS } from '../../data/previousDataset';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    userSession,
    settings,
    updateSettings,
    updateUserProfile,
    setIsHelpSupportOpen,
    resetDemoData,
    addToast,
    weatherApiKey,
    setWeatherApiKey,
    setIsWeatherModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'mandi' | 'notifications' | 'security' | 'display'>('profile');
  const [apiKeyInput, setApiKeyInput] = useState<string>(weatherApiKey || '');

  // Form State for User Profile (Required Fields!)
  const [name, setName] = useState<string>(userSession?.name || 'Rameshwar Patil');
  const [organization, setOrganization] = useState<string>(userSession?.organization || 'Sahyadri Farmers Producer Co.');
  const [phone, setPhone] = useState<string>(userSession?.phone || '+91 98231 44021');
  const [location, setLocation] = useState<string>(userSession?.location || 'Nashik, Maharashtra');
  const [language, setLanguage] = useState<string>(settings.preferredLanguage);

  // Mandi & Trade State
  const [defaultMandiId, setDefaultMandiId] = useState<number>(settings.defaultMandiId);
  const [commissionPct, setCommissionPct] = useState<number>(settings.statutoryCommissionPct);
  const [cessPct, setCessPct] = useState<number>(settings.statutoryCessPct);

  // Notification Toggles
  const [smsAlerts, setSmsAlerts] = useState<boolean>(settings.smsAlertsEnabled);
  const [reeferAlerts, setReeferAlerts] = useState<boolean>(settings.reeferTempAlertsEnabled);
  const [whatsappInvoices, setWhatsappInvoices] = useState<boolean>(settings.whatsappInvoicesEnabled);

  // Display State
  const [sunlightMode, setSunlightMode] = useState<boolean>(settings.highContrastSunlightMode);
  const [themeAccent, setThemeAccent] = useState<'emerald' | 'saffron' | 'sky'>(settings.themeAccent);

  // Security State
  const [autoLogout, setAutoLogout] = useState<number>(settings.autoLogoutMinutes);
  const [dpdpConsent, setDpdpConsent] = useState<boolean>(settings.dpdpStrictCompliance);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Validation Error State
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  if (!isSettingsOpen) return null;

  const validateRequiredFields = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = 'Full Name is a required field.';
    if (!organization.trim()) errors.organization = 'Organization / Enterprise is required.';
    if (!phone.trim()) {
      errors.phone = 'Mobile Phone Number is required.';
    } else if (phone.trim().length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!location.trim()) errors.location = 'Operational Location / District is required.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequiredFields()) {
      addToast('error', 'Validation Failed', 'Please complete all required fields before saving.');
      return;
    }

    // Update user profile in session
    updateUserProfile({
      name,
      organization,
      phone,
      location,
    });

    // Update operational settings
    updateSettings({
      preferredLanguage: language,
      defaultMandiId,
      statutoryCommissionPct: commissionPct,
      statutoryCessPct: cessPct,
      smsAlertsEnabled: smsAlerts,
      reeferTempAlertsEnabled: reeferAlerts,
      whatsappInvoicesEnabled: whatsappInvoices,
      highContrastSunlightMode: sunlightMode,
      themeAccent,
      autoLogoutMinutes: autoLogout,
      dpdpStrictCompliance: dpdpConsent,
    });

    setIsSettingsOpen(false);
  };

  const copyToken = () => {
    const token = userSession?.tokenSha256 || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
    navigator.clipboard?.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          background: '#0d1527',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={22} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0 }}>
                  User Settings & System Configuration
                </h2>
                <span className="badge badge-sky" style={{ fontSize: '0.7rem' }}>
                  {userSession?.role ? userSession.role.toUpperCase() : 'GUEST / UNLOGGED'}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage mandatory identity fields, default APMC mandis, notification channels, and zero-trust credentials
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setIsHelpSupportOpen(true);
              }}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', gap: '6px', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              <LifeBuoy size={14} />
              <span>Help & Support</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', borderRadius: '8px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-Nav Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-glass)',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px 16px',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'profile' ? '2px solid #38bdf8' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'profile' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <User size={15} />
            <span>Profile & Required Fields</span>
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'mandi' ? '2px solid #fbbf24' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'mandi' ? '#fbbf24' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'mandi' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <Building size={15} />
            <span>APMC Mandi & Economics</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'notifications' ? '2px solid #10b981' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'notifications' ? '#10b981' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'notifications' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <Bell size={15} />
            <span>Alerts & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'security' ? '2px solid #f43f5e' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'security' ? '#f43f5e' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'security' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <Shield size={15} />
            <span>Zero-Trust Security & DPDP</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'display' ? '2px solid #a78bfa' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'display' ? '#a78bfa' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'display' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <Palette size={15} />
            <span>Sunlight Mode & Themes</span>
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSaveAll} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {/* TAB 1: PROFILE & REQUIRED FIELDS */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontSize: '0.82rem',
                    color: '#cbd5e1',
                  }}
                >
                  Fields marked with an asterisk (<strong style={{ color: '#f43f5e' }}>*</strong>) are <strong>required fields</strong> mandatory for APMC gate-pass issuance, e-NAM settlement, and statutory tax compliance under the Model APMC Act.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Required Field: Full Name */}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Stakeholder Full Name <span style={{ color: '#f43f5e' }}>* (Required)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
                        }}
                        placeholder="e.g. Rameshwar Patil"
                        className="input-field"
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#f8fafc',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          borderColor: validationErrors.name ? '#f43f5e' : undefined,
                        }}
                      />
                    </div>
                    {validationErrors.name && (
                      <div style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '4px' }}>
                        {validationErrors.name}
                      </div>
                    )}
                  </div>

                  {/* Required Field: Organization / FPO */}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Organization / FPO / Agency <span style={{ color: '#f43f5e' }}>* (Required)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => {
                        setOrganization(e.target.value);
                        if (validationErrors.organization) setValidationErrors({ ...validationErrors, organization: '' });
                      }}
                      placeholder="e.g. Sahyadri Farmers Producer Co."
                      className="input-field"
                      style={{
                        width: '100%',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        borderColor: validationErrors.organization ? '#f43f5e' : undefined,
                      }}
                    />
                    {validationErrors.organization && (
                      <div style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '4px' }}>
                        {validationErrors.organization}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Required Field: Phone Number */}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Mobile Phone Number <span style={{ color: '#f43f5e' }}>* (Required)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                      }}
                      placeholder="+91 98231 44021"
                      className="input-field"
                      style={{
                        width: '100%',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        borderColor: validationErrors.phone ? '#f43f5e' : undefined,
                      }}
                    />
                    {validationErrors.phone && (
                      <div style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '4px' }}>
                        {validationErrors.phone}
                      </div>
                    )}
                  </div>

                  {/* Required Field: Location / District */}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Primary District / Mandi Yard <span style={{ color: '#f43f5e' }}>* (Required)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (validationErrors.location) setValidationErrors({ ...validationErrors, location: '' });
                      }}
                      placeholder="e.g. Kolar, Karnataka"
                      className="input-field"
                      style={{
                        width: '100%',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        borderColor: validationErrors.location ? '#f43f5e' : undefined,
                      }}
                    />
                    {validationErrors.location && (
                      <div style={{ fontSize: '0.72rem', color: '#f43f5e', marginTop: '4px' }}>
                        {validationErrors.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Language Selection */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Preferred Language for Agmarknet Feeds & Audio Alerts
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                  >
                    <option value="English">English (National General Standard)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada - Kolar & Bangalore Mandis)</option>
                    <option value="Hindi">हिंदी (Hindi - North & Central India Corridors)</option>
                    <option value="Telugu">తెలుగు (Telugu - Madanapalle & AP Corridors)</option>
                    <option value="Tamil">தமிழ் (Tamil - Hosur & TN Mandis)</option>
                    <option value="Marathi">मराठी (Marathi - Nashik & Vashi Terminals)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 2: APMC MANDI & TRADE ECONOMICS */}
            {activeTab === 'mandi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Default Associated APMC Mandi (Previous Dataset Network)
                  </label>
                  <select
                    value={defaultMandiId}
                    onChange={(e) => setDefaultMandiId(Number(e.target.value))}
                    className="input-field"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                  >
                    {PREVIOUS_MARKETS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.apmcCode} - {m.district}, {m.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Statutory Commission Agent Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10.0"
                      value={commissionPct}
                      onChange={(e) => setCommissionPct(Number(e.target.value))}
                      className="input-field"
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Default 1.5% - 2.0% under Model APMC</span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Market Cess & Development Fee (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.2"
                      max="5.0"
                      value={cessPct}
                      onChange={(e) => setCessPct(Number(e.target.value))}
                      className="input-field"
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Default 1.0% State Agricultural Board</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NOTIFICATIONS & ALERTS */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      SMS Price Alert & e-NAM Outbid Notifications
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Receive instant SMS when an active auction bid exceeds your reserve or outbids you.
                    </div>
                  </div>
                  <label className="switch" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      Cold-Chain Reefer Spoilage & Temperature Fault Alert
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Trigger priority alarm if IoT truck chamber temperature rises above +6°C.
                    </div>
                  </div>
                  <label className="switch" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reeferAlerts}
                      onChange={(e) => setReeferAlerts(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      WhatsApp Cryptographic Gate-Pass & e-NWR Slips
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Directly receive PDF weighment tickets and WDRA electronic receipts on your phone.
                    </div>
                  </div>
                  <label className="switch" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={whatsappInvoices}
                      onChange={(e) => setWhatsappInvoices(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                    />
                  </label>
                </div>

                {/* Live Weather & Spoilage API Key Gateway */}
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CloudSun size={18} color="#38bdf8" />
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                        Agricultural Weather & Spoilage API Gateway
                      </div>
                    </div>
                    <span className="badge badge-sky">Auto-Detection: Active</span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    MandiFlow auto-detects real-time climate telemetry via satellite (Open-Meteo). Enter your custom OpenWeatherMap API Key below for dedicated quota and microclimate alerts:
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Enter OpenWeatherMap API Key (e.g. 8a7b9c...)"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="mono-text"
                      style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid var(--border-glass-bright)',
                        color: '#38bdf8',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setWeatherApiKey(apiKeyInput)}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.78rem',
                        color: '#38bdf8',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Key size={13} />
                      <span>Verify & Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        setIsWeatherModalOpen(true);
                      }}
                      className="btn btn-primary"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.78rem',
                        background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>Freshness Guard →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ZERO-TRUST SECURITY & DPDP */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div
                  style={{
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#f43f5e', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Zero-Trust Cryptographic Token (SHA-256)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="text"
                      readOnly
                      value={userSession?.tokenSha256 || 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                      className="mono-text"
                      style={{
                        flex: 1,
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--border-glass)',
                        color: '#38bdf8',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={copyToken}
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                    >
                      {copiedToken ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                    Tamper-evident authorization token embedded in every weighbridge, GRASP, and auction transaction.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Inactivity Auto-Logout Timer
                    </label>
                    <select
                      value={autoLogout}
                      onChange={(e) => setAutoLogout(Number(e.target.value))}
                      className="input-field"
                      style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                    >
                      <option value={15}>15 Minutes (High Security Yard)</option>
                      <option value={30}>30 Minutes (Recommended)</option>
                      <option value={60}>60 Minutes (Office Console)</option>
                      <option value={240}>4 Hours (Long Haul Transit)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Digital Personal Data Protection (DPDP Act 2023)
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#f8fafc' }}>
                      <input
                        type="checkbox"
                        checked={dpdpConsent}
                        onChange={(e) => setDpdpConsent(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                      />
                      <span>Enforce strict tamper-evident cryptographic audit logs</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SUNLIGHT MODE & DISPLAY */}
            {activeTab === 'display' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sun size={16} color="#fbbf24" />
                      <span>Outdoor High-Contrast Sunlight Mode (Farmer Field Display)</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Boosts contrast and border luminance for crystal clear readability under direct bright sunlight.
                    </div>
                  </div>
                  <label className="switch" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={sunlightMode}
                      onChange={(e) => setSunlightMode(e.target.checked)}
                      style={{ width: '20px', height: '20px', accentColor: '#fbbf24' }}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Dashboard Theme Accent
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                      { id: 'emerald', label: 'Emerald Agri Green', color: '#10b981' },
                      { id: 'saffron', label: 'Saffron Harvest Gold', color: '#fbbf24' },
                      { id: 'sky', label: 'Sky Intelligence Blue', color: '#38bdf8' },
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setThemeAccent(th.id as any)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          background: themeAccent === th.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: themeAccent === th.id ? `2px solid ${th.color}` : '1px solid var(--border-glass)',
                          color: '#f8fafc',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.color }} />
                        <span>{th.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Factory Reset Demo */}
                <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      resetDemoData();
                      setIsSettingsOpen(false);
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset All Demo Data & Logs</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-glass)',
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              All changes are cryptographically secured and bound to your active session.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 24px', fontSize: '0.82rem', gap: '8px' }}
              >
                <Save size={15} />
                <span>Save Settings & Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
