-- 更新Supabase数据库结构脚本
-- 请在Supabase Dashboard -> SQL Editor中执行此脚本

-- 1. 为已存在的properties表添加door_number列（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'door_number'
    ) THEN
        ALTER TABLE properties ADD COLUMN door_number TEXT;
        RAISE NOTICE '已添加door_number列到properties表';
    ELSE
        RAISE NOTICE 'door_number列已存在，跳过添加';
    END IF;
END $$;

-- 2. 创建门牌号索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_properties_door_number ON properties(door_number);

-- 3. 验证更新
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- 完成！
SELECT '数据库结构更新完成！' AS message;
