import React, { useState, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import type { Member } from '../../types/schema';
import { StatusBadge } from './StatusBadge';
import { MemberModal } from './MemberModal';
import { MockDatabase } from '../../database/mockDatabase';
import { Search, Filter, ArrowUpDown, UserPlus, Edit3, Trash2, QrCode, CreditCard, AlertCircle } from 'lucide-react';

interface MemberManagementProps {
  initialFilter?: string;
  onOpenPaymentForMember: (member: Member) => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  initialFilter = 'all',
  onOpenPaymentForMember
}) => {
  const { members, refreshData, liveOccupancy, checkInByPin } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [sortField, setSortField] = useState<'name' | 'joinDate' | 'status' | 'plan'>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Filter & Sort Logic
  const filteredAndSortedMembers = useMemo(() => {
    return members
      .filter(member => {
        // Search query
        const matchesSearch =
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.contactInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.contactInfo.phone.includes(searchQuery) ||
          member.pinCode.includes(searchQuery);

        if (!matchesSearch) return false;

        // Payment Due / Status Filter
        if (statusFilter === 'payment-due') {
          return member.status === 'Warning' || member.status === 'Suspended';
        }
        if (statusFilter === 'Active') return member.status === 'Active';
        if (statusFilter === 'Warning') return member.status === 'Warning';
        if (statusFilter === 'Suspended') return member.status === 'Suspended';

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'name') comp = a.name.localeCompare(b.name);
        else if (sortField === 'joinDate') comp = a.joinDate.localeCompare(b.joinDate);
        else if (sortField === 'plan') comp = a.membershipPlan.localeCompare(b.membershipPlan);
        else if (sortField === 'status') comp = a.status.localeCompare(b.status);

        return sortAsc ? comp : -comp;
      });
  }, [members, searchQuery, statusFilter, sortField, sortAsc]);

  const handleSort = (field: 'name' | 'joinDate' | 'status' | 'plan') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSaveMember = (member: Member) => {
    MockDatabase.saveMember(member);
    refreshData();
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to delete ${memberName}? This will also remove their check-in logs and billing records.`)) {
      MockDatabase.deleteMember(memberId);
      refreshData();
    }
  };

  const paymentDueCount = members.filter(m => m.status === 'Warning' || m.status === 'Suspended').length;

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Member Management & Directory
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Full CRUD database with payment status sorting, filtering, and instant check-in.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedMember(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <UserPlus size={18} />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ marginBottom: 24, padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 460 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search members by name, email, phone, or PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 42 }}
            />
          </div>

          {/* Filter Pills (Especially "Payment Due") */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
              <Filter size={14} /> Filter Status:
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All ({members.length})
            </button>

            {/* SPECIAL REQUESTED FILTER: "Payment Due" */}
            <button
              onClick={() => setStatusFilter('payment-due')}
              className={`filter-pill ${statusFilter === 'payment-due' ? 'active' : ''}`}
              style={{
                backgroundColor: statusFilter === 'payment-due' ? 'var(--status-suspended-bg)' : 'transparent',
                color: statusFilter === 'payment-due' ? 'var(--status-suspended-text)' : 'var(--status-suspended-text)',
                borderColor: 'var(--status-suspended-border)',
                fontWeight: 700
              }}
              title="Filter by members whose payment is due soon (Warning) or overdue (Suspended)"
            >
              ⚠️ Payment Due ({paymentDueCount})
            </button>

            <button
              onClick={() => setStatusFilter('Active')}
              className={`filter-pill ${statusFilter === 'Active' ? 'active' : ''}`}
            >
              Active Paid ({members.filter(m => m.status === 'Active').length})
            </button>

            <button
              onClick={() => setStatusFilter('Warning')}
              className={`filter-pill ${statusFilter === 'Warning' ? 'active' : ''}`}
            >
              Warning ({members.filter(m => m.status === 'Warning').length})
            </button>

            <button
              onClick={() => setStatusFilter('Suspended')}
              className={`filter-pill ${statusFilter === 'Suspended' ? 'active' : ''}`}
            >
              Suspended ({members.filter(m => m.status === 'Suspended').length})
            </button>
          </div>
        </div>
      </div>

      {/* Sortable Table Container */}
      <div className="table-container shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ width: '28%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Member Details</span>
                  <ArrowUpDown size={14} style={{ opacity: sortField === 'name' ? 1 : 0.4 }} />
                </div>
              </th>
              <th onClick={() => handleSort('status')} style={{ width: '18%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Payment Status</span>
                  <ArrowUpDown size={14} style={{ opacity: sortField === 'status' ? 1 : 0.4 }} />
                </div>
              </th>
              <th onClick={() => handleSort('plan')} style={{ width: '20%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Membership Plan</span>
                  <ArrowUpDown size={14} style={{ opacity: sortField === 'plan' ? 1 : 0.4 }} />
                </div>
              </th>
              <th onClick={() => handleSort('joinDate')} style={{ width: '14%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Join Date</span>
                  <ArrowUpDown size={14} style={{ opacity: sortField === 'joinDate' ? 1 : 0.4 }} />
                </div>
              </th>
              <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMembers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>No members found matching criteria</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing the search query or changing the payment due filter.</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedMembers.map((member) => {
                const isCheckedIn = liveOccupancy.some(l => l.member.id === member.id);
                return (
                  <tr key={member.id}>
                    {/* Member Details */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={member.name}
                          style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{member.name}</span>
                            {isCheckedIn && (
                              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, backgroundColor: '#10B981', color: '#FFF', fontWeight: 800 }}>
                                IN GYM NOW
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {member.contactInfo.email} • PIN: <strong style={{ color: 'var(--primary-active)' }}>{member.pinCode}</strong>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <StatusBadge status={member.status} />
                    </td>

                    {/* Membership Plan */}
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {member.membershipPlan}
                      </span>
                    </td>

                    {/* Join Date */}
                    <td>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        {/* Quick Check-In / Out Toggle */}
                        <button
                          onClick={() => {
                            const res = checkInByPin(member.pinCode);
                            alert(res.message);
                          }}
                          className={`btn ${isCheckedIn ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          title={isCheckedIn ? 'Check Out of Gym' : 'Check In to Gym'}
                        >
                          <QrCode size={14} />
                          <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
                        </button>

                        {/* Quick Payment Log */}
                        <button
                          onClick={() => onOpenPaymentForMember(member)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem', color: member.status !== 'Active' ? 'var(--status-suspended-text)' : 'var(--text-main)' }}
                          title="Log / Settle Payment"
                        >
                          <CreditCard size={14} />
                        </button>

                        {/* Edit Member */}
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="Edit Member Details"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Delete Member */}
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem', color: 'var(--status-suspended-text)' }}
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberToEdit={selectedMember}
        onSave={handleSaveMember}
      />
    </div>
  );
};
