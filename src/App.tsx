import React, { useState } from 'react';
import { TenantProvider } from './context/TenantContext';
import { NavigationSidebar } from './components/layout/NavigationSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeaderBar } from './components/layout/HeaderBar';
import { GymOwnerDashboard } from './components/dashboard/GymOwnerDashboard';
import { MemberManagement } from './components/members/MemberManagement';
import { AttendanceTerminal } from './components/attendance/AttendanceTerminal';
import { BillingSystem } from './components/billing/BillingSystem';
import { MemberModal } from './components/members/MemberModal';
import type { Member } from './types/schema';
import { MockDatabase } from './database/mockDatabase';
import { useTenant } from './context/TenantContext';

const MainLayout: React.FC = () => {
  const { refreshData } = useTenant();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState<boolean>(false);
  const [paymentTargetMember, setPaymentTargetMember] = useState<Member | null>(null);

  const handleQuickAddSave = (member: Member) => {
    MockDatabase.saveMember(member);
    refreshData();
  };

  return (
    <div className="app-container">
      {/* Persistent Left-Hand Navigation Sidebar (Desktop) */}
      <NavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Content Area */}
      <div className="main-content">
        {/* Top Header with Tenant Switcher & Quick Buttons */}
        <HeaderBar
          onAddMemberClick={() => setIsAddMemberOpen(true)}
          onOpenCheckInKiosk={() => setActiveTab('attendance')}
        />

        {/* Dynamic Page Views */}
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <GymOwnerDashboard
              onAddMember={() => setIsAddMemberOpen(true)}
              onOpenKiosk={() => setActiveTab('attendance')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'members' && (
            <MemberManagement
              onOpenPaymentForMember={(member) => {
                setPaymentTargetMember(member);
                setActiveTab('billing');
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTerminal />
          )}

          {activeTab === 'billing' && (
            <BillingSystem
              initialMember={paymentTargetMember}
              onClearInitialMember={() => setPaymentTargetMember(null)}
            />
          )}
        </main>
      </div>

      {/* Persistent Bottom Tab Bar (Mobile < 768px) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Quick Add Member Modal */}
      <MemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSave={handleQuickAddSave}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TenantProvider>
      <MainLayout />
    </TenantProvider>
  );
};

export default App;
