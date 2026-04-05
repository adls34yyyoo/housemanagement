-- 为 properties 表添加 change_history 字段
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'properties') THEN
        ALTER TABLE properties ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]';
        ALTER TABLE properties ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]';
    END IF;
END $$;

-- 为 agent_properties 表添加 change_history 字段（如果表存在）
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'agent_properties') THEN
        ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]';
        ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]';
    END IF;
END $$;
