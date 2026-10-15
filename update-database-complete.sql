-- 为properties表添加所有缺失的列
-- 执行此脚本前请确保已备份数据库

DO $$
BEGIN
    -- 添加 is_coop 列（合作房源标记）
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

    -- 添加 agent_parties 列（可代理方信息，JSON格式）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'agent_parties'
    ) THEN
        ALTER TABLE properties ADD COLUMN agent_parties JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '已添加agent_parties列到properties表';
    ELSE
        RAISE NOTICE 'agent_parties列已存在，跳过添加';
    END IF;

    -- 添加 coop_parties 列（合作方信息，JSON格式）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'coop_parties'
    ) THEN
        ALTER TABLE properties ADD COLUMN coop_parties JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '已添加coop_parties列到properties表';
    ELSE
        RAISE NOTICE 'coop_parties列已存在，跳过添加';
    END IF;

    -- 添加 primary_school 列（小学学区）
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

    -- 添加 middle_school 列（初中学区）
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

    -- 添加 property_type 列（房产类型）
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

    -- 添加 property_certificate 列（房产证信息）
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

    -- 添加 landlord_wechat 列（房东微信）
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

    -- 添加 agent_name 列（房源方名称，兼容旧数据）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'agent_name'
    ) THEN
        ALTER TABLE properties ADD COLUMN agent_name TEXT;
        RAISE NOTICE '已添加agent_name列到properties表';
    ELSE
        RAISE NOTICE 'agent_name列已存在，跳过添加';
    END IF;

    -- 添加 agent_phone 列（房源方电话，兼容旧数据）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'agent_phone'
    ) THEN
        ALTER TABLE properties ADD COLUMN agent_phone TEXT;
        RAISE NOTICE '已添加agent_phone列到properties表';
    ELSE
        RAISE NOTICE 'agent_phone列已存在，跳过添加';
    END IF;

    -- 添加 change_history 列（编辑记录）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'change_history'
    ) THEN
        ALTER TABLE properties ADD COLUMN change_history JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '已添加change_history列到properties表';
    ELSE
        RAISE NOTICE 'change_history列已存在，跳过添加';
    END IF;

    -- 添加 communication_records 列（沟通记录）
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'communication_records'
    ) THEN
        ALTER TABLE properties ADD COLUMN communication_records JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '已添加communication_records列到properties表';
    ELSE
        RAISE NOTICE 'communication_records列已存在，跳过添加';
    END IF;
END $$;

-- 创建 agent_parties 表（可代理方管理表）
CREATE TABLE IF NOT EXISTS agent_parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 coop_parties 表（合作方管理表）
CREATE TABLE IF NOT EXISTS coop_parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 options 表（选项管理表）
CREATE TABLE IF NOT EXISTS options (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 updated_at 触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 options 表添加 updated_at 触发器（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_options_updated_at'
    ) THEN
        CREATE TRIGGER update_options_updated_at
            BEFORE UPDATE ON options
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE '已为options表创建updated_at触发器';
    ELSE
        RAISE NOTICE 'options表的updated_at触发器已存在，跳过创建';
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
ORDER BY ordinal_position;
