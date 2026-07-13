import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const RevenueChart: React.FC = () => {
  const { members, activeGym } = useTenant();

  // Membership Plan Distribution
  const planCounts = members.reduce((acc, curr) => {
    const plan = curr.membershipPlan.split(' ')[0]; // Basic, Pro, VIP
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMembers = members.length || 1;

  // Monthly Revenue Bars (Sample 6 months + Current July)
  const monthlyData = [
    { month: 'Feb', amount: 3420, height: 60 },
    { month: 'Mar', amount: 4100, height: 72 },
    { month: 'Apr', amount: 3890, height: 68 },
    { month: 'May', amount: 4850, height: 85 },
    { month: 'Jun', amount: 5200, height: 92 },
    { month: 'Jul (Current)', amount: 5940, height: 100, active: true },
  ];

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', animationDelay: '0.15s' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Financial & Membership Analytics
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Growth trajectory & plan distribution
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>
          <TrendingUp size={16} />
          <span>+22% YoY</span>
        </div>
      </div>

      {/* Monthly Revenue Bar Visualization */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
          6-Month Revenue Trend ({activeGym.currencySymbol})
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, paddingTop: 20, gap: 12 }}>
          {monthlyData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '75%',
                    height: `${d.height}%`,
                    backgroundColor: d.active ? 'var(--primary)' : '#E2E8F0',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  title={`${d.month}: ${activeGym.currencySymbol}${d.amount.toLocaleString()}`}
                >
                  {d.active && (
                    <span style={{
                      position: 'absolute',
                      top: -24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap'
                    }}>
                      {activeGym.currencySymbol}{(d.amount/1000).toFixed(1)}k
                    </span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: d.active ? 700 : 500, color: d.active ? 'var(--primary)' : 'var(--text-secondary)', marginTop: 8 }}>
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Plan Tier Breakdown */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Membership Tiers
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Total: {members.length} Members
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Pro Plan ($69/mo)', color: 'var(--primary)', count: planCounts['Pro'] || 0 },
            { label: 'VIP Unlimited ($119/mo)', color: '#10B981', count: planCounts['VIP'] || 0 },
            { label: 'Basic Plan ($39/mo)', color: '#6366F1', count: planCounts['Basic'] || 0 },
          ].map((tier, idx) => {
            const percentage = Math.round((tier.count / totalMembers) * 100);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: tier.color }} />
                    <span>{tier.label}</span>
                  </div>
                  <span>{tier.count} ({percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--surface-subtle)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: tier.color, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
