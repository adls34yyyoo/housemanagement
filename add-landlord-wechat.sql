-- 为properties表添加landlord_wechat列脚本
-- 请在Supabase Dashboard -> SQL Editor中执行此脚本

-- 为已存在的properties表添加landlord_wechat列（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'landlord_wechat'
    ) THEN
        ALTER TABLE properties ADD COLUMN landlord_wechat TEXT;
        RAISE NOTICE '已添加landlord_wechat列到properties表';
    ELSE
        RAISE NOTICE 'landlord_wechat列已存在，跳过添加';
    END IF;
END $$;

-- 验证更新
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- 完成！
SELECT 'landlord_wechat列添加完成！' AS message;