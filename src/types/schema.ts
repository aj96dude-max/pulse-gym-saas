/**
 * PulseGym SaaS Core Database Entity Models
 * Strictly matches and extends the schema requirements of Section 3:
 * - Gym_Owner
 * - Member
 * - Attendance
 * - Payment
 */

export type SubscriptionStatus = 'Trial' | 'Active' | 'Enterprise' | 'Expired';

export interface GymOwner {
  id: string;
  name: string;
  gymName: string;
  email: string;
  passwordHash: string;
  subscriptionStatus: SubscriptionStatus;
  logoUrl?: string;
  currencySymbol: string;
  createdAt: string;
}

export type MembershipPlan = 
  | 'Basic ($39/mo)'
  | 'Pro ($69/mo)'
  | 'VIP Unlimited ($119/mo)'
  | 'Day Pass ($15)';

export type MemberStatus = 'Active' | 'Warning' | 'Suspended';

export interface Member {
  id: string;
  gymId: string;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  joinDate: string;
  membershipPlan: MembershipPlan;
  status: MemberStatus;
  pinCode: string;          // 4-digit PIN for rapid kiosk check-in
  qrCodeId: string;         // Unique UUID for QR scanner check-in
  avatarUrl?: string;
  notes?: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  gymId: string;
  checkInTime: string;      // ISO string or formatted time e.g. "08:15 AM"
  checkOutTime: string | null; // Null if currently in gym
  date: string;             // YYYY-MM-DD
  durationMinutes: number | null;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Due';

export type PaymentMethod = 'Credit Card' | 'Stripe Digital' | 'Cash / POS' | 'Bank Transfer';

export interface Payment {
  id: string;
  memberId: string;
  gymId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;          // YYYY-MM-DD
  paymentDate: string | null; // ISO date string when paid
  description: string;
  method: PaymentMethod;
}

// Aggregated View Type for UI Tables
export interface MemberWithDetails extends Member {
  lastCheckIn?: string;
  activeSession?: Attendance;
  pendingDueAmount?: number;
}
