import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  LogOut,
  FileCheck,
  AlertOctagon,
} from 'lucide-react';

interface AccessDeniedGuardProps {
  attemptedRole: UserRole;
}

export const AccessDeniedGuard: React.FC<AccessDeniedGuardProps> = ({ attemptedRole }) => {
  const { userSession, setCurrentRole, logoutUser, addToast, addAuditLog } = useApp();

  const handleReturnToAllowed = () => {
    if (userSession) {
      setCurrentRole(userSession.role);
    }
  };

  const handleRequestClearance = () => {
    addToast(
      'warning',
      'Clearance Request Filed',
      `Authorization request for ${attemptedRole.toUpperCase()} logged with APMC Platform Administrator.`
    );
    addAuditLog(
      'ACCESS_REQUEST_DENIED',
      `User ${userSession?.name} (${userSession?.role}) attempted unauthorized access to ${attemptedRole.toUpperCase()} dashboard. Request submitted for audit review.`,
      'DPDP_ACT_2023'
    );
  };

  const getRoleTitle = (r: UserRole) => {
    switch (r) {
      case 'farmer': return 'Farmer Portal (Kisan Seva)';
      case 'fpo': return 'FPO Aggregation Console';
      case 'enam': return 'e-NAM National Trade Hub';
      case 'mandi': return 'APMC Mandi Yard & Weighbridge';
      case 'truck': return 'Truck & Reefer Fleet Logistics';
      case 'admin': return 'Platform Administrator & Governance';
    }
  };

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '36px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 63, 94, 0.2)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1.5px solid #f43f5e',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 25px rgba(244, 63, 94, 0.3)',
          }}
        >
          <AlertOctagon size={34} color="#fb7185" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span className="badge badge-rose" style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
            HTTP 403 • ACCESS RESTRICTED
          </span>
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '10px' }}>
          Restricted Stakeholder Clearance
        </h2>

        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '22px' }}>
          You do not have authorization to view or operate the{' '}
          <strong style={{ color: '#fb7185' }}>{getRoleTitle(attemptedRole)}</strong>.
          Under statutory APMC regulations and DPDP Act 2023 guidelines, stakeholder data is strictly segregated.
        </p>

        {/* Security Session Info Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Authenticated User:</span>
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{userSession?.name || 'Unauthenticated'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assigned Role:</span>
            <span style={{ fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
              {userSession?.role || 'None'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Clearance Tier:</span>
            <span className="mono-text" style={{ color: '#fbbf24' }}>{userSession?.clearanceLevel || 'NO_CLEARANCE'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Permitted Portals:</span>
            <span style={{ color: '#38bdf8' }}>
              {userSession?.permittedDashboards.map((d) => d.toUpperCase()).join(', ') || 'None'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Session Audit Hash:</span>
            <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {userSession?.tokenSha256 || 'None'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleReturnToAllowed}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to {userSession?.role.toUpperCase()} Dashboard</span>
          </button>

          <button
            onClick={handleRequestClearance}
            className="btn btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.88rem' }}
          >
            <FileCheck size={16} />
            <span>File Clearance Request</span>
          </button>

          <button
            onClick={logoutUser}
            className="btn btn-secondary"
            style={{
              padding: '10px 16px',
              fontSize: '0.88rem',
              color: '#fb7185',
              borderColor: 'rgba(244, 63, 94, 0.3)',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
