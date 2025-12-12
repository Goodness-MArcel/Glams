-- =====================================================
-- FIXED: Glams Table Water - Inventory Management Trigger
-- Run this UPDATED SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Drop the old trigger and function
DROP TRIGGER IF EXISTS trigger_update_product_stock ON orders;
DROP FUNCTION IF EXISTS update_product_stock();
DROP FUNCTION IF EXISTS check_product_stock(json);

-- 2. Create the FIXED trigger function that updates stock when orders are placed
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    item_record RECORD;
    current_stock INTEGER;
BEGIN
    -- Loop through each item in the order
    FOR item_record IN SELECT * FROM json_array_elements(NEW.items::json)
    LOOP
        -- Get current stock for this product
        SELECT stock_quantity INTO current_stock
        FROM products
        WHERE name = item_record.value->>'name'
        AND size_volume = item_record.value->>'size_volume';

        -- Check if product exists
        IF current_stock IS NULL THEN
            RAISE EXCEPTION 'Product % (%) not found in inventory',
                item_record.value->>'name', item_record.value->>'size_volume';
        END IF;

        -- Check if we have enough stock
        IF current_stock < (item_record.value->>'quantity')::INTEGER THEN
            RAISE EXCEPTION 'Insufficient stock for % (%). Available: %, Requested: %',
                item_record.value->>'name', item_record.value->>'size_volume',
                current_stock, item_record.value->>'quantity';
        END IF;

        -- Update the stock (subtract the ordered quantity)
        UPDATE products
        SET stock_quantity = stock_quantity - (item_record.value->>'quantity')::INTEGER,
            updated_at = NOW()
        WHERE name = item_record.value->>'name'
        AND size_volume = item_record.value->>'size_volume';
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the FIXED trigger that fires before new orders are inserted
CREATE TRIGGER trigger_update_product_stock
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- =====================================================
-- Optional: FIXED Stock Check Function (for validation)
-- =====================================================

-- Function to check stock availability before placing orders
CREATE OR REPLACE FUNCTION check_product_stock(order_items JSON)
RETURNS TABLE (
    product_name TEXT,
    size_volume TEXT,
    requested_quantity INTEGER,
    available_stock INTEGER,
    sufficient_stock BOOLEAN
) AS $$
DECLARE
    item_record RECORD;
BEGIN
    -- Create temporary table for results
    CREATE TEMP TABLE stock_check_results (
        product_name TEXT,
        size_volume TEXT,
        requested_quantity INTEGER,
        available_stock INTEGER,
        sufficient_stock BOOLEAN
    ) ON COMMIT DROP;

    -- Check each item
    FOR item_record IN SELECT * FROM json_array_elements(order_items)
    LOOP
        INSERT INTO stock_check_results
        SELECT
            item_record.value->>'name',
            item_record.value->>'size_volume',
            (item_record.value->>'quantity')::INTEGER,
            COALESCE(p.stock_quantity, 0),
            COALESCE(p.stock_quantity, 0) >= (item_record.value->>'quantity')::INTEGER
        FROM products p
        WHERE p.name = item_record.value->>'name'
        AND p.size_volume = item_record.value->>'size_volume';
    END LOOP;

    RETURN QUERY SELECT * FROM stock_check_results;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Test the functions (optional - remove in production)
-- =====================================================

-- Test the stock check function with sample data:
-- SELECT * FROM check_product_stock('[
--     {"name": "Glams Pure Water", "size_volume": "750ml", "quantity": 2},
--     {"name": "Family Pack", "size_volume": "5L", "quantity": 1}
-- ]'::json);