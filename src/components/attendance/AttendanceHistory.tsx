import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { TrendingUp } from 'lucide-react';

export const AttendanceHistory: React.FC = () => {
  const { attendance, members } = useTenant();

  // Filter only completed historical logs where checkOutTime is not null, or all logs
  const completedSessions = attendance.filter(a => a.checkOutTime !== null && a.durationMinutes !== null);

  // Calculate Average Session Duration
  const totalDuration = completedSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const averageDurationMinutes = completedSessions.length > 0 ? Math.round(totalDuration / completedSessions.length) : 68;
  const averageHours = (averageDurationMinutes / 60).toFixed(1);

  return (
    <div className="animate-fade-in">
      {/* Historical KPI Summary Header */}
      <div className="grid-cols-3" style={{ marginBottom: 24 }}>
        <div className="card card-metric">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Average Session Duration
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
              {averageDurationMinutes} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>minutes</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
            <TrendingUp size={15} />
            <span>Approx. {averageHours} hrs average visit</span>
          </div>
        </div>

        <div className="card card-metric">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Total Logged Visits
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
              {attendance.length} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Check-Ins</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: '0.8rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
            <span>Across {members.length} registered members</span>
          </div>
        </div>

        <div className="card card-metric">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Peak Visiting Window
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
              5 - 8 <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>PM</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Highest traffic on Mon, Tue, Thu</span>
          </div>
        </div>
      </div>

      {/* Historical Logs Table */}
      <div className="table-container shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Date</th>
              <th>Check-In Time</th>
              <th>Check-Out Time</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No historical check-in logs recorded yet.
                </td>
              </tr>
            ) : (
              attendance.slice().reverse().map((log) => {
                const mem = members.find(m => m.id === log.memberId);
                const isLive = log.checkOutTime === null;
                return (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={mem?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={mem?.name || 'Member'}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {mem ? mem.name : 'Unknown Member'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            Plan: {mem ? mem.membershipPlan.split(' ')[0] : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {log.date}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td>
                      {isLive ? (
                        <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>
                          In Gym Now
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          {new Date(log.checkOutTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </td>

                    <td>
                      {isLive ? (
                        <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.88rem' }}>
                          Session in Progress
                        </span>
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {log.durationMinutes} minutes
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
