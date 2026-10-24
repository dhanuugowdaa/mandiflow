import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  X,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Headphones,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { SupportTicket } from '../../types';

export const HelpSupportModal: React.FC = () => {
  const { isHelpSupportOpen, setIsHelpSupportOpen, userSession, supportTickets, createSupportTicket, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'helpline' | 'raise_ticket' | 'my_tickets' | 'faq'>('helpline');

  // Ticket Form State
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('ESCROW_PAYMENT');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('HIGH');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDescription, setTicketDescription] = useState<string>('');
  const [ticketPhone, setTicketPhone] = useState<string>(userSession?.phone || '+91 98231 44021');

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isHelpSupportOpen) return null;

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      addToast('warning', 'Incomplete Form', 'Please fill in both the Subject and Description fields.');
      return;
    }

    const ticketId = createSupportTicket({
      category: ticketCategory,
      priority: ticketPriority,
      subject: ticketSubject.trim(),
      description: ticketDescription.trim(),
      contactPhone: ticketPhone.trim(),
    });

    setTicketSubject('');
    setTicketDescription('');
    setActiveTab('my_tickets');
  };

  const faqs = [
    {
      q: 'How does e-NAM direct bank escrow (PFMS) settlement work?',
      a: 'Once the auction hammer is struck on the e-NAM floor, the buyer deposit is locked in the digital escrow. Upon physical weighbridge receipt and assay verification at the APMC yard, funds are transferred directly to the farmer bank account via PFMS / RTGS within 4 hours without intermediary delays.',
    },
    {
      q: 'What is the acceptable weighbridge tolerance at APMC Mandi Gates?',
      a: 'Under the Model APMC Act standards, gross weighment discrepancies within ±2.0% of the consignment gate-pass weight are auto-cleared with a TOLERANCE_PASS badge. Any discrepancy exceeding ±2.0% triggers an alert for inspection to prevent shrinkage loss or fraudulent tare manipulation.',
    },
    {
      q: 'How does GRASP bin-packing compute fair Shapley freight savings for FPOs?',
      a: 'The GRASP algorithm evaluates multiple farmer harvest pledges, packing crates into refrigerated trucks while satisfying botanical ethylene isolation rules. Shapley marginal contribution distributes the freight economy proportionally, reducing individual transit costs by up to 28%.',
    },
    {
      q: 'How can truck drivers report a reefer temperature sensor fault in transit?',
      a: 'Drivers can tap the "Simulate Chamber Fault / Alert" button in the Truck Dashboard or call the 24x7 Logistics corridor helpline. The telematics IoT unit automatically transmits GPS coordinates and compartment temperature to the destination cold-chain team.',
    },
    {
      q: 'How is the AI fair reserve price floor calculated on e-NAM?',
      a: 'The engine runs multivariate regression on historical APMC modal price series, factoring in arrival supply elasticity (β₁), AGMARK grade quality premiums (β₂), and statutory mandi fee friction (β₃) to compute an optimal reserve price floor that prevents distress under-bidding.',
    },
  ];

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
      onClick={() => setIsHelpSupportOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          background: '#0d1527',
          border: '1px solid rgba(16, 185, 129, 0.35)',
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
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
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
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LifeBuoy size={22} color="#10b981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0 }}>
                  MandiFlow Kisan Helpdesk & 24x7 Support
                </h2>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  GOI INTEGRATED
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Ministry of Agriculture Kisan Call Center & APMC Logistics Grievance Redressal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHelpSupportOpen(false)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', borderRadius: '8px' }}
          >
            <X size={18} />
          </button>
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
            onClick={() => setActiveTab('helpline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'helpline' ? '2px solid #10b981' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'helpline' ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'helpline' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <Headphones size={15} />
            <span>24x7 Helplines</span>
          </button>

          <button
            onClick={() => setActiveTab('raise_ticket')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'raise_ticket' ? '2px solid #38bdf8' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'raise_ticket' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'raise_ticket' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <MessageSquare size={15} />
            <span>Raise Grievance / Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('my_tickets')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'my_tickets' ? '2px solid #fbbf24' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'my_tickets' ? '#fbbf24' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'my_tickets' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <FileText size={15} />
            <span>My Support Tickets ({supportTickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderBottom: activeTab === 'faq' ? '2px solid #a78bfa' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'faq' ? '#a78bfa' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'faq' ? 700 : 500,
              cursor: 'pointer',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
            }}
          >
            <HelpCircle size={15} />
            <span>Knowledge Base & FAQs</span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: 24x7 HELPLINES & APMC STATUS */}
          {activeTab === 'helpline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Kisan Call Center */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '20px',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        National Kisan Call Centre
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                        1800-180-1551
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px' }}>
                    Toll-free 24x7 government agricultural assistance in 22 regional Indian languages.
                  </p>
                  <a
                    href="tel:18001801551"
                    className="btn btn-emerald"
                    style={{ width: '100%', justifyContent: 'center', padding: '8px 14px', fontSize: '0.8rem' }}
                  >
                    <span>Call Kisan Helpline (Toll-Free)</span>
                  </a>
                </div>

                {/* MandiFlow APMC Operations Desk */}
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '20px',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Headphones size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        APMC Logistics & Escrow Desk
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                        +91 80 2345 6789
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px' }}>
                    Direct dispatch for weighbridge discrepancies, e-NAM bidding disputes, and cold-chain faults.
                  </p>
                  <a
                    href="tel:+918023456789"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '8px 14px', fontSize: '0.8rem', color: '#38bdf8', borderColor: '#38bdf8' }}
                  >
                    <span>Call APMC Operations Desk</span>
                  </a>
                </div>
              </div>

              {/* Live APMC Node Health Status */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '18px 20px',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Activity size={16} color="#34d399" />
                  <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', margin: 0 }}>
                    Integrated Infrastructure Live Status
                  </h4>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="live-pulse" style={{ background: '#34d399' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        e-NAM National Portal
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Operational (99.98%)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="live-pulse" style={{ background: '#34d399' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        PFMS Direct Escrow Gateway
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Instant Clearing Active</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="live-pulse" style={{ background: '#34d399' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        Agmarknet Price Feeds
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Synced Real-Time</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="live-pulse" style={{ background: '#34d399' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        WDRA e-NWR Repository
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Pledge Escrow Locked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RAISE A GRIEVANCE TICKET */}
          {activeTab === 'raise_ticket' && (
            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                Grievances submitted here generate an official audit-logged token under the DPDP Act 2023. Our APMC liaison officer will contact you within 30 minutes.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Grievance Category *
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as SupportTicket['category'])}
                    className="input-field"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                  >
                    <option value="ESCROW_PAYMENT">e-NAM Escrow / PFMS Bank Payout Delay</option>
                    <option value="WEIGHBRIDGE_TOLERANCE">APMC Mandi Weighbridge Tolerance Flag</option>
                    <option value="REEFER_COLD_CHAIN">Cold Storage / Reefer Chamber Temperature Alert</option>
                    <option value="ENAM_BIDDING">Bidding Ring / Auction Clearing Dispute</option>
                    <option value="MSP_FLOOR_PRICE">CACP MSP Floor Price Violation</option>
                    <option value="OTHER">General Logistics / Technical Assistance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Severity / Priority Level *
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as SupportTicket['priority'])}
                    className="input-field"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                  >
                    <option value="CRITICAL">🔴 Critical (Perishable Transit Risk / Loss)</option>
                    <option value="HIGH">🟠 High (Auction Hammer / Escrow Payment)</option>
                    <option value="MEDIUM">🟡 Medium (Weighment Variance / Gate Pass)</option>
                    <option value="LOW">🟢 Low (Information / General Inquiry)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Callback Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={ticketPhone}
                  onChange={(e) => setTicketPhone(e.target.value)}
                  placeholder="+91 98231 44021"
                  className="input-field"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Subject / Summary of Issue *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Weighbridge variance +2.4% flagged on Gate Pass GP-4091"
                  className="input-field"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Provide consignment details, vehicle registration number, APMC mandi yard, or lot number..."
                  className="input-field"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', color: '#f8fafc', padding: '10px 14px', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsHelpSupportOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.85rem', gap: '8px' }}
                >
                  <Send size={15} />
                  <span>Submit Support Ticket</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MY TICKETS LIST */}
          {activeTab === 'my_tickets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {supportTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                  No active support tickets found. Click "Raise Grievance / Ticket" if you need assistance.
                </div>
              ) : (
                supportTickets.map((t) => (
                  <div
                    key={t.ticketId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      padding: '16px 20px',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                          {t.ticketId}
                        </span>
                        <span
                          className={`badge ${
                            t.priority === 'CRITICAL' ? 'badge-rose' : t.priority === 'HIGH' ? 'badge-saffron' : 'badge-emerald'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {t.priority}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {t.category.replace('_', ' ')}
                        </span>
                      </div>

                      <span
                        className={`badge ${t.status === 'RESOLVED' ? 'badge-emerald' : 'badge-sky'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {t.status === 'RESOLVED' ? '✓ RESOLVED' : '● UNDER INVESTIGATION'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '4px' }}>
                      {t.subject}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px', margin: 0 }}>
                      {t.description}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', gap: '14px' }}>
                      <span>Lodged: {t.createdAt}</span>
                      <span>Callback: {t.contactPhone}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: KNOWLEDGE BASE & FAQS */}
          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        color: '#f8fafc',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          padding: '0 18px 16px 18px',
                          color: '#cbd5e1',
                          fontSize: '0.82rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
