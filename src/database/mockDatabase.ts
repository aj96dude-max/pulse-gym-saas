import type { GymOwner, Member, Attendance, Payment } from '../types/schema';

const STORAGE_KEY_GYMS = 'pulsegym_gym_owners_v1';
const STORAGE_KEY_MEMBERS = 'pulsegym_members_v1';
const STORAGE_KEY_ATTENDANCE = 'pulsegym_attendance_v1';
const STORAGE_KEY_PAYMENTS = 'pulsegym_payments_v1';

// Pre-seeded Multi-Tenant Gym Profiles
const SEED_GYMS: GymOwner[] = [
  {
    id: 'gym_apex_101',
    name: 'Marcus Vance',
    gymName: 'Apex Fitness Studio',
    email: 'marcus@apexfitness.io',
    passwordHash: '$2b$10$apex_hashed_pwd_9981',
    subscriptionStatus: 'Active',
    currencySymbol: '$',
    logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'gym_iron_202',
    name: 'Elena Rostova',
    gymName: 'Iron Core Athletics',
    email: 'elena@ironcore.gym',
    passwordHash: '$2b$10$iron_hashed_pwd_4412',
    subscriptionStatus: 'Enterprise',
    currencySymbol: '$',
    logoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=150&q=80',
    createdAt: '2025-03-01T10:30:00Z',
  }
];

// Pre-seeded Members for Apex Fitness Studio (gym_apex_101) & Iron Core (gym_iron_202)
const SEED_MEMBERS: Member[] = [
  // Apex Fitness Studio Members
  {
    id: 'mem_01',
    gymId: 'gym_apex_101',
    name: 'Sarah Jenkins',
    contactInfo: { email: 'sarah.j@gmail.com', phone: '+1 (555) 234-5678' },
    joinDate: '2025-02-10',
    membershipPlan: 'Pro ($69/mo)',
    status: 'Active',
    pinCode: '1042',
    qrCodeId: 'qr-sarah-jenkins-1042',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    notes: 'Prefers morning spin classes.'
  },
  {
    id: 'mem_02',
    gymId: 'gym_apex_101',
    name: 'Liam O’Connor',
    contactInfo: { email: 'liam.oconnor@yahoo.com', phone: '+1 (555) 876-5432' },
    joinDate: '2025-01-20',
    membershipPlan: 'VIP Unlimited ($119/mo)',
    status: 'Warning',
    pinCode: '8812',
    qrCodeId: 'qr-liam-oconnor-8812',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    notes: 'Personal training scheduled Mondays.'
  },
  {
    id: 'mem_03',
    gymId: 'gym_apex_101',
    name: 'Maya Lin',
    contactInfo: { email: 'maya.lin@designstudio.co', phone: '+1 (555) 345-6789' },
    joinDate: '2025-04-01',
    membershipPlan: 'Basic ($39/mo)',
    status: 'Active',
    pinCode: '3341',
    qrCodeId: 'qr-maya-lin-3341',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'mem_04',
    gymId: 'gym_apex_101',
    name: 'Devon Thorne',
    contactInfo: { email: 'dthorne@techpulse.io', phone: '+1 (555) 901-2345' },
    joinDate: '2024-11-15',
    membershipPlan: 'Pro ($69/mo)',
    status: 'Suspended',
    pinCode: '9901',
    qrCodeId: 'qr-devon-thorne-9901',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    notes: 'Account suspended due to two failed credit card attempts.'
  },
  {
    id: 'mem_05',
    gymId: 'gym_apex_101',
    name: 'Chlöe Ramirez',
    contactInfo: { email: 'chloe.r@live.com', phone: '+1 (555) 456-7890' },
    joinDate: '2025-05-12',
    membershipPlan: 'VIP Unlimited ($119/mo)',
    status: 'Active',
    pinCode: '7721',
    qrCodeId: 'qr-chloe-ramirez-7721',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'mem_06',
    gymId: 'gym_apex_101',
    name: 'Aiden Vance',
    contactInfo: { email: 'aiden.v@gmail.com', phone: '+1 (555) 654-3210' },
    joinDate: '2025-03-18',
    membershipPlan: 'Basic ($39/mo)',
    status: 'Warning',
    pinCode: '4519',
    qrCodeId: 'qr-aiden-vance-4519',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
  },
  // Iron Core Athletics Members
  {
    id: 'mem_iron_01',
    gymId: 'gym_iron_202',
    name: 'Viktor Dragov',
    contactInfo: { email: 'v.dragov@power.ru', phone: '+1 (555) 111-2233' },
    joinDate: '2025-01-05',
    membershipPlan: 'VIP Unlimited ($119/mo)',
    status: 'Active',
    pinCode: '0001',
    qrCodeId: 'qr-viktor-dragov-0001',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'mem_iron_02',
    gymId: 'gym_iron_202',
    name: 'Amara Kalu',
    contactInfo: { email: 'amara.k@fitlife.org', phone: '+1 (555) 444-5566' },
    joinDate: '2025-02-28',
    membershipPlan: 'Pro ($69/mo)',
    status: 'Suspended',
    pinCode: '5544',
    qrCodeId: 'qr-amara-kalu-5544',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  }
];

// Pre-seeded Attendance Logs (Including live check-ins right now where checkOutTime is null)
const SEED_ATTENDANCE: Attendance[] = [
  // Live checked-in members at Apex right now
  {
    id: 'att_live_1',
    memberId: 'mem_01',
    gymId: 'gym_apex_101',
    checkInTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    checkOutTime: null,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: null
  },
  {
    id: 'att_live_2',
    memberId: 'mem_05',
    gymId: 'gym_apex_101',
    checkInTime: new Date(Date.now() - 72 * 60000).toISOString(), // 72 mins ago
    checkOutTime: null,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: null
  },
  {
    id: 'att_live_3',
    memberId: 'mem_03',
    gymId: 'gym_apex_101',
    checkInTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    checkOutTime: null,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: null
  },
  // Historical check-outs earlier today or yesterday
  {
    id: 'att_hist_1',
    memberId: 'mem_02',
    gymId: 'gym_apex_101',
    checkInTime: '2025-07-13T06:30:00Z',
    checkOutTime: '2025-07-13T07:45:00Z',
    date: '2025-07-13',
    durationMinutes: 75
  },
  {
    id: 'att_hist_2',
    memberId: 'mem_01',
    gymId: 'gym_apex_101',
    checkInTime: '2025-07-12T08:00:00Z',
    checkOutTime: '2025-07-12T09:10:00Z',
    date: '2025-07-12',
    durationMinutes: 70
  },
  {
    id: 'att_hist_3',
    memberId: 'mem_iron_01',
    gymId: 'gym_iron_202',
    checkInTime: new Date(Date.now() - 30 * 60000).toISOString(),
    checkOutTime: null,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: null
  }
];

// Pre-seeded Payments (Capturing Paid, Due soon, and Overdue / Suspended amounts)
const SEED_PAYMENTS: Payment[] = [
  // Paid transactions
  {
    id: 'pay_101',
    memberId: 'mem_01',
    gymId: 'gym_apex_101',
    amount: 69.00,
    status: 'Paid',
    dueDate: '2025-07-01',
    paymentDate: '2025-07-01T11:20:00Z',
    description: 'Pro Plan - Monthly Auto-Renew',
    method: 'Credit Card'
  },
  {
    id: 'pay_102',
    memberId: 'mem_05',
    gymId: 'gym_apex_101',
    amount: 119.00,
    status: 'Paid',
    dueDate: '2025-07-05',
    paymentDate: '2025-07-04T16:45:00Z',
    description: 'VIP Unlimited Plan - July',
    method: 'Stripe Digital'
  },
  // Pending / Warning payments (due soon or recently unpaid)
  {
    id: 'pay_201',
    memberId: 'mem_02',
    gymId: 'gym_apex_101',
    amount: 119.00,
    status: 'Due',
    dueDate: '2025-07-15', // Due in 2 days -> triggers Warning
    paymentDate: null,
    description: 'VIP Unlimited Plan - July Invoice #8841',
    method: 'Credit Card'
  },
  {
    id: 'pay_202',
    memberId: 'mem_06',
    gymId: 'gym_apex_101',
    amount: 39.00,
    status: 'Due',
    dueDate: '2025-07-16', // Due in 3 days -> triggers Warning
    paymentDate: null,
    description: 'Basic Plan - July Renewal',
    method: 'Cash / POS'
  },
  // Overdue / Suspended payments (> 14 days overdue or declined)
  {
    id: 'pay_301',
    memberId: 'mem_04',
    gymId: 'gym_apex_101',
    amount: 138.00, // 2 months overdue
    status: 'Due',
    dueDate: '2025-06-15',
    paymentDate: null,
    description: 'Pro Plan - May & June Overdue Balance',
    method: 'Credit Card'
  },
  // Iron Core payments
  {
    id: 'pay_iron_101',
    memberId: 'mem_iron_01',
    gymId: 'gym_iron_202',
    amount: 119.00,
    status: 'Paid',
    dueDate: '2025-07-01',
    paymentDate: '2025-07-01T09:00:00Z',
    description: 'VIP Unlimited - July',
    method: 'Credit Card'
  },
  {
    id: 'pay_iron_301',
    memberId: 'mem_iron_02',
    gymId: 'gym_iron_202',
    amount: 69.00,
    status: 'Due',
    dueDate: '2025-06-10',
    paymentDate: null,
    description: 'Pro Plan - June Overdue',
    method: 'Stripe Digital'
  }
];

export class MockDatabase {
  static init(): void {
    if (!localStorage.getItem(STORAGE_KEY_GYMS)) {
      localStorage.setItem(STORAGE_KEY_GYMS, JSON.stringify(SEED_GYMS));
    }
    if (!localStorage.getItem(STORAGE_KEY_MEMBERS)) {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(SEED_MEMBERS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ATTENDANCE)) {
      localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(SEED_ATTENDANCE));
    }
    if (!localStorage.getItem(STORAGE_KEY_PAYMENTS)) {
      localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    }
  }

  static resetToSeed(): void {
    localStorage.setItem(STORAGE_KEY_GYMS, JSON.stringify(SEED_GYMS));
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(SEED_MEMBERS));
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(SEED_ATTENDANCE));
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(SEED_PAYMENTS));
  }

  // --- Gym Owners (Multi-Tenant) ---
  static getGymOwners(): GymOwner[] {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY_GYMS) || '[]');
  }

  static getGymById(gymId: string): GymOwner | undefined {
    return this.getGymOwners().find(g => g.id === gymId);
  }

  // --- Members CRUD ---
  static getMembersByGym(gymId: string): Member[] {
    this.init();
    const all: Member[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MEMBERS) || '[]');
    return all.filter(m => m.gymId === gymId);
  }

  static getMemberById(memberId: string): Member | undefined {
    this.init();
    const all: Member[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MEMBERS) || '[]');
    return all.find(m => m.id === memberId);
  }

  static saveMember(member: Member): void {
    this.init();
    const all: Member[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MEMBERS) || '[]');
    const index = all.findIndex(m => m.id === member.id);
    if (index >= 0) {
      all[index] = member;
    } else {
      all.push(member);
    }
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(all));
  }

  static deleteMember(memberId: string): void {
    this.init();
    let members: Member[] = JSON.parse(localStorage.getItem(STORAGE_KEY_MEMBERS) || '[]');
    members = members.filter(m => m.id !== memberId);
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));

    // Cascade delete attendance and payments
    let attendance: Attendance[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '[]');
    attendance = attendance.filter(a => a.memberId !== memberId);
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendance));

    let payments: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY_PAYMENTS) || '[]');
    payments = payments.filter(p => p.memberId !== memberId);
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  }

  // --- Attendance & Live Time Tracking ---
  static getAttendanceByGym(gymId: string): Attendance[] {
    this.init();
    const all: Attendance[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '[]');
    return all.filter(a => a.gymId === gymId);
  }

  static getLiveOccupancy(gymId: string): { attendance: Attendance; member: Member }[] {
    const records = this.getAttendanceByGym(gymId).filter(a => a.checkOutTime === null);
    const members = this.getMembersByGym(gymId);
    const result: { attendance: Attendance; member: Member }[] = [];

    records.forEach(att => {
      const mem = members.find(m => m.id === att.memberId);
      if (mem) {
        result.push({ attendance: att, member: mem });
      }
    });

    return result;
  }

  static checkInMember(memberId: string, gymId: string): Attendance {
    this.init();
    const all: Attendance[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '[]');
    
    // Check if already checked in
    const existing = all.find(a => a.memberId === memberId && a.checkOutTime === null);
    if (existing) {
      return existing;
    }

    const newAttendance: Attendance = {
      id: `att_${Date.now()}`,
      memberId,
      gymId,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: null
    };

    all.push(newAttendance);
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(all));
    return newAttendance;
  }

  static checkOutMember(memberId: string): Attendance | null {
    this.init();
    const all: Attendance[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '[]');
    const existingIndex = all.findIndex(a => a.memberId === memberId && a.checkOutTime === null);
    if (existingIndex < 0) return null;

    const existing = all[existingIndex];
    const now = new Date();
    const checkIn = new Date(existing.checkInTime);
    const durationMin = Math.round((now.getTime() - checkIn.getTime()) / 60000);

    existing.checkOutTime = now.toISOString();
    existing.durationMinutes = durationMin > 0 ? durationMin : 1;
    all[existingIndex] = existing;

    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(all));
    return existing;
  }

  // --- Payments & Financial System ---
  static getPaymentsByGym(gymId: string): Payment[] {
    this.init();
    const all: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY_PAYMENTS) || '[]');
    return all.filter(p => p.gymId === gymId);
  }

  static addPayment(payment: Payment): void {
    this.init();
    const all: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY_PAYMENTS) || '[]');
    all.push(payment);
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(all));

    // Recalculate member status
    this.recalculateMemberStatus(payment.memberId);
  }

  static updatePaymentStatus(paymentId: string, status: 'Paid' | 'Pending' | 'Due'): void {
    this.init();
    const all: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY_PAYMENTS) || '[]');
    const index = all.findIndex(p => p.id === paymentId);
    if (index >= 0) {
      all[index].status = status;
      if (status === 'Paid') {
        all[index].paymentDate = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(all));
      this.recalculateMemberStatus(all[index].memberId);
    }
  }

  // Recalculates Active / Warning / Suspended status automatically
  static recalculateMemberStatus(memberId: string): void {
    const member = this.getMemberById(memberId);
    if (!member) return;

    const payments = JSON.parse(localStorage.getItem(STORAGE_KEY_PAYMENTS) || '[]') as Payment[];
    const memberPayments = payments.filter(p => p.memberId === memberId);

    const duePayments = memberPayments.filter(p => p.status === 'Due' || p.status === 'Pending');

    if (duePayments.length === 0) {
      member.status = 'Active';
    } else {
      // Check if any due payment is older than 14 days or high amount
      const now = new Date();
      let hasSeverelyOverdue = false;

      for (const p of duePayments) {
        const due = new Date(p.dueDate);
        const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 14 || p.amount > 120) {
          hasSeverelyOverdue = true;
          break;
        }
      }

      member.status = hasSeverelyOverdue ? 'Suspended' : 'Warning';
    }

    this.saveMember(member);
  }
}
