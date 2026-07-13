import React, { useState, useEffect } from 'react';
import type { Member, MembershipPlan, MemberStatus } from '../../types/schema';
import { useTenant } from '../../context/TenantContext';
import { X, Save, User, Mail, Phone, Key, Calendar, Tag, FileText } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
  onSave: (member: Member) => void;
}

const PLANS: MembershipPlan[] = [
  'Basic ($39/mo)',
  'Pro ($69/mo)',
  'VIP Unlimited ($119/mo)',
  'Day Pass ($15)'
];

const STATUSES: MemberStatus[] = ['Active', 'Warning', 'Suspended'];

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  onSave
}) => {
  const { activeGym } = useTenant();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<MembershipPlan>('Pro ($69/mo)');
  const [status, setStatus] = useState<MemberStatus>('Active');
  const [pinCode, setPinCode] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setEmail(memberToEdit.contactInfo.email);
      setPhone(memberToEdit.contactInfo.phone);
      setPlan(memberToEdit.membershipPlan);
      setStatus(memberToEdit.status);
      setPinCode(memberToEdit.pinCode);
      setNotes(memberToEdit.notes || '');
    } else {
      // Defaults for new member
      setName('');
      setEmail('');
      setPhone('+1 (555) ');
      setPlan('Pro ($69/mo)');
      setStatus('Active');
      // Generate random 4 digit pin
      setPinCode(Math.floor(1000 + Math.random() * 9000).toString());
      setNotes('');
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pinCode) {
      alert('Please fill in name, email, and a 4-digit PIN code.');
      return;
    }

    const savedMember: Member = {
      id: memberToEdit ? memberToEdit.id : `mem_${Date.now()}`,
      gymId: activeGym.id,
      name,
      contactInfo: { email, phone },
      joinDate: memberToEdit ? memberToEdit.joinDate : new Date().toISOString().split('T')[0],
      membershipPlan: plan,
      status,
      pinCode,
      qrCodeId: memberToEdit ? memberToEdit.qrCodeId : `qr-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${pinCode}`,
      avatarUrl: memberToEdit ? memberToEdit.avatarUrl : `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 80000000000)}?auto=format&fit=crop&w=120&q=80`,
      notes
    };

    onSave(savedMember);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content animate-scale-up">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {memberToEdit ? 'Edit Gym Member' : 'Register New Member'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <User size={15} />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Email & Phone Grid */}
          <div className="grid-cols-2" style={{ gap: 14 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <Mail size={15} />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <Phone size={15} />
                <span>Phone Number *</span>
              </label>
              <input
                type="text"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Membership Plan & Status Grid */}
          <div className="grid-cols-2" style={{ gap: 14 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <Tag size={15} />
                <span>Membership Plan *</span>
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as MembershipPlan)}
                className="input-field"
              >
                {PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <Calendar size={15} />
                <span>Billing Status Tag *</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemberStatus)}
                className="input-field"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'Active' ? '🟢 Active (Paid)' : s === 'Warning' ? '🟡 Warning (Due Soon)' : '🔴 Suspended (Unpaid)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PIN Code for Kiosk Check-In */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <Key size={15} />
              <span>Kiosk PIN Code (4 Digits) *</span>
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="4-digit code e.g. 1042"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="input-field"
              style={{ letterSpacing: '0.15em', fontWeight: 700 }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Used for rapid PIN entry at the check-in terminal.
            </span>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <FileText size={15} />
              <span>Notes & Preferences</span>
            </label>
            <textarea
              rows={3}
              placeholder="Medical notes, class preferences, or locker assignment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{memberToEdit ? 'Save Changes' : 'Create Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
