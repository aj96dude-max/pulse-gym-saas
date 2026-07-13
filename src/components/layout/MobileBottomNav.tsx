import React from 'react';
import { LayoutDashboard, Users, QrCode, CreditCard } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { liveOccupancy } = useTenant();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'attendance', label: 'Check-In', icon: QrCode, badge: liveOccupancy.length > 0 ? liveOccupancy.length : null },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--bottom-nav-height)',
      backgroundColor: 'var(--surface-card)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 60,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
    }} className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              flex: 1,
              height: '100%',
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'relative',
              padding: '4px 14px',
              borderRadius: 99,
              backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s ease'
            }}>
              <Icon size={22} />
              {item.badge !== null && item.badge !== undefined && (
                <span style={{
                  position: 'absolute',
                  top: -2,
                  right: 4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
