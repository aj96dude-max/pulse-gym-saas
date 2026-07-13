import React from 'react';
import { LayoutDashboard, Users, QrCode, CreditCard, Dumbbell, ShieldCheck } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface NavigationSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { activeGym, liveOccupancy } = useTenant();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members Database', icon: Users },
    { id: 'attendance', label: 'Check-In Kiosk (QR/PIN)', icon: QrCode, badge: liveOccupancy.length > 0 ? liveOccupancy.length : null },
    { id: 'billing', label: 'Financial & Billing', icon: CreditCard },
  ];

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--surface-card)',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      padding: '24px 16px',
      transition: 'all 0.3s ease'
    }} className="desktop-sidebar">
      {/* Logo & Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--primary) 0%, #FF6B35 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          boxShadow: 'var(--shadow-primary)'
        }}>
          <Dumbbell size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1 }}>
            Pulse<span style={{ color: 'var(--primary)' }}>Gym</span>
          </h1>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SaaS Engine v2.4
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 6px' }}>
          Menu & Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-main)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? 'var(--shadow-primary)' : 'none',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={20} style={{ opacity: isActive ? 1 : 0.75 }} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 99,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--primary-light)',
                  color: isActive ? '#FFF' : 'var(--primary-active)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Gym Profile Info Card */}
      <div style={{
        backgroundColor: 'var(--surface-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        border: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <img
            src={activeGym.logoUrl}
            alt={activeGym.gymName}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeGym.gymName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {activeGym.name}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Subscription:</span>
          <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
            <ShieldCheck size={12} /> {activeGym.subscriptionStatus}
          </span>
        </div>
      </div>
    </aside>
  );
};
