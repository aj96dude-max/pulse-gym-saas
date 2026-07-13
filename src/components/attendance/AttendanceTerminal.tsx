import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { QrCode, Grid, CheckCircle2, XCircle, Clock, Sparkles, UserCheck, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AttendanceHistory } from './AttendanceHistory';

export const AttendanceTerminal: React.FC = () => {
  const { activeGym, members, liveOccupancy, checkInByPin, checkInByQr } = useTenant();

  const [mode, setMode] = useState<'pin' | 'qr' | 'history'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string; memberName?: string; status?: string } | null>(null);

  // Trigger celebration confetti on check in
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFA07A', '#10B981', '#FF6B35', '#FFFFFF']
    });
  };

  const handleNumberClick = (num: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + num;
      setPinInput(next);
      if (next.length === 4) {
        // Auto submit on 4th digit
        processPinCheckIn(next);
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinInput('');
  };

  const processPinCheckIn = (pin: string) => {
    const res = checkInByPin(pin);
    if (res.success) {
      setFeedback({
        type: 'success',
        text: res.message,
        memberName: res.member?.name,
        status: res.member?.status
      });
      triggerCelebration();
      setPinInput('');
    } else {
      setFeedback({
        type: 'error',
        text: res.message,
        memberName: res.member?.name,
        status: res.member?.status
      });
      setPinInput('');
    }
  };

  const handleQrScanSimulation = (qrId: string) => {
    const res = checkInByQr(qrId);
    if (res.success) {
      setFeedback({
        type: 'success',
        text: res.message,
        memberName: res.member?.name,
        status: res.member?.status
      });
      triggerCelebration();
    } else {
      setFeedback({
        type: 'error',
        text: res.message,
        memberName: res.member?.name,
        status: res.member?.status
      });
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Check-In / Check-Out Kiosk
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Live attendance tracking for <strong>{activeGym.gymName}</strong> via PIN keypad entry or QR code scan.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: 8, backgroundColor: 'var(--surface-card)', padding: 6, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { setMode('pin'); setFeedback(null); }}
            className={`btn ${mode === 'pin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
          >
            <Grid size={16} />
            <span>PIN Keypad</span>
          </button>
          <button
            onClick={() => { setMode('qr'); setFeedback(null); }}
            className={`btn ${mode === 'qr' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
          >
            <QrCode size={16} />
            <span>QR Scanner Pass</span>
          </button>
          <button
            onClick={() => { setMode('history'); setFeedback(null); }}
            className={`btn ${mode === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}
          >
            <Clock size={16} />
            <span>Historical Logs</span>
          </button>
        </div>
      </div>

      {mode === 'history' ? (
        <AttendanceHistory />
      ) : (
        <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
          {/* Left Column: Interactive Kiosk Terminal (PIN Keypad / QR Scanner) */}
          <div className="card shadow-md animate-scale-up" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 480, margin: '0 auto', width: '100%' }}>
            {mode === 'pin' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <UserCheck size={30} />
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Member Touchscreen Terminal
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Enter your assigned 4-digit PIN to Check-In or Check-Out
                  </p>
                </div>

                {/* PIN Display Screen */}
                <div style={{
                  width: '100%',
                  height: 64,
                  backgroundColor: 'var(--surface-subtle)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  marginBottom: 24,
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)'
                }}>
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: pinInput[index] ? 'var(--primary)' : '#CED4DA',
                        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: pinInput[index] ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>

                {/* Keypad Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, width: '100%' }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleNumberClick(num)}
                      style={{
                        height: 64,
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--surface-card)',
                        border: '1.5px solid var(--border-color)',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      height: 64,
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1.5px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    CLEAR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNumberClick('0')}
                    style={{
                      height: 64,
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-card)',
                      border: '1.5px solid var(--border-color)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                      height: 64,
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1.5px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--status-suspended-text)',
                      cursor: 'pointer'
                    }}
                  >
                    DEL
                  </button>
                </div>
              </>
            ) : (
              /* QR Scanner Simulation Mode */
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <QrCode size={36} />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  QR Pass Scanner Terminal
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, marginBottom: 24 }}>
                  Scan digital membership cards or click below to simulate instant check-in pass.
                </p>

                {/* Simulated Scanner Viewport */}
                <div style={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed var(--primary)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: 24
                }}>
                  <Sparkles size={32} color="var(--primary)" style={{ marginBottom: 12 }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Scanner Optical Sensor Active
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Simulate scanning member QR codes below:
                  </span>
                </div>

                {/* Quick Simulation Buttons for Members */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', width: '100%' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Simulate Member QR Check-In / Out:
                  </span>
                  {members.slice(0, 5).map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleQrScanSimulation(m.qrCodeId)}
                      className="btn btn-secondary"
                      style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.85rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <QrCode size={16} color="var(--primary)" />
                        <span><strong>{m.name}</strong> ({m.membershipPlan.split(' ')[0]})</span>
                      </div>
                      <span className={`badge ${m.status === 'Active' ? 'badge-active' : 'badge-suspended'}`} style={{ fontSize: '0.7rem' }}>
                        {m.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terminal Feedback Overlay Banner */}
            {feedback && (
              <div style={{
                width: '100%',
                marginTop: 24,
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: feedback.type === 'success' ? 'var(--status-active-bg)' : 'var(--status-suspended-bg)',
                border: `1.5px solid ${feedback.type === 'success' ? 'var(--status-active-border)' : 'var(--status-suspended-border)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }} className="animate-fade-in">
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={24} color="var(--status-active-text)" style={{ flexShrink: 0 }} />
                ) : (
                  <XCircle size={24} color="var(--status-suspended-text)" style={{ flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: feedback.type === 'success' ? 'var(--status-active-text)' : 'var(--status-suspended-text)' }}>
                    {feedback.type === 'success' ? 'Check-In Confirmed!' : 'Check-In Alert'}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: 4 }}>
                    {feedback.text}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Floor Feed & Quick PIN Directory for Testing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={18} color="var(--status-active-text)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Live Floor Counter ({liveOccupancy.length})
                  </h3>
                </div>
                <span className="badge badge-active">Live Monitoring</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                {liveOccupancy.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No members checked in right now. Use the touchscreen PIN terminal on the left to test!
                  </div>
                ) : (
                  liveOccupancy.map(({ attendance, member }) => (
                    <div
                      key={attendance.id}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={member.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {member.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                            Checked in: {new Date(attendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                        In Gym
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Helper Directory of PIN codes for easy Testing */}
            <div className="card" style={{ backgroundColor: 'var(--primary-light)', borderColor: '#FFDBC8' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-active)', marginBottom: 10 }}>
                💡 Quick Test PIN Directory
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: 12 }}>
                Use these demo PIN codes on the keypad to test active check-ins vs suspended accounts:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {members.slice(0, 6).map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setMode('pin');
                      setPinInput(m.pinCode);
                      processPinCheckIn(m.pinCode);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: '#FFF',
                      border: '1px solid #FFC2A8',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to auto-test check-in with this PIN"
                  >
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.name.split(' ')[0]}
                    </span>
                    <strong style={{ color: m.status === 'Active' ? '#10B981' : m.status === 'Warning' ? '#D97706' : '#DC2626' }}>
                      {m.pinCode}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
