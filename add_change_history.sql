-- 为 properties 表添加 change_history 字段
ALTER TABLE properties ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]';

-- 为 agent_properties 表添加 change_history 字段
ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS change_history JSONB DEFAULT '[]';

-- 为 properties 表添加 communication_records 字段（如果不存在）
ALTER TABLE properties ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]';

-- 为 agent_properties 表添加 communication_records 字段（如果不存在）
ALTER TABLE agent_properties ADD COLUMN IF NOT EXISTS communication_records JSONB DEFAULT '[]';
