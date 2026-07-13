import React, { useState } from 'react';
import { Activity, LogOut, UserCheck, Clock, QrCode } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface LiveOccupancyTickerProps {
  onOpenKiosk: () => void;
}

export const LiveOccupancyTicker: React.FC<LiveOccupancyTickerProps> = ({ onOpenKiosk }) => {
  const { liveOccupancy, checkOutByMemberId, checkInByPin } = useTenant();
  const [quickPin, setQuickPin] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleQuickPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPin || quickPin.length < 4) {
      setFeedback({ type: 'error', text: 'Enter a valid 4-digit PIN' });
      return;
    }
    const res = checkInByPin(quickPin);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setQuickPin('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const getElapsedMinutes = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    return Math.max(1, Math.round(diffMs / 60000));
  };

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'var(--status-active-bg)',
            color: 'var(--status-active-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Live Gym Occupancy
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Real-time attendance & floor tracking
            </span>
          </div>
        </div>

        <button
          onClick={onOpenKiosk}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <QrCode size={15} />
          <span>Full Kiosk</span>
        </button>
      </div>

      {/* Quick PIN Entry Bar */}
      <form onSubmit={handleQuickPinSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          maxLength={4}
          placeholder="Enter 4-digit PIN to check in/out..."
          value={quickPin}
          onChange={(e) => setQuickPin(e.target.value.replace(/[^0-9]/g, ''))}
          className="input-field"
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.9rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <UserCheck size={16} />
          <span>Quick PIN</span>
        </button>
      </form>

      {feedback && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 16,
          fontSize: '0.85rem',
          fontWeight: 600,
          backgroundColor: feedback.type === 'success' ? 'var(--status-active-bg)' : 'var(--status-suspended-bg)',
          color: feedback.type === 'success' ? 'var(--status-active-text)' : 'var(--status-suspended-text)',
          border: `1px solid ${feedback.type === 'success' ? 'var(--status-active-border)' : 'var(--status-suspended-border)'}`
        }}>
          {feedback.text}
        </div>
      )}

      {/* Live Active Members List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {liveOccupancy.length === 0 ? (
          <div style={{
            padding: 32,
            textAlign: 'center',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Floor is currently quiet</p>
            <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Members checking in via PIN or QR code will appear here instantly.</p>
          </div>
        ) : (
          liveOccupancy.map(({ attendance, member }) => {
            const elapsed = getElapsedMinutes(attendance.checkInTime);
            return (
              <div
                key={attendance.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={member.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {member.name}
                      </span>
                      <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        Active
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      <span>Plan: {member.membershipPlan.split(' ')[0]}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--primary-hover)', fontWeight: 600 }}>
                        <Clock size={13} />
                        {elapsed} min on floor
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => checkOutByMemberId(member.id)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  title="Check Out Member"
                >
                  <LogOut size={14} />
                  <span>Check Out</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
