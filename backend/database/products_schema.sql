-- Products Table Schema for Glams Table Water Company
-- Supabase PostgreSQL Database

CREATE TABLE products (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Product Information
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL CHECK (category IN ('Table Water', 'Premium Water', 'Mineralized Water', 'Flavored Water')),
  
  -- Product Specifications
  size_volume VARCHAR(50) NOT NULL CHECK (size_volume IN ('350ml', '500ml', '750ml', '1L', '1.5L', '5L', '10L', '18.9L')),
  unit_type VARCHAR(20) DEFAULT 'bottle' CHECK (unit_type IN ('bottle', 'sachet', 'container', 'dispenser')),
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
  currency VARCHAR(3) DEFAULT 'NGN',
  
  -- Inventory Management
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  reorder_level INTEGER DEFAULT 50 CHECK (reorder_level >= 0),
  max_stock_level INTEGER DEFAULT 10000,
  
  -- Product Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Product Images
  image_url TEXT,
  thumbnail_url TEXT,
  
  -- Product Specifications for Water Business
  water_source VARCHAR(100), -- e.g., 'Borehole', 'Spring Water', 'Treated Municipal'
  treatment_process TEXT, -- e.g., 'UV Sterilization, Reverse Osmosis'
  ph_level DECIMAL(3, 2), -- pH level of water
  mineral_content JSONB, -- Store mineral information as JSON
  
  -- Business Metrics
  total_sold INTEGER DEFAULT 0,
  revenue_generated DECIMAL(15, 2) DEFAULT 0,
  
  -- SEO and Marketing
  product_code VARCHAR(50) UNIQUE, -- e.g., 'GLM-PW-750', 'GLM-FP-5L'
  barcode VARCHAR(100) UNIQUE,
  tags TEXT[], -- Array of tags for searching
  
  -- Audit Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for Performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_size_volume ON products(size_volume);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_product_code ON products(product_code);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at_trigger
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all products
CREATE POLICY "Allow authenticated users to read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow only admin users to insert products
CREATE POLICY "Allow admin users to insert products" ON products
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Policy: Allow only admin users to update products
CREATE POLICY "Allow admin users to update products" ON products
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Policy: Allow only admin users to delete products
CREATE POLICY "Allow admin users to delete products" ON products
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Sample Data for Glams Table Water Products
INSERT INTO products (
  name, description, category, size_volume, unit_type, price, cost_price,
  stock_quantity, reorder_level, water_source, treatment_process, ph_level,
  product_code, tags
) VALUES 
(
  'Glams Pure Water',
  'Premium quality table water, perfect for daily hydration',
  'Table Water',
  '750ml',
  'bottle',
  150.00,
  80.00,
  2500,
  200,
  'Deep Borehole',
  'Multi-stage filtration, UV sterilization, Ozonation',
  7.2,
  'GLM-PW-750',
  ARRAY['pure', 'drinking water', '750ml', 'bottle']
),
(
  'Glams Family Pack',
  '5-liter family size water container for home use',
  'Table Water',
  '5L',
  'container',
  500.00,
  280.00,
  850,
  50,
  'Deep Borehole',
  'Multi-stage filtration, UV sterilization',
  7.1,
  'GLM-FP-5L',
  ARRAY['family pack', '5L', 'home use', 'bulk']
),
(
  'Glams Premium Plus',
  'Mineralized premium water with added electrolytes',
  'Premium Water',
  '1.5L',
  'bottle',
  300.00,
  180.00,
  120,
  25,
  'Spring Water',
  'Reverse Osmosis, Mineral enrichment, UV treatment',
  7.4,
  'GLM-PP-1.5L',
  ARRAY['premium', 'mineralized', 'electrolytes', '1.5L']
),
(
  'Glams Office Dispenser',
  '18.9L dispenser bottle for office and commercial use',
  'Table Water',
  '18.9L',
  'dispenser',
  2500.00,
  1200.00,
  45,
  10,
  'Deep Borehole',
  'Multi-stage filtration, UV sterilization, Quality tested',
  7.0,
  'GLM-OD-18.9L',
  ARRAY['office', 'dispenser', '18.9L', 'commercial', 'bulk']
);

-- Function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  stock_quantity INTEGER,
  reorder_level INTEGER,
  category VARCHAR,
  size_volume VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.stock_quantity, p.reorder_level, p.category, p.size_volume
  FROM products p
  WHERE p.stock_quantity <= p.reorder_level
    AND p.status = 'active'
  ORDER BY p.stock_quantity ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to update stock after sale
CREATE OR REPLACE FUNCTION update_product_stock(
  product_id UUID,
  quantity_sold INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE products 
  SET 
    stock_quantity = stock_quantity - quantity_sold,
    total_sold = total_sold + quantity_sold,
    revenue_generated = revenue_generated + (price * quantity_sold),
    updated_at = NOW()
  WHERE id = product_id
    AND stock_quantity >= quantity_sold;
    
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;