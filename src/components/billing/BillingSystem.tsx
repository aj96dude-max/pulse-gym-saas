import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import type { Payment, Member } from '../../types/schema';
import { PaymentModal } from './PaymentModal';
import { MockDatabase } from '../../database/mockDatabase';
import { PlusCircle, CheckCircle, Search, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BillingSystemProps {
  initialMember?: Member | null;
  onClearInitialMember?: () => void;
}

export const BillingSystem: React.FC<BillingSystemProps> = ({
  initialMember,
  onClearInitialMember
}) => {
  const { payments, members, activeGym, refreshData } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending' | 'Due'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetMemberForModal, setTargetMemberForModal] = useState<Member | null>(initialMember || null);

  // If initialMember changes from parent, open modal directly
  React.useEffect(() => {
    if (initialMember) {
      setTargetMemberForModal(initialMember);
      setIsModalOpen(true);
    }
  }, [initialMember]);

  const handleSavePayment = (payment: Payment) => {
    MockDatabase.addPayment(payment);
    refreshData();
    if (payment.status === 'Paid') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    if (onClearInitialMember) onClearInitialMember();
  };

  const handleMarkAsPaid = (paymentId: string) => {
    MockDatabase.updatePaymentStatus(paymentId, 'Paid');
    refreshData();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const filteredPayments = payments.filter(pay => {
    const mem = members.find(m => m.id === pay.memberId);
    const matchesSearch =
      pay.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem && mem.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && pay.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Financial & Billing Center
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Manage manual and digital payment logs for <strong>{activeGym.gymName}</strong>. Automatic status tagging active.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetMemberForModal(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
          <span>Log New Transaction</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ marginBottom: 24, padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 460 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by member name or invoice description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
              <Filter size={14} /> Status:
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`filter-pill ${statusFilter === 'Paid' ? 'active' : ''}`}
            >
              Paid ({payments.filter(p => p.status === 'Paid').length})
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`filter-pill ${statusFilter === 'Pending' ? 'active' : ''}`}
            >
              Pending ({payments.filter(p => p.status === 'Pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('Due')}
              className={`filter-pill ${statusFilter === 'Due' ? 'active' : ''}`}
            >
              Due / Overdue ({payments.filter(p => p.status === 'Due').length})
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member / Invoice</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Payment Method</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No payment records found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredPayments.slice().reverse().map((pay) => {
                const mem = members.find(m => m.id === pay.memberId);
                const isPaid = pay.status === 'Paid';
                return (
                  <tr key={pay.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={mem?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={mem?.name || 'Member'}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                            {mem ? mem.name : 'Unknown Member'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {pay.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: isPaid ? '#10B981' : 'var(--status-suspended-text)' }}>
                        {activeGym.currencySymbol}{pay.amount.toFixed(2)}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${isPaid ? 'badge-active' : pay.status === 'Pending' ? 'badge-warning' : 'badge-suspended'}`}>
                        <span className="badge-dot" />
                        <span>{pay.status}</span>
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {new Date(pay.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {pay.method}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(pay.id)}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        >
                          <CheckCircle size={14} />
                          <span>Mark as Paid</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (onClearInitialMember) onClearInitialMember();
        }}
        defaultMember={targetMemberForModal}
        onSavePayment={handleSavePayment}
      />
    </div>
  );
};
