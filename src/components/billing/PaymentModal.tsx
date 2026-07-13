import React, { useState, useEffect } from 'react';
import type { Payment, PaymentStatus, PaymentMethod, Member } from '../../types/schema';
import { useTenant } from '../../context/TenantContext';
import { X, Save, DollarSign, Calendar, CreditCard, FileText, User } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMember?: Member | null;
  onSavePayment: (payment: Payment) => void;
}

const STATUSES: PaymentStatus[] = ['Paid', 'Pending', 'Due'];
const METHODS: PaymentMethod[] = ['Credit Card', 'Stripe Digital', 'Cash / POS', 'Bank Transfer'];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultMember,
  onSavePayment
}) => {
  const { activeGym, members } = useTenant();

  const [memberId, setMemberId] = useState<string>('');
  const [amount, setAmount] = useState<number>(69.00);
  const [status, setStatus] = useState<PaymentStatus>('Paid');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<PaymentMethod>('Credit Card');
  const [description, setDescription] = useState<string>('Pro Plan - Monthly Subscription');

  useEffect(() => {
    if (defaultMember) {
      setMemberId(defaultMember.id);
      // Derive default price from plan
      if (defaultMember.membershipPlan.includes('$119')) setAmount(119);
      else if (defaultMember.membershipPlan.includes('$39')) setAmount(39);
      else setAmount(69);
      setDescription(`${defaultMember.membershipPlan.split(' ')[0]} Plan - Payment Settlement`);
    } else if (members.length > 0) {
      setMemberId(members[0].id);
      setAmount(69);
      setDescription('Pro Plan - Monthly Subscription');
    }
  }, [defaultMember, isOpen, members]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      alert('Please select a member.');
      return;
    }

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      memberId,
      gymId: activeGym.id,
      amount: Number(amount),
      status,
      dueDate,
      paymentDate: status === 'Paid' ? new Date().toISOString() : null,
      description,
      method
    };

    onSavePayment(newPayment);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content animate-scale-up">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Log Manual / Digital Payment
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Member Selection */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <User size={15} />
              <span>Target Member *</span>
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="input-field"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.membershipPlan.split(' ')[0]} - Status: {m.status})
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Status Grid */}
          <div className="grid-cols-2" style={{ gap: 14 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <DollarSign size={15} />
                <span>Amount ({activeGym.currencySymbol}) *</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="input-field"
                style={{ fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>Transaction Status *</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="input-field"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s === 'Paid' ? '✅ Paid (Settle Account)' : s === 'Pending' ? '🟡 Pending Processing' : '🔴 Due Invoice'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Method & Due Date Grid */}
          <div className="grid-cols-2" style={{ gap: 14 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <CreditCard size={15} />
                <span>Payment Method *</span>
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="input-field"
              >
                {METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <Calendar size={15} />
                <span>Due / Settlement Date *</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <FileText size={15} />
              <span>Transaction Note / Invoice Details</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. July VIP Renewal Invoice #9910"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save & Update Member Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
