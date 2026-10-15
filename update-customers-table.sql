-- 更新customers表结构脚本
-- 请在Supabase Dashboard -> SQL Editor中执行此脚本

-- 1. 创建customers表（如果不存在）
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    wechat TEXT,
    budget TEXT,
    demand TEXT,
    status TEXT DEFAULT 'active',
    createdat TIMESTAMPTZ DEFAULT NOW(),
    updatedat TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 为已存在的customers表添加缺失的列（如果不存在）
DO $$
BEGIN
    -- 添加wechat列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'wechat'
    ) THEN
        ALTER TABLE customers ADD COLUMN wechat TEXT;
        RAISE NOTICE '已添加wechat列到customers表';
    ELSE
        RAISE NOTICE 'wechat列已存在，跳过添加';
    END IF;

    -- 添加budget列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'budget'
    ) THEN
        ALTER TABLE customers ADD COLUMN budget TEXT;
        RAISE NOTICE '已添加budget列到customers表';
    ELSE
        RAISE NOTICE 'budget列已存在，跳过添加';
    END IF;

    -- 添加demand列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'demand'
    ) THEN
        ALTER TABLE customers ADD COLUMN demand TEXT;
        RAISE NOTICE '已添加demand列到customers表';
    ELSE
        RAISE NOTICE 'demand列已存在，跳过添加';
    END IF;

    -- 添加status列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE customers ADD COLUMN status TEXT DEFAULT 'active';
        RAISE NOTICE '已添加status列到customers表';
    ELSE
        RAISE NOTICE 'status列已存在，跳过添加';
    END IF;

    -- 添加createdat列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'createdat'
    ) THEN
        ALTER TABLE customers ADD COLUMN createdat TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE '已添加createdat列到customers表';
    ELSE
        RAISE NOTICE 'createdat列已存在，跳过添加';
    END IF;

    -- 添加updatedat列
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'customers'
        AND column_name = 'updatedat'
    ) THEN
        ALTER TABLE customers ADD COLUMN updatedat TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE '已添加updatedat列到customers表';
    ELSE
        RAISE NOTICE 'updatedat列已存在，跳过添加';
    END IF;
END $$;

-- 3. 创建更新触发器
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    -- 检查触发器是否存在
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'update_customers_updated_at'
    ) THEN
        CREATE TRIGGER update_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW
        EXECUTE FUNCTION update_customers_updated_at();
        RAISE NOTICE '已创建update_customers_updated_at触发器';
    ELSE
        RAISE NOTICE 'update_customers_updated_at触发器已存在，跳过创建';
    END IF;
END $$;

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- 5. 验证更新
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- 完成！
SELECT 'customers表结构更新完成！' AS message;