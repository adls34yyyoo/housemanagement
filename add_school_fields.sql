-- 为 properties 表添加小学学区和初中学区字段
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'properties') THEN
        ALTER TABLE properties ADD COLUMN IF NOT EXISTS primary_school TEXT;
        ALTER TABLE properties ADD COLUMN IF NOT EXISTS middle_school TEXT;
    END IF;
END $$;

-- 为 agent_properties 表添加小学学区和初中学区字段（如果表存在）
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'agent_properties') THEN
        ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS primary_school TEXT;
        ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS middle_school TEXT;
    END IF;
END $$;
