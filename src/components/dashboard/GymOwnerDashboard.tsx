import React from 'react';
import { MetricCards } from './MetricCards';
import { LiveOccupancyTicker } from './LiveOccupancyTicker';
import { RevenueChart } from './RevenueChart';
import { useTenant } from '../../context/TenantContext';
import { UserPlus, QrCode, CreditCard, ShieldAlert, ArrowRight } from 'lucide-react';

interface GymOwnerDashboardProps {
  onAddMember: () => void;
  onOpenKiosk: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GymOwnerDashboard: React.FC<GymOwnerDashboardProps> = ({
  onAddMember,
  onOpenKiosk,
  onNavigateTab
}) => {
  const { activeGym, members, payments } = useTenant();

  // Find overdue / warning members for quick resolution card
  const paymentDueMembers = members.filter(m => m.status === 'Warning' || m.status === 'Suspended');
  const recentPayments = payments.slice(-4).reverse();

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{activeGym.name.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Here’s what’s happening at <strong>{activeGym.gymName}</strong> today.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={onAddMember} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
            <UserPlus size={16} />
            <span>Add New Member</span>
          </button>
          <button onClick={onOpenKiosk} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
            <QrCode size={16} />
            <span>Attendance Kiosk</span>
          </button>
          <button onClick={() => onNavigateTab('billing')} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
            <CreditCard size={16} />
            <span>Log Payment</span>
          </button>
        </div>
      </div>

      {/* 1. Core Financial & Account Metrics */}
      <MetricCards />

      {/* 2. Live Occupancy Ticker & Analytics Chart Grid */}
      <div className="grid-cols-2" style={{ marginBottom: 28, alignItems: 'stretch' }}>
        <LiveOccupancyTicker onOpenKiosk={onOpenKiosk} />
        <RevenueChart />
      </div>

      {/* 3. Payment Due Quick Alert & Recent Transactions Grid */}
      <div className="grid-cols-2" style={{ alignItems: 'stretch' }}>
        {/* Payment Due Members Quick Alert */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={20} color="var(--status-suspended-text)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Requires Payment Action ({paymentDueMembers.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('members')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>View All Due</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {paymentDueMembers.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#10B981', fontWeight: 600 }}>
                🎉 All members are 100% up-to-date with payments!
              </div>
            ) : (
              paymentDueMembers.slice(0, 4).map(mem => (
                <div
                  key={mem.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: mem.status === 'Suspended' ? 'var(--status-suspended-bg)' : 'var(--status-warning-bg)',
                    border: `1px solid ${mem.status === 'Suspended' ? 'var(--status-suspended-border)' : 'var(--status-warning-border)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={mem.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={mem.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {mem.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: mem.status === 'Suspended' ? 'var(--status-suspended-text)' : 'var(--status-warning-text)', fontWeight: 600 }}>
                        Status: {mem.status} • {mem.membershipPlan.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('billing')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    Log Payment
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Financial Transactions Log */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 14, marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Transactions
            </h3>
            <button
              onClick={() => onNavigateTab('billing')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>Full History</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentPayments.map((pay) => {
              const mem = members.find(m => m.id === pay.memberId);
              const isPaid = pay.status === 'Paid';
              return (
                <div
                  key={pay.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {mem ? mem.name : 'Unknown Member'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {pay.description} • {pay.method}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isPaid ? '#10B981' : 'var(--status-suspended-text)' }}>
                      {isPaid ? '+' : ''}{activeGym.currencySymbol}{pay.amount.toFixed(2)}
                    </div>
                    <span className={`badge ${isPaid ? 'badge-active' : 'badge-suspended'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
