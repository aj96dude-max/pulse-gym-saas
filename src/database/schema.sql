-- ==============================================================================
-- PulseGym SaaS Production Relational Database Schema (PostgreSQL / Supabase)
-- Multi-Tenant Architecture with foreign key relationships & indexing
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GYM_OWNER TABLE (Multi-tenant root entity)
CREATE TABLE IF NOT EXISTS gym_owner (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gym_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(512) NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'Active' CHECK (subscription_status IN ('Trial', 'Active', 'Enterprise', 'Expired')),
    logo_url TEXT,
    currency_symbol VARCHAR(10) DEFAULT '$',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MEMBER TABLE (Captures personal details, membership plans, and status)
CREATE TABLE IF NOT EXISTS member (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gym_owner(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    membership_plan VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Warning', 'Suspended')),
    pin_code VARCHAR(10) UNIQUE NOT NULL,
    qr_code_id UUID UNIQUE DEFAULT uuid_generate_v4(),
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for high-speed tenant lookups and status filtering ("Payment Due" filter)
CREATE INDEX IF NOT EXISTS idx_member_gym_status ON member(gym_id, status);
CREATE INDEX IF NOT EXISTS idx_member_pin ON member(pin_code, gym_id);

-- 3. ATTENDANCE TABLE (Check-in/Check-out logs & time tracking)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES member(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gym_owner(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP WITH TIME ZONE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER
);

-- Index for live occupancy queries (where check_out_time IS NULL)
CREATE INDEX IF NOT EXISTS idx_attendance_live ON attendance(gym_id, date) WHERE check_out_time IS NULL;
CREATE INDEX IF NOT EXISTS idx_attendance_member_date ON attendance(member_id, date);

-- 4. PAYMENT TABLE (Financial logs, due status tracking, manual/digital transactions)
CREATE TABLE IF NOT EXISTS payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES member(id) ON DELETE CASCADE,
    gym_id UUID NOT NULL REFERENCES gym_owner(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Due' CHECK (status IN ('Paid', 'Pending', 'Due')),
    due_date DATE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    description VARCHAR(255) NOT NULL,
    method VARCHAR(100) DEFAULT 'Credit Card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for dashboard financial metrics (Pending Payments and Overdue Accounts)
CREATE INDEX IF NOT EXISTS idx_payment_gym_status ON payment(gym_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_due_date ON payment(due_date) WHERE status != 'Paid';

-- ==============================================================================
-- AUTOMATED STATUS CALCULATION TRIGGER (Postgres function)
-- Automatically tags members as 'Warning' or 'Suspended' based on overdue payments
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_member_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If a payment is marked as 'Due' and overdue by more than 14 days -> Suspended
    -- If a payment is marked as 'Due' or 'Pending' within 14 days -> Warning
    -- If all payments are 'Paid' -> Active
    UPDATE member
    SET status = CASE
        WHEN EXISTS (
            SELECT 1 FROM payment 
            WHERE member_id = NEW.member_id AND status = 'Due' AND due_date < CURRENT_DATE - INTERVAL '14 days'
        ) THEN 'Suspended'
        WHEN EXISTS (
            SELECT 1 FROM payment 
            WHERE member_id = NEW.member_id AND (status = 'Due' OR status = 'Pending')
        ) THEN 'Warning'
        ELSE 'Active'
    END
    WHERE id = NEW.member_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_member_status_after_payment
AFTER INSERT OR UPDATE ON payment
FOR EACH ROW
EXECUTE FUNCTION update_member_payment_status();
