import React from 'react';
import { DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const MetricCards: React.FC = () => {
  const { payments, members, activeGym } = useTenant();

  // 1. Total Monthly Revenue (Sum of all 'Paid' transactions)
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 2. Pending Payments (Sum and count of 'Due' or 'Pending' transactions not overdue > 14 days)
  const pendingPaymentsList = payments.filter(p => p.status === 'Due' || p.status === 'Pending');
  const pendingAmount = pendingPaymentsList.reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Overdue Accounts (Members with 'Suspended' status due to unpaid bills or > 14 days overdue)
  const overdueMembersCount = members.filter(m => m.status === 'Suspended').length;
  const warningMembersCount = members.filter(m => m.status === 'Warning').length;

  return (
    <div className="grid-cols-3" style={{ marginBottom: 28 }}>
      {/* Total Revenue Card */}
      <div className="card card-metric animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Revenue
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8, letterSpacing: '-0.03em' }}>
              {activeGym.currencySymbol}{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={26} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>
          <TrendingUp size={16} />
          <span>+14.2% from previous month</span>
        </div>
      </div>

      {/* Pending Payments Card */}
      <div className="card card-metric animate-fade-in" style={{ animationDelay: '0.1s', borderLeft: '4px solid var(--status-warning-text)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Payments
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8, letterSpacing: '-0.03em' }}>
              {activeGym.currencySymbol}{pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-warning-bg)',
            color: 'var(--status-warning-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={26} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: '0.82rem', color: 'var(--status-warning-text)', fontWeight: 600 }}>
          <span>{pendingPaymentsList.length} invoices due soon</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>{warningMembersCount} warning members</span>
        </div>
      </div>

      {/* Overdue Accounts Card */}
      <div className="card card-metric animate-fade-in" style={{ animationDelay: '0.2s', borderLeft: '4px solid var(--status-suspended-text)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overdue Accounts
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: overdueMembersCount > 0 ? 'var(--status-suspended-text)' : 'var(--text-main)', marginTop: 8, letterSpacing: '-0.03em' }}>
              {overdueMembersCount} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Suspended</span>
            </div>
          </div>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-suspended-bg)',
            color: 'var(--status-suspended-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={26} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: '0.82rem', color: 'var(--status-suspended-text)', fontWeight: 600 }}>
          <span>Requires immediate payment follow-up</span>
        </div>
      </div>
    </div>
  );
};
