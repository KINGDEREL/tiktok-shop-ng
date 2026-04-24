-- ODDYSSEUS TIKSHOPNG Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sellers Table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  tier TEXT DEFAULT 'individual' CHECK (tier IN ('individual', 'business')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'failed')),
  tiktok_shop TEXT,
  bank_account TEXT,
  bank_name TEXT,
  account_number TEXT,
  balance NUMERIC DEFAULT 0,
  pending_payout NUMERIC DEFAULT 0,
  nin_number TEXT,
  bvn_number TEXT,
  cac_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT,
  image TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'flagged', 'rejected')),
  tiktok_synced BOOLEAN DEFAULT false,
  tiktok_product_id TEXT,
  flag_reason TEXT,
  sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'dispute')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  admin_note TEXT,
  dispute_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('fee', 'payout', 'refund', 'deposit')),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  method TEXT,
  failure_reason TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'moderator' CHECK (role IN ('super_admin', 'moderator', 'finance', 'support')),
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  admin_name TEXT,
  action TEXT NOT NULL,
  target TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators Table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  tiktok_handle TEXT NOT NULL,
  name TEXT,
  followers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  commission_rate NUMERIC DEFAULT 10,
  total_sales INTEGER DEFAULT 0,
  total_commission NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Health Logs Table
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_name TEXT NOT NULL,
  endpoint TEXT,
  status_code INTEGER,
  response_time INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password: admin123 - change in production!)
INSERT INTO admins (email, password, name, role, mfa_enabled)
VALUES
  ('admin@odysseus.ng', 'admin123', 'Super Admin', 'super_admin', true),
  ('moderator@odysseus.ng', 'mod123', 'Jane Moderator', 'moderator', false),
  ('finance@odysseus.ng', 'finance123', 'John Finance', 'finance', true),
  ('support@odysseus.ng', 'support123', 'Sarah Support', 'support', false)
ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('platform_fee_percent', '2'),
  ('min_payout_amount', '5000'),
  ('payout_schedule', 'weekly'),
  ('mfa_required', 'true'),
  ('session_timeout', '15')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_kyc_status ON sellers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (adjust as needed)
CREATE POLICY "Public read sellers" ON sellers FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Public read audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Public read creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Public read api_logs" ON api_logs FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Insert sample data
INSERT INTO sellers (email, name, phone, tier, status, kyc_status, tiktok_shop, bank_account, balance, pending_payout)
VALUES
  ('ahmed@email.com', 'Ahmed Musa', '+2348012345678', 'individual', 'active', 'verified', 'AhmedStore', 'First Bank - 1234567890', 125000, 45000),
  ('chioma@email.com', 'Chioma Fashion', '+2348023456789', 'business', 'pending', 'pending', 'ChiomaStyles', 'GT Bank - 0987654321', 0, 0),
  ('techhub@email.com', 'TechHub Nigeria', '+2348034567890', 'business', 'suspended', 'verified', 'TechHubNG', 'Zenith Bank - 5678901234', 89000, 0),
  ('tola@email.com', 'Beauty by Tola', '+2348056789012', 'individual', 'active', 'verified', 'TolaGlows', 'Access Bank - 3456789012', 230000, 67000)
ON CONFLICT DO NOTHING;