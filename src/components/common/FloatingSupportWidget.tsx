import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  PhoneCall,
  Settings,
  X,
  MessageSquare,
  HelpCircle,
  Headphones,
} from 'lucide-react';

export const FloatingSupportWidget: React.FC = () => {
  const { setIsHelpSupportOpen, setIsSettingsOpen } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      {/* Quick Menu Popover */}
      {isMenuOpen && (
        <div
          className="animate-fade-in glass-panel"
          style={{
            background: 'rgba(13, 21, 39, 0.96)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '240px',
            boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Quick Assistance Corner
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* 1. Open Full 24x7 Help & Support */}
          <button
            onClick={() => {
              setIsHelpSupportOpen(true);
              setIsMenuOpen(false);
            }}
            className="btn btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#34d399',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              gap: '8px',
            }}
          >
            <Headphones size={15} color="#10b981" />
            <span>Help & Support (24x7 Kisan Desk)</span>
          </button>

          {/* 2. Direct Call Kisan Toll-Free */}
          <a
            href="tel:18001801551"
            className="btn btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <PhoneCall size={15} color="#38bdf8" />
            <span>Call 1800-180-1551 (Toll-Free)</span>
          </a>

          {/* 3. Raise Ticket Directly */}
          <button
            onClick={() => {
              setIsHelpSupportOpen(true);
              setIsMenuOpen(false);
            }}
            className="btn btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#fbbf24',
              borderColor: 'rgba(251, 191, 36, 0.3)',
              gap: '8px',
            }}
          >
            <MessageSquare size={15} color="#fbbf24" />
            <span>Lodge Grievance / Ticket</span>
          </button>

          {/* 4. Open Settings */}
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setIsMenuOpen(false);
            }}
            className="btn btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              gap: '8px',
            }}
          >
            <Settings size={15} />
            <span>User Settings & Profile</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="24x7 Kisan Help & Support Desk"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          padding: '10px 18px',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.84rem',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.25s ease',
        }}
      >
        <span className="live-pulse" style={{ background: '#ffffff' }} />
        <Headphones size={18} />
        <span>24x7 Help & Support</span>
      </button>
    </div>
  );
};
