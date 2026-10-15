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

-- 2. 为已存在的properties表添加可代理房源相关列（如果不存在）
DO $$
BEGIN
    -- 添加is_agent列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'properties'
        AND column_name = 'is_agent'
    ) THEN
        ALTER TABLE properties ADD COLUMN is_agent BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '已添加is_agent列到properties表';
    ELSE
        RAISE NOTICE 'is_agent列已存在，跳过添加';
    END IF;

    -- 添加agent_parties列（JSON格式存储多个房源方信息）
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

    -- 添加agent_name列（兼容旧数据，保留第一个房源方名称）
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

    -- 添加agent_phone列（兼容旧数据，保留第一个房源方电话）
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
END $$;

-- 3. 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_properties_door_number ON properties(door_number);
CREATE INDEX IF NOT EXISTS idx_properties_is_agent ON properties(is_agent);
CREATE INDEX IF NOT EXISTS idx_properties_agent_name ON properties(agent_name);

-- 4. 创建options表（如果不存在）
CREATE TABLE IF NOT EXISTS options (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(type, value)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_options_type ON options(type);

-- 5. 创建agent_parties表（如果不存在）
CREATE TABLE IF NOT EXISTS agent_parties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, phone)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_agent_parties_name ON agent_parties(name);

-- 6. 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_options_updated_at
BEFORE UPDATE ON options
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_parties_updated_at
BEFORE UPDATE ON agent_parties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 7. 验证更新
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- 完成！
SELECT '数据库结构更新完成！' AS message;
