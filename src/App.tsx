import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { NotificationToast } from './components/common/NotificationToast';
import { AccessDeniedGuard } from './components/common/AccessDeniedGuard';
import { LoginPortal } from './components/auth/LoginPortal';
import { SettingsModal } from './components/common/SettingsModal';
import { HelpSupportModal } from './components/common/HelpSupportModal';
import { FloatingSupportWidget } from './components/common/FloatingSupportWidget';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FpoDashboard } from './components/fpo/FpoDashboard';
import { EnamDashboard } from './components/enam/EnamDashboard';
import { MandiDashboard } from './components/mandi/MandiDashboard';
import { TruckDashboard } from './components/truck/TruckDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfitComparisonModal } from './components/common/ProfitComparisonModal';
import { SmsNotificationToast } from './components/common/SmsNotificationToast';
import { FlipkartDeliveryTracker } from './components/common/FlipkartDeliveryTracker';
import { WeatherFreshnessGuardModal } from './components/common/WeatherFreshnessGuardModal';
import { OrderHistoryStatementModal } from './components/common/OrderHistoryStatementModal';
import { RunDatasetModal } from './components/common/RunDatasetModal';

export const AppContent: React.FC = () => {
  const {
    isLoggedIn,
    currentRole,
    canAccessDashboard,
    isProfitModalOpen,
    setIsProfitModalOpen,
    isDeliveryTrackerModalOpen,
    setIsDeliveryTrackerModalOpen,
    isOrderHistoryModalOpen,
    setIsOrderHistoryModalOpen,
    isDatasetModalOpen,
    setIsDatasetModalOpen,
  } = useApp();

  // If user is not logged in or has no active role, show Login Portal!
  if (!isLoggedIn || currentRole === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NotificationToast />
        <SmsNotificationToast />
        <RunDatasetModal
          isOpen={isDatasetModalOpen}
          onClose={() => setIsDatasetModalOpen(false)}
        />
        <LoginPortal />
      </div>
    );
  }

  // Check if current authenticated user has clearance for the active dashboard
  const isAuthorized = canAccessDashboard(currentRole);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NotificationToast />
      <SmsNotificationToast />
      <SettingsModal />
      <HelpSupportModal />
      <FloatingSupportWidget />
      <WeatherFreshnessGuardModal />
      <ProfitComparisonModal
        isOpen={isProfitModalOpen}
        onClose={() => setIsProfitModalOpen(false)}
      />
      <OrderHistoryStatementModal
        isOpen={isOrderHistoryModalOpen}
        onClose={() => setIsOrderHistoryModalOpen(false)}
        onTrackOrder={() => {
          setIsOrderHistoryModalOpen(false);
          setIsDeliveryTrackerModalOpen(true);
        }}
      />
      <RunDatasetModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
      />
      {isDeliveryTrackerModalOpen && (
        <FlipkartDeliveryTracker
          isModal={true}
          onClose={() => setIsDeliveryTrackerModalOpen(false)}
        />
      )}
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {!isAuthorized ? (
          <AccessDeniedGuard attemptedRole={currentRole} />
        ) : (
          <>
            {currentRole === 'farmer' && <FarmerDashboard />}
            {currentRole === 'fpo' && <FpoDashboard />}
            {currentRole === 'enam' && <EnamDashboard />}
            {currentRole === 'mandi' && <MandiDashboard />}
            {currentRole === 'truck' && <TruckDashboard />}
            {currentRole === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(9, 13, 22, 0.95)',
          padding: '18px 24px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
        }}
      >
        <div style={{ maxWidth: '1700px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>MandiFlow v2.4</strong> — Unified Agricultural Logistics, Coalition Optimization & Real-Time APMC Mandi Intelligence.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>Zero-Trust RBAC Enforced</span>
            <span>•</span>
            <span>WDRA e-NWR Verified</span>
            <span>•</span>
            <span>Model APMC Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
