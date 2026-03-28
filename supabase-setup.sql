-- Supabase数据库设置脚本
-- 请在Supabase Dashboard -> SQL Editor中执行此脚本

-- 1. 创建properties表（房源表）
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    community TEXT,
    decoration TEXT,
    price NUMERIC,
    region TEXT,
    layout TEXT,
    area NUMERIC,
    floor TEXT,
    landlord_name TEXT,
    landlord_phone TEXT,
    status TEXT,
    type TEXT,
    description TEXT,
    remark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建customers表（客户表）
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    demand TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建updated_at触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. 为properties表添加updated_at触发器
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. 为customers表添加updated_at触发器
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 启用Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 7. 创建安全策略（允许所有操作，生产环境可根据需要调整）
-- properties表策略
CREATE POLICY "Allow all operations on properties"
    ON properties
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- customers表策略
CREATE POLICY "Allow all operations on customers"
    ON customers
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 8. 启用Realtime功能
-- 注意：需要在Supabase Dashboard -> Database -> Replication中手动启用
-- 然后选择properties和customers表

-- 9. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_community ON properties(community);

CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

-- 完成！
SELECT '数据库设置完成！' AS message;
