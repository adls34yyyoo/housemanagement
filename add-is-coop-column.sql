-- 为properties表添加is_coop列（合作房源标记）
-- 执行此脚本前请确保已备份数据库

DO $$
BEGIN
    -- 添加is_coop列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'is_coop'
    ) THEN
        ALTER TABLE properties ADD COLUMN is_coop BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '已添加is_coop列到properties表';
    ELSE
        RAISE NOTICE 'is_coop列已存在，跳过添加';
    END IF;
    
    -- 添加primary_school列（小学学区）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'primary_school'
    ) THEN
        ALTER TABLE properties ADD COLUMN primary_school TEXT;
        RAISE NOTICE '已添加primary_school列到properties表';
    ELSE
        RAISE NOTICE 'primary_school列已存在，跳过添加';
    END IF;
    
    -- 添加middle_school列（初中学区）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'middle_school'
    ) THEN
        ALTER TABLE properties ADD COLUMN middle_school TEXT;
        RAISE NOTICE '已添加middle_school列到properties表';
    ELSE
        RAISE NOTICE 'middle_school列已存在，跳过添加';
    END IF;
    
    -- 添加property_type列（房产类型）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'property_type'
    ) THEN
        ALTER TABLE properties ADD COLUMN property_type TEXT;
        RAISE NOTICE '已添加property_type列到properties表';
    ELSE
        RAISE NOTICE 'property_type列已存在，跳过添加';
    END IF;
    
    -- 添加property_certificate列（房产证信息）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'property_certificate'
    ) THEN
        ALTER TABLE properties ADD COLUMN property_certificate TEXT;
        RAISE NOTICE '已添加property_certificate列到properties表';
    ELSE
        RAISE NOTICE 'property_certificate列已存在，跳过添加';
    END IF;
    
    -- 添加landlord_wechat列（房东微信）
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

-- 验证字段是否添加成功
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
  AND column_name IN ('is_coop', 'primary_school', 'middle_school', 'property_type', 'property_certificate', 'landlord_wechat')
ORDER BY ordinal_position;
