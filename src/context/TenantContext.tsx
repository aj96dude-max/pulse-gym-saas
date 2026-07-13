import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GymOwner, Member, Attendance, Payment } from '../types/schema';
import { MockDatabase } from '../database/mockDatabase';

interface TenantContextType {
  gymOwners: GymOwner[];
  activeGym: GymOwner;
  switchGym: (gymId: string) => void;
  members: Member[];
  attendance: Attendance[];
  payments: Payment[];
  liveOccupancy: { attendance: Attendance; member: Member }[];
  refreshData: () => void;
  resetDatabase: () => void;
  // Helpers
  checkInByPin: (pinCode: string) => { success: boolean; message: string; member?: Member };
  checkInByQr: (qrCodeId: string) => { success: boolean; message: string; member?: Member };
  checkOutByMemberId: (memberId: string) => { success: boolean; message: string };
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gymOwners, setGymOwners] = useState<GymOwner[]>([]);
  const [activeGym, setActiveGym] = useState<GymOwner | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [liveOccupancy, setLiveOccupancy] = useState<{ attendance: Attendance; member: Member }[]>([]);

  const refreshData = () => {
    if (!activeGym) return;
    setMembers(MockDatabase.getMembersByGym(activeGym.id));
    setAttendance(MockDatabase.getAttendanceByGym(activeGym.id));
    setPayments(MockDatabase.getPaymentsByGym(activeGym.id));
    setLiveOccupancy(MockDatabase.getLiveOccupancy(activeGym.id));
  };

  useEffect(() => {
    MockDatabase.init();
    const owners = MockDatabase.getGymOwners();
    setGymOwners(owners);
    if (owners.length > 0) {
      setActiveGym(owners[0]); // Default to Apex Fitness Studio
    }
  }, []);

  useEffect(() => {
    if (activeGym) {
      refreshData();
    }
  }, [activeGym]);

  const switchGym = (gymId: string) => {
    const target = MockDatabase.getGymById(gymId);
    if (target) {
      setActiveGym(target);
    }
  };

  const resetDatabase = () => {
    MockDatabase.resetToSeed();
    const owners = MockDatabase.getGymOwners();
    setGymOwners(owners);
    if (owners.length > 0) {
      setActiveGym(owners[0]);
    }
  };

  // Quick Check-In / Check-Out Helpers
  const checkInByPin = (pinCode: string) => {
    if (!activeGym) return { success: false, message: 'No active gym context' };
    const member = members.find(m => m.pinCode === pinCode);
    if (!member) {
      return { success: false, message: `No member found matching PIN "${pinCode}"` };
    }
    if (member.status === 'Suspended') {
      return { success: false, message: `Access Denied: ${member.name} has a Suspended account due to unpaid dues.`, member };
    }

    // Check if already checked in
    const isAlreadyIn = liveOccupancy.some(l => l.member.id === member.id);
    if (isAlreadyIn) {
      MockDatabase.checkOutMember(member.id);
      refreshData();
      return { success: true, message: `Checked OUT ${member.name} successfully. Have a great day!`, member };
    } else {
      MockDatabase.checkInMember(member.id, activeGym.id);
      refreshData();
      return { success: true, message: `Checked IN ${member.name} via PIN! Enjoy your workout!`, member };
    }
  };

  const checkInByQr = (qrCodeId: string) => {
    if (!activeGym) return { success: false, message: 'No active gym context' };
    const member = members.find(m => m.qrCodeId === qrCodeId || m.id === qrCodeId);
    if (!member) {
      return { success: false, message: 'Invalid QR pass scan' };
    }
    if (member.status === 'Suspended') {
      return { success: false, message: `Access Denied: ${member.name} account is suspended for unpaid billing.`, member };
    }

    const isAlreadyIn = liveOccupancy.some(l => l.member.id === member.id);
    if (isAlreadyIn) {
      MockDatabase.checkOutMember(member.id);
      refreshData();
      return { success: true, message: `Scan Check-Out confirmed for ${member.name}.`, member };
    } else {
      MockDatabase.checkInMember(member.id, activeGym.id);
      refreshData();
      return { success: true, message: `QR Verified! Welcome ${member.name}.`, member };
    }
  };

  const checkOutByMemberId = (memberId: string) => {
    const res = MockDatabase.checkOutMember(memberId);
    if (res) {
      refreshData();
      return { success: true, message: 'Member checked out.' };
    }
    return { success: false, message: 'Member not checked in.' };
  };

  if (!activeGym) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading PulseGym SaaS Tenant Context...</div>;
  }

  return (
    <TenantContext.Provider value={{
      gymOwners,
      activeGym,
      switchGym,
      members,
      attendance,
      payments,
      liveOccupancy,
      refreshData,
      resetDatabase,
      checkInByPin,
      checkInByQr,
      checkOutByMemberId
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
