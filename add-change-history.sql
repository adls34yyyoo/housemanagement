-- 为 properties 表添加 change_history 列
-- 执行此脚本前请确保已备份数据库

-- 添加 change_history 列（编辑记录）
-- 使用 JSONB 类型存储，支持灵活的 JSON 结构
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]'::jsonb;

-- 添加注释
COMMENT ON COLUMN properties.change_history IS '编辑记录，存储房源的修改历史';

-- 验证字段是否添加成功
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name = 'change_history'
ORDER BY ordinal_position;
