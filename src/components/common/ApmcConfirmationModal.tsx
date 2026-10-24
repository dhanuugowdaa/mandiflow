import React from 'react';
import { useApp } from '../../context/AppContext';
import { FarmerPledge } from '../../types';
import {
  Landmark,
  CheckCircle2,
  XCircle,
  Truck,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  X,
  Scale,
} from 'lucide-react';

interface ApmcConfirmationModalProps {
  pledge?: FarmerPledge | null;
  isEmbedded?: boolean;
  onClose?: () => void;
}

export const ApmcConfirmationModal: React.FC<ApmcConfirmationModalProps> = ({
  pledge: propPledge,
  isEmbedded = false,
  onClose,
}) => {
  const {
    activeApmcConfirmationModal,
    setActiveApmcConfirmationModal,
    pendingApmcConfirmations,
    acceptApmcDispatch,
    rejectApmcDispatch,
  } = useApp();

  // Use either the passed pledge, active modal pledge, or first pending confirmation
  const targetPledge = propPledge || activeApmcConfirmationModal || pendingApmcConfirmations[0];

  if (!targetPledge) return null;

  const handleAccept = () => {
    acceptApmcDispatch(targetPledge.id);
    if (onClose) onClose();
  };

  const handleReject = () => {
    rejectApmcDispatch(targetPledge.id);
    if (onClose) onClose();
  };

  const content = (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(10, 15, 26, 0.98))',
        border: '1px solid rgba(244, 63, 94, 0.45)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(244, 63, 94, 0.25)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#f8fafc',
        width: '100%',
        maxWidth: isEmbedded ? '100%' : '720px',
        position: 'relative',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Landmark size={24} color="#f43f5e" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                APMC Inbound Dispatch Confirmation
              </h3>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#fb7185',
                }}
              >
                ACTION REQUIRED
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Farmer is ready to sell and dispatch harvest. Accept product to connect Reefer Truck Driver for farm collection.
            </p>
          </div>
        </div>

        {!isEmbedded && (
          <button
            type="button"
            onClick={() => {
              setActiveApmcConfirmationModal(null);
              if (onClose) onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Lot Summary Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {/* Farmer Info */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>
            <Sprout size={14} />
            <span>FARMER / DISPATCHER</span>
          </div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
            {targetPledge.farmerName}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={12} /> {targetPledge.farmerPhone}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {targetPledge.locationVillage}, {targetPledge.district}
          </div>
        </div>

        {/* Cargo & Lot */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
            <Scale size={14} />
            <span>PRODUCE & QUANTITY</span>
          </div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
            {targetPledge.commodity}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
            {targetPledge.quantityQuintals} Q ({targetPledge.quantityKg.toLocaleString()} kg)
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Lot: <strong>{targetPledge.id}</strong> • Expected: ₹{targetPledge.expectedRealizationPerQ}/Q
          </div>
        </div>

        {/* Assigned Reefer Truck */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#a78bfa', fontWeight: 700, marginBottom: '6px' }}>
            <Truck size={14} />
            <span>CONNECTING LOGISTICS</span>
          </div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
            TRK-8921 (16T Reefer)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#c4b5fd', marginTop: '2px' }}>
            Driver: <strong>Sukhdev Singh</strong>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Gate: <strong>Azadpur APMC Bay #04</strong>
          </div>
        </div>
      </div>

      {/* Compliance / Assaying check note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          marginBottom: '22px',
          fontSize: '0.78rem',
          color: '#6ee7b7',
        }}
      >
        <ShieldCheck size={18} color="#34d399" />
        <span>
          <strong>APMC Model Act Pre-Assay Verified:</strong> Price ₹{targetPledge.expectedRealizationPerQ}/Q satisfies CACP MSP floor. Digital Weighbridge Gate Pass will be generated upon confirmation.
        </span>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={handleReject}
          className="btn btn-secondary"
          style={{
            padding: '11px 18px',
            fontSize: '0.86rem',
            color: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <XCircle size={16} />
          <span>Decline / Require Re-Assay</span>
        </button>

        <button
          type="button"
          onClick={handleAccept}
          className="btn btn-primary"
          style={{
            padding: '11px 24px',
            fontSize: '0.92rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Accept Product & Connect Reefer Truck</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActiveApmcConfirmationModal(null);
          if (onClose) onClose();
        }
      }}
    >
      {content}
    </div>
  );
};
