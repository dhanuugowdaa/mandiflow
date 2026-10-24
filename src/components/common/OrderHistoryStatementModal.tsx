import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Calendar,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Share2,
  FileText,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  X,
  CreditCard,
  ChevronRight,
  Star,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';
import { UserOrderHistoryRecord } from '../../types';

interface OrderHistoryStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export const OrderHistoryStatementModal: React.FC<OrderHistoryStatementModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  const { userOrderHistory, userSession, setIsDeliveryTrackerModalOpen, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_TRANSIT' | 'DELIVERED_PAID'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<UserOrderHistoryRecord | null>(null);

  if (!isOpen) return null;

  const orders = userOrderHistory?.orders || [];

  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (activeTab === 'IN_TRANSIT' && order.status !== 'IN_TRANSIT') return false;
    if (activeTab === 'DELIVERED_PAID' && order.status !== 'DELIVERED_PAID') return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchOrder =
        order.orderId.toLowerCase().includes(q) ||
        order.commodity.toLowerCase().includes(q) ||
        order.destinationMandi.toLowerCase().includes(q) ||
        order.ewayBill.toLowerCase().includes(q) ||
        order.driverName.toLowerCase().includes(q);
      if (!matchOrder) return false;
    }
    return true;
  });

  const handlePrintInvoice = () => {
    window.print();
    addToast('success', 'Printing Invoice', 'Official MandiFlow Settlement Receipt formatted for print/PDF.');
  };

  const handleDownloadFullStatement = () => {
    addToast(
      'success',
      'Account Statement Generated',
      `Full financial statement for ${userOrderHistory.farmerName} (${userOrderHistory.kisanId}) downloaded.`
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1d 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          color: '#f8fafc',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '18px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.18)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                FLIPKART STYLE MY ORDERS & CONSIGNMENT HISTORY
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Kisan ID: <strong style={{ color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{userOrderHistory?.kisanId || 'KA-KLR-2026-4402'}</strong>
              </span>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Sales & Order History Statement
            </h2>
            <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
              Farmer / Seller: <strong style={{ color: '#38bdf8' }}>{userOrderHistory?.farmerName || 'Rameshwar Patil'}</strong> • {userOrderHistory?.village || 'Pimpalgaon Baswant'} • Member since {userOrderHistory?.memberSince || 'August 2024'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDownloadFullStatement}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Download size={15} />
              <span>Download Statement</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lifetime Financial Statement Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Cumulative Financial Realization & Savings Statement
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              100% DIRECT DBT SETTLED TO BANK
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '14px',
            }}
          >
            {/* Stat 1: Total Credited to Bank */}
            <div style={{ background: 'rgba(2, 132, 199, 0.12)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: '#7dd3fc', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Credited to Bank Account
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
                ₹{userOrderHistory.bankAccount?.totalCreditedInr?.toLocaleString() || '4,10,350'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Direct DBT to {userOrderHistory.bankAccount?.bankName || 'SBI'} ({userOrderHistory.bankAccount?.accountNumberMasked || '•••• 4402'})
              </div>
            </div>

            {/* Stat 2: Total Savings vs Outside */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
              <div style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 800 }}>
                Total Money Saved vs Outside
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
                ₹{userOrderHistory?.totalCumulativeSavingsInr?.toLocaleString() || '28,497'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>
                +₹{userOrderHistory?.savingsBreakdown?.totalProfitBoostInr?.toLocaleString() || '44,297'} total profit boost (+22.8%)
              </div>
            </div>

            {/* Stat 3: Total Sales Gross & Escrow */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Gross Sales & Escrow
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                ₹{userOrderHistory?.totalSalesInr?.toLocaleString() || '5,32,330'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
                +₹{userOrderHistory?.bankAccount?.escrowPendingInr?.toLocaleString() || '1,06,700'} in escrow pending delivery
              </div>
            </div>

            {/* Stat 4: Volume & Average Price */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Volume & Realization
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                {userOrderHistory?.totalQuintalsDispatched || 165} Q <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>({((userOrderHistory?.totalQuintalsDispatched || 165) * 100).toLocaleString()} kg)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Avg net price: ₹{userOrderHistory?.averageNetPriceRealizedPerQ?.toLocaleString() || '3,226'}/Q across {userOrderHistory?.totalOrdersCount || 4} sales
              </div>
            </div>
          </div>

          {/* Bank Account Verification & Passbook Pill */}
          <div
            style={{
              marginTop: '14px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>🏦 Verified Bank Account:</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{userOrderHistory.bankAccount?.bankName || 'State Bank of India'}</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#94a3b8' }}>A/C: <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{userOrderHistory.bankAccount?.accountNumberMasked || '•••• 4402'}</strong></span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#94a3b8' }}>IFSC: <strong style={{ color: '#cbd5e1' }}>{userOrderHistory.bankAccount?.ifscCode || 'SBIN0001428'}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: '#a7f3d0' }}>
                Latest Credit: <strong style={{ color: '#34d399' }}>₹{userOrderHistory.bankAccount?.lastCreditAmountInr?.toLocaleString() || '1,01,650'}</strong> ({userOrderHistory.bankAccount?.lastCreditDate || '15 Oct 2026'})
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                UTR: {userOrderHistory.bankAccount?.lastUtrNumber || 'UTR-SBIN-20261015-88319'}
              </span>
            </div>
          </div>
        </div>

        {/* Flipkart Search & Tabs Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeTab === 'ALL' ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === 'ALL' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === 'ALL' ? '#ffffff' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Orders ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('IN_TRANSIT')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeTab === 'IN_TRANSIT' ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === 'IN_TRANSIT' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === 'IN_TRANSIT' ? '#ffffff' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Truck size={14} />
              <span>In Transit ({orders.filter((o) => o.status === 'IN_TRANSIT').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DELIVERED_PAID')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: activeTab === 'DELIVERED_PAID' ? '#059669' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === 'DELIVERED_PAID' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === 'DELIVERED_PAID' ? '#ffffff' : '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} />
              <span>Delivered & Paid ({orders.filter((o) => o.status === 'DELIVERED_PAID').length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search
              size={15}
              color="#94a3b8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by Order ID, crop, mandi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Orders List (Flipkart Style Cards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <Package size={40} style={{ opacity: 0.4, marginBottom: '10px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>No orders match your filter</div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try switching tabs or clearing your search term.</div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isInTransit = order.status === 'IN_TRANSIT';

              return (
                <div
                  key={order.orderId}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: isInTransit
                      ? '1px solid rgba(56, 189, 248, 0.45)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Status Indicator Bar on Left */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '4px',
                      background: isInTransit ? '#38bdf8' : '#10b981',
                    }}
                  />

                  {/* Top Bar of Order Card */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingBottom: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Order ID: <strong style={{ color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{order.orderId}</strong>
                      </span>
                      <span style={{ color: '#475569' }}>•</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        e-Way Bill: <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{order.ewayBill}</strong>
                      </span>
                      <span style={{ color: '#475569' }}>•</span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Booked: {order.date}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: isInTransit ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isInTransit ? '#38bdf8' : '#34d399',
                          border: `1px solid ${isInTransit ? 'rgba(56, 189, 248, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {isInTransit ? <Truck size={13} /> : <CheckCircle2 size={13} />}
                        <span>{order.statusDisplay}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Item Details */}
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                        {order.commodity}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '2px' }}>
                        Variety: {order.variety} • {order.qualityGrade}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px' }}>
                        Quantity: <strong style={{ color: '#f8fafc' }}>{order.quantityQuintals} Quintals</strong> ({order.quantityBags} Bags / {(order.quantityQuintals * 100).toLocaleString()} kg)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Freshness Index: <strong style={{ color: '#10b981' }}>{order.freshnessPercent}% Fresh</strong> (Arrhenius Kinetics verified)
                      </div>
                    </div>

                    {/* Route & Transporter */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Transit Route & Assigned Truck
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                        From: <strong>{order.originHub}</strong>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#34d399', marginTop: '2px' }}>
                        To: <strong>{order.destinationMandi}</strong>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '6px' }}>
                        Vehicle: <strong>{order.truckRegistration}</strong> • Driver: {order.driverName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
                        ★ {order.driverRating.toFixed(1)} Driver Service Rating
                      </div>
                    </div>

                    {/* Financial Settlement & Savings */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                          Net Realization
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                          ₹{order.netRealizationInr.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '3px' }}>
                        Sold at ₹{order.sellingPricePerQ.toLocaleString()}/Q (Gross: ₹{order.grossAmountInr.toLocaleString()})
                      </div>

                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.74rem',
                        }}
                      >
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                          +₹{order.totalSavedInr.toLocaleString()} MandiFlow Profit!
                        </span>
                        <span style={{ color: '#64748b' }}>
                          {order.dbtPaymentStatus === 'CREDITED_DBT' ? 'DBT Credited' : 'Escrow Secured'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar of Card */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      Bank Settlement: <strong style={{ color: '#cbd5e1' }}>{order.dbtBankName}</strong> ({order.dbtAccountNumberMasked}) • UTR: <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{order.dbtUtrNumber}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(order)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#cbd5e1',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <FileText size={14} />
                        <span>Mandi Invoice & Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onTrackOrder) {
                            onTrackOrder(order.orderId);
                          } else {
                            setIsDeliveryTrackerModalOpen(true);
                          }
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
                        }}
                      >
                        <Truck size={14} />
                        <span>Track Consignment</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Invoice & Mandi Settlement Slip Modal (Pop-up inside history) */}
        {selectedInvoiceOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 10001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedInvoiceOrder(null)}
          >
            <div
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '88vh',
                overflowY: 'auto',
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Invoice Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                    MANDIFLOW NATIONAL AGRI SETTLEMENT INVOICE
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Government of India APMC Model Act & e-NAM Statutory Tax Invoice
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} color="#475569" />
                </button>
              </div>

              {/* Invoice Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div>
                  <div><strong>Invoice No:</strong> {selectedInvoiceOrder.invoiceNumber}</div>
                  <div><strong>Order Ref:</strong> {selectedInvoiceOrder.orderId}</div>
                  <div><strong>e-Way Bill No:</strong> {selectedInvoiceOrder.ewayBill}</div>
                  <div><strong>Date:</strong> {selectedInvoiceOrder.date}</div>
                </div>
                <div>
                  <div><strong>Farmer Name:</strong> {userOrderHistory.farmerName}</div>
                  <div><strong>Kisan Credit ID:</strong> {userOrderHistory.kisanId}</div>
                  <div><strong>Settlement Mandi:</strong> {selectedInvoiceOrder.destinationMandi}</div>
                  <div><strong>Reefer Vehicle:</strong> {selectedInvoiceOrder.truckRegistration}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Commodity & Grade</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Weight</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate / Q</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <strong>{selectedInvoiceOrder.commodity}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{selectedInvoiceOrder.variety} • {selectedInvoiceOrder.qualityGrade}</div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{selectedInvoiceOrder.quantityQuintals} Quintals ({selectedInvoiceOrder.quantityBags} bags)</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>₹{selectedInvoiceOrder.sellingPricePerQ.toLocaleString()}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{selectedInvoiceOrder.grossAmountInr.toLocaleString()}</td>
                  </tr>

                  {/* Deduction: MandiFlow Shared Freight */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <td style={{ padding: '8px 10px' }}>Shared Reefer Transport (Coalition Rate)</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>100% Shared</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626' }}>-₹{selectedInvoiceOrder.transportCostInr.toLocaleString()}</td>
                  </tr>

                  {/* Profit Saved Highlight */}
                  <tr style={{ background: '#ecfdf5', color: '#047857' }}>
                    <td colSpan={3} style={{ padding: '8px 10px', fontWeight: 700 }}>
                      ✓ MandiFlow Shapley Logistics & Statutory Commission Savings
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800 }}>
                      +₹{selectedInvoiceOrder.totalSavedInr.toLocaleString()} Saved
                    </td>
                  </tr>

                  {/* Net Realization */}
                  <tr style={{ borderTop: '2px solid #0f172a', fontWeight: 800, fontSize: '0.95rem' }}>
                    <td colSpan={3} style={{ padding: '12px 10px' }}>NET AMOUNT CREDITED TO BANK (DBT)</td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', color: '#059669' }}>
                      ₹{selectedInvoiceOrder.netRealizationInr.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Bank Transfer Details */}
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', fontSize: '0.78rem', color: '#334155', marginBottom: '20px' }}>
                <div><strong>Direct Benefit Transfer (DBT):</strong> Electronic NEFT / RTGS Credit via RBI Settlement Corridor</div>
                <div><strong>Bank Name:</strong> {selectedInvoiceOrder.dbtBankName} ({selectedInvoiceOrder.dbtAccountNumberMasked})</div>
                <div><strong>Bank UTR Ref:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedInvoiceOrder.dbtUtrNumber}</span></div>
                <div><strong>Status:</strong> {selectedInvoiceOrder.dbtPaymentStatus === 'CREDITED_DBT' ? '✅ Payment Credited to Account' : '⏳ Escrow Locked (Settling on Mandi Delivery)'}</div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#e2e8f0',
                    border: 'none',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={15} />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
