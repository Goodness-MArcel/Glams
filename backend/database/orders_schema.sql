-- Orders Table Schema for Glams Table Water Company
-- Supabase PostgreSQL Database

CREATE TABLE orders (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Order Items (JSONB for flexible item storage)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Customer Information (JSONB for flexible customer data)
  customer JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Payment Information (JSONB for payment details)
  payment JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Order Totals (JSONB for subtotal, delivery fee, total)
  totals JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Order Metadata
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),

  -- Delivery Information
  delivery_method VARCHAR(20) DEFAULT 'home' CHECK (delivery_method IN ('home', 'pickup')),
  delivery_address TEXT,
  delivery_city VARCHAR(100),
  delivery_state VARCHAR(100),
  delivery_zip_code VARCHAR(20),

  -- Special Instructions
  special_instructions TEXT,

  -- Audit Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_customer_email ON orders((customer->>'email'));
CREATE INDEX idx_orders_payment_reference ON orders((payment->>'reference'));

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();