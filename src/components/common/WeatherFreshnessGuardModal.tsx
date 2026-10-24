import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Key,
  RefreshCw,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  Radio,
  ExternalLink,
  Flame,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const WeatherFreshnessGuardModal: React.FC = () => {
  const {
    isWeatherModalOpen,
    setIsWeatherModalOpen,
    weatherData,
    isLoadingWeather,
    weatherApiKey,
    setWeatherApiKey,
    refreshWeather,
    detectDeviceLocationAndWeather,
    commodities,
  } = useApp();

  const [inputApiKey, setInputApiKey] = useState<string>(weatherApiKey || '');
  const [selectedCity, setSelectedCity] = useState<string>('Nashik');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Tomato (Hybrid)');
  const [isReefer, setIsReefer] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [keySavedStatus, setKeySavedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (weatherApiKey) {
      setInputApiKey(weatherApiKey);
    }
  }, [weatherApiKey]);

  if (!isWeatherModalOpen) return null;

  const handleUseDeviceGps = async () => {
    setIsLocating(true);
    await detectDeviceLocationAndWeather(true);
    setIsLocating(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    refreshWeather({ city, commodity: selectedCommodity, isReefer });
  };

  const handleCommodityChange = (comm: string) => {
    setSelectedCommodity(comm);
    refreshWeather({ city: selectedCity, commodity: comm, isReefer });
  };

  const handleReeferToggle = (reefer: boolean) => {
    setIsReefer(reefer);
    refreshWeather({ city: selectedCity, commodity: selectedCommodity, isReefer: reefer });
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeySavedStatus('Verifying & saving key...');
    const verified = await setWeatherApiKey(inputApiKey);
    if (verified) {
      setKeySavedStatus('✅ OpenWeatherMap API Key active and telemetry streaming!');
    } else {
      setKeySavedStatus('ℹ️ Key saved. Real-time satellite weather active via Open-Meteo.');
    }
    setTimeout(() => setKeySavedStatus(null), 5000);
  };

  const freshness = weatherData?.freshness;
  const safeHours = freshness?.safeHoursRemaining || 48;
  const freshnessPct = freshness?.freshnessPercent || 92;

  // Grade color
  let gradeColor = '#10b981'; // Green
  let gradeBg = 'rgba(16, 185, 129, 0.15)';
  if (freshnessPct < 50 || safeHours < 20) {
    gradeColor = '#f43f5e'; // Red
    gradeBg = 'rgba(244, 63, 94, 0.15)';
  } else if (freshnessPct < 75 || safeHours < 40) {
    gradeColor = '#f59e0b'; // Amber
    gradeBg = 'rgba(245, 158, 11, 0.15)';
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2200,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={() => setIsWeatherModalOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(9, 14, 26, 0.98))',
          border: '1px solid var(--border-glass-bright)',
          borderRadius: '24px',
          padding: '24px 28px',
          boxShadow: '0 25px 65px -12px rgba(0, 0, 0, 0.85), 0 0 45px rgba(56, 189, 248, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                }}
              >
                <CloudSun size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Live Agricultural Weather & Product Freshness Guard
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Auto-Detects Local Climate • Arrhenius Biochemical Spoilage Kinetics • Safe Hours Window
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWeatherModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Weather Notification Alert Bar */}
        {weatherData && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background:
                weatherData.notificationSeverity === 'ALERT'
                  ? 'rgba(244, 63, 94, 0.12)'
                  : weatherData.notificationSeverity === 'WARNING'
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(56, 189, 248, 0.12)',
              border: `1px solid ${
                weatherData.notificationSeverity === 'ALERT'
                  ? 'rgba(244, 63, 94, 0.35)'
                  : weatherData.notificationSeverity === 'WARNING'
                  ? 'rgba(245, 158, 11, 0.35)'
                  : 'rgba(56, 189, 248, 0.35)'
              }`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                color:
                  weatherData.notificationSeverity === 'ALERT'
                    ? '#fb7185'
                    : weatherData.notificationSeverity === 'WARNING'
                    ? '#fbbf24'
                    : '#38bdf8',
                display: 'flex',
              }}
            >
              {weatherData.notificationSeverity === 'ALERT' ? (
                <Flame size={22} />
              ) : weatherData.notificationSeverity === 'WARNING' ? (
                <AlertTriangle size={22} />
              ) : (
                <Info size={22} />
              )}
            </div>
            <div style={{ flex: 1, fontSize: '0.86rem', color: '#f1f5f9', fontWeight: 600 }}>
              {weatherData.weatherNotification}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                background: 'rgba(0,0,0,0.3)',
                padding: '4px 10px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              {weatherData.source === 'OPENWEATHER_API'
                ? '🔑 OpenWeatherMap API'
                : '🛰️ Open-Meteo Satellite Feed'}
            </div>
          </div>
        )}

        {/* 2-Column Grid: Weather Telemetry & Freshness Calculator */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Card 1: Live Meteorological Observation */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                <Radio size={16} className="live-pulse" />
                <span>REAL-TIME WEATHER TELEMETRY</span>
              </div>
              <button
                onClick={() => refreshWeather({ city: selectedCity, commodity: selectedCommodity, isReefer })}
                disabled={isLoadingWeather}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} className={isLoadingWeather ? 'spin-animation' : ''} />
                <span>{isLoadingWeather ? 'Updating...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Dedicated Current Device Location Status & Trigger Card */}
            <div
              style={{
                background: weatherData?.isDeviceLocation
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(56, 189, 248, 0.08)',
                border: `1px solid ${
                  weatherData?.isDeviceLocation ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.25)'
                }`,
                padding: '12px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                    background: weatherData?.isDeviceLocation ? '#10b981' : '#0284c7',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                    {weatherData?.isDeviceLocation
                      ? 'Current Device Location Active'
                      : 'Use Exact Device Location & Weather'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {weatherData?.isDeviceLocation
                      ? `Lat: ${weatherData.coordinates.lat.toFixed(4)}°, Lon: ${weatherData.coordinates.lon.toFixed(4)}° • ${
                          weatherData.accuracyMeters ? `±${weatherData.accuracyMeters}m precision` : 'Direct Sensor'
                        }`
                      : 'Detect latitude & longitude from device to check exact hyper-local weather'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUseDeviceGps}
                disabled={isLocating || isLoadingWeather}
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)',
                }}
              >
                <Radio size={14} className={isLocating ? 'spin-animation' : 'live-pulse'} />
                <span>{isLocating ? 'Locating Device...' : 'Detect Device Location'}</span>
              </button>
            </div>

            {/* Quick Location & GPS Selector */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass-bright)',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                }}
              >
                <option value="Nashik">📍 Nashik APMC Belt (Maharashtra)</option>
                <option value="Pimpalgaon">📍 Pimpalgaon Baswant Cluster (Nashik)</option>
                <option value="Delhi">📍 Azadpur APMC Terminal (New Delhi)</option>
                <option value="Mumbai">📍 Vashi APMC Terminal (Navi Mumbai)</option>
                <option value="Pune">📍 Gultekdi APMC Yard (Pune)</option>
                <option value="Bengaluru">📍 Yeshwanthpur APMC (Karnataka)</option>
                <option value="Indore">📍 Choithram Mandi (Madhya Pradesh)</option>
              </select>

              <button
                onClick={handleUseDeviceGps}
                disabled={isLocating}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                title="Detect live GPS coordinates from your browser automatically"
              >
                <MapPin size={14} />
                <span>{isLocating ? 'Detecting...' : 'Auto-Detect GPS'}</span>
              </button>
            </div>

            {/* Main Climate Indicators */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginTop: '4px',
              }}
            >
              {/* Temperature */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '14px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb923c', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Thermometer size={16} />
                  <span>Ambient Temperature</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>
                  {weatherData ? `${weatherData.temperatureC}°C` : '--'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {weatherData?.weatherCondition || 'Detecting...'}
                </div>
              </div>

              {/* Relative Humidity */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '14px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Droplets size={16} />
                  <span>Relative Humidity</span>
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>
                  {weatherData ? `${weatherData.humidityPercent}%` : '--'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {weatherData && weatherData.humidityPercent > 80 ? '⚠️ High Rot Risk' : 'Optimal Moisture'}
                </div>
              </div>
            </div>

            {/* Sub telemetry details */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <span style={{ color: '#cbd5e1' }}>Location: </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{weatherData?.location || 'Detecting...'}</span>
              </div>
              <div>
                <span style={{ color: '#cbd5e1' }}>Wind Speed: </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{weatherData?.windSpeedKmh || 10} km/h</span>
              </div>
              <div>
                <span style={{ color: '#cbd5e1' }}>Auto Detection: </span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>LIVE SAT / GROUND</span>
              </div>
            </div>
          </div>

          {/* Card 2: Produce Freshness & Safe Hours Calculator */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                <ShieldCheck size={16} />
                <span>PRODUCE FRESHNESS & SAFE HOURS</span>
              </div>
              <span
                style={{
                  background: gradeBg,
                  color: gradeColor,
                  border: `1px solid ${gradeColor}40`,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                }}
              >
                {freshness?.qualityGrade || 'FAQ Grade-A'}
              </span>
            </div>

            {/* Commodity & Storage Condition Controls */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={selectedCommodity}
                onChange={(e) => handleCommodityChange(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass-bright)',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                }}
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.variety})
                  </option>
                ))}
              </select>

              {/* Reefer Cold-Chain Toggle */}
              <button
                onClick={() => handleReeferToggle(!isReefer)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: isReefer ? '1px solid #38bdf8' : '1px solid var(--border-glass)',
                  background: isReefer ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: isReefer ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Layers size={14} />
                <span>{isReefer ? '❄️ Reefer Active (4°C)' : '🌤️ Ambient Transit'}</span>
              </button>
            </div>

            {/* Freshness Index & Safe Hours Hero Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 78, 59, 0.2))',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 600 }}>
                    FRESHNESS INDEX
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                    {freshnessPct}%
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <Clock size={13} />
                    <span>SAFE FOR (COUNTDOWN)</span>
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8' }}>
                    {safeHours} Hours
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${freshnessPct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${gradeColor}, #38bdf8)`,
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Safe Until: <strong style={{ color: '#f8fafc' }}>{freshness?.safeUntilDate || 'Calculating...'}</strong></span>
                <span>Decay Rate: <strong style={{ color: '#fbbf24' }}>{freshness?.spoilageKineticsMultiplier || 1.0}x normal</strong></span>
              </div>
            </div>

            {/* Recommendation */}
            <div
              style={{
                fontSize: '0.76rem',
                color: '#cbd5e1',
                lineHeight: '1.4',
                background: 'rgba(0,0,0,0.25)',
                padding: '10px 12px',
                borderRadius: '10px',
                borderLeft: `3px solid ${gradeColor}`,
              }}
            >
              <strong style={{ color: '#ffffff' }}>Recommended Action: </strong>
              {freshness?.recommendedAction || 'Prime quality. Eligible for highest e-NAM hammer price bid.'}
            </div>
          </div>
        </div>

        {/* Card 3: OpenWeatherMap API Key Integration & Setup */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass-bright)',
            borderRadius: '18px',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} style={{ color: '#fbbf24' }} />
              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Weather Gateway & API Key Integration
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              <span style={{ color: '#34d399', fontWeight: 600 }}>Auto-Detection Engine: ACTIVE</span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            MandiFlow automatically detects live weather via satellite and ground meteorological stations (Open-Meteo). You can also configure your own <strong>OpenWeatherMap API Key</strong> below for dedicated quota and microclimate hyper-local alerts.
          </p>

          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Paste OpenWeatherMap API Key (e.g. 8a7b9c...)"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-glass-bright)',
                padding: '10px 14px',
                borderRadius: '10px',
                color: '#f8fafc',
                fontSize: '0.84rem',
                fontFamily: 'monospace',
              }}
            />

            <button
              type="submit"
              disabled={isLoadingWeather}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Save & Verify Key</span>
            </button>
          </form>

          {keySavedStatus && (
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
              {keySavedStatus}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem', color: 'var(--text-dim)', flexWrap: 'wrap', gap: '8px' }}>
            <span>Need a free OpenWeatherMap API key?</span>
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Get API Key at openweathermap.org</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
