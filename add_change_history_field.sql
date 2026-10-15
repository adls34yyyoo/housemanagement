-- 为 properties 表添加 changeHistory 字段（驼峰命名）
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'properties') THEN
        ALTER TABLE properties ADD COLUMN IF NOT EXISTS changeHistory JSONB DEFAULT '[]';
    END IF;
END $$;

-- 为 agent_properties 表添加 changeHistory 字段（驼峰命名）
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'agent_properties') THEN
        ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS changeHistory JSONB DEFAULT '[]';
    END IF;
END $$;
