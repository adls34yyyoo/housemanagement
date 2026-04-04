-- 为 properties 表添加房源类型和产证情况字段
-- 执行此脚本前请确保已备份数据库

-- 添加 property_type 字段（房源类型）
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_type TEXT;

-- 添加 property_certificate 字段（产证情况）
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_certificate TEXT;

-- 添加注释（可选）
COMMENT ON COLUMN properties.property_type IS '房源类型：商品房、动迁房、公寓、别墅等';
COMMENT ON COLUMN properties.property_certificate IS '产证情况：满5唯一、满5年、满两年、不满两年等';

-- 验证字段是否添加成功
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name IN ('property_type', 'property_certificate')
ORDER BY ordinal_position;
