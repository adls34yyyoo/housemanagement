-- 为 customers 和 properties 表添加 change_history 和 communication_records 字段
-- 执行此脚本前请确保已备份数据库

-- 为 customers 表添加 change_history 列（编辑记录）
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]'::jsonb;

-- 为 customers 表添加 communication_records 列（沟通记录）
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]'::jsonb;

-- 为 properties 表添加 communication_records 列（沟通记录）
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]'::jsonb;

-- 添加注释
COMMENT ON COLUMN customers.change_history IS '客户编辑记录，存储客户的修改历史';
COMMENT ON COLUMN customers.communication_records IS '客户沟通记录';
COMMENT ON COLUMN properties.communication_records IS '房源沟通记录';

-- 验证字段是否添加成功
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE (table_name = 'customers' AND column_name IN ('change_history', 'communication_records'))
   OR (table_name = 'properties' AND column_name = 'communication_records')
ORDER BY table_name, ordinal_position;
