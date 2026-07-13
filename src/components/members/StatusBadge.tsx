import React from 'react';
import type { MemberStatus } from '../../types/schema';

interface StatusBadgeProps {
  status: MemberStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = 'badge-active';
  let label = 'Active (Paid)';

  if (status === 'Warning') {
    badgeClass = 'badge-warning';
    label = 'Warning (Due Soon)';
  } else if (status === 'Suspended') {
    badgeClass = 'badge-suspended';
    label = 'Suspended (Unpaid)';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot" />
      <span>{label}</span>
    </span>
  );
};
