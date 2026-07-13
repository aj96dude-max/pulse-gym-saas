import React from 'react';
import { Building2, Activity, PlusCircle, RotateCcw } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface HeaderBarProps {
  onAddMemberClick: () => void;
  onOpenCheckInKiosk: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onAddMemberClick, onOpenCheckInKiosk }) => {
  const { gymOwners, activeGym, switchGym, liveOccupancy, resetDatabase } = useTenant();

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }} className="header-bar">
      {/* Left: Tenant Switcher / Gym Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          <Building2 size={18} color="var(--primary)" />
          <span className="hide-on-mobile">Active Gym Profile:</span>
        </div>
        <select
          value={activeGym.id}
          onChange={(e) => switchGym(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-color)',
            backgroundColor: 'var(--surface-subtle)',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.95rem',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {gymOwners.map(owner => (
            <option key={owner.id} value={owner.id}>
              🏢 {owner.gymName} ({owner.name})
            </option>
          ))}
        </select>
      </div>

      {/* Right: Live Status & Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Live Occupancy Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 99,
          backgroundColor: liveOccupancy.length > 0 ? 'var(--status-active-bg)' : 'var(--surface-subtle)',
          border: `1px solid ${liveOccupancy.length > 0 ? 'var(--status-active-border)' : 'var(--border-color)'}`,
          color: liveOccupancy.length > 0 ? 'var(--status-active-text)' : 'var(--text-secondary)',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: liveOccupancy.length > 0 ? 'var(--status-active-text)' : '#CED4DA',
            display: 'inline-block',
            boxShadow: liveOccupancy.length > 0 ? '0 0 8px #10B981' : 'none'
          }} />
          <Activity size={16} />
          <span>{liveOccupancy.length} Active in Gym</span>
        </div>

        {/* Quick Kiosk Button */}
        <button
          onClick={onOpenCheckInKiosk}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          title="Open Attendance PIN / QR Scanner Kiosk"
        >
          ⏱ Check-In Kiosk
        </button>

        {/* Quick Add Member Button */}
        <button
          onClick={onAddMemberClick}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <PlusCircle size={17} />
          <span>Add Member</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={resetDatabase}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
          title="Reset to initial seed data"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
};
