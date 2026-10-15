-- ============================================================
-- 一次性修复脚本（幂等，可重复运行）
-- 用途：
--   1) 把 properties / customers 等表加入 supabase_realtime 发布，
--      让实时推送真正生效（实测现在通道能 SUBSCRIBED 但收不到任何事件）
--   2) 为 anon 角色补齐 8 张表的读写策略与授权，
--      使前端从 service_role 换成 anon key 后仍能正常工作
--   3) 打印前后诊断结果，便于确认
-- 运行位置：Supabase Dashboard -> SQL Editor -> 新建查询 -> 全文粘贴 -> Run
-- ============================================================

-- ===================== 0. 运行前诊断 =====================
select 'BEFORE: 实时发布中的表' as section, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by tablename;

select 'BEFORE: 实时发布配置' as section, pubname, puballtables, pubinsert, pubupdate, pubdelete
from pg_publication
where pubname = 'supabase_realtime';

select 'BEFORE: 逻辑复制槽' as section, slot_name, plugin, active
from pg_replication_slots
order by slot_name;

-- ===================== 1. 实时发布 =====================
do $$
declare
  t text;
  tables text[] := array[
    'properties','customers','agent_parties','coop_parties',
    'app_config','options','floorplans','agent_properties'
  ];
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
    raise notice '已创建 publication: supabase_realtime';
  end if;

  if exists (select 1 from pg_publication where pubname = 'supabase_realtime' and puballtables) then
    raise notice 'supabase_realtime 已是 FOR ALL TABLES，无需逐表添加';
  else
    foreach t in array tables loop
      if exists (select 1 from information_schema.tables
                 where table_schema = 'public' and table_name = t)
         and not exists (select 1 from pg_publication_tables
                         where pubname = 'supabase_realtime'
                           and schemaname = 'public' and tablename = t) then
        execute format('alter publication supabase_realtime add table public.%I', t);
        raise notice '已加入实时发布: %', t;
      end if;
    end loop;
    execute 'alter publication supabase_realtime set publish = ''insert, update, delete''';
  end if;
end $$;

-- ===================== 2. anon/authenticated 策略与授权 =====================
do $$
declare
  t text;
  tables text[] := array[
    'properties','customers','agent_parties','coop_parties',
    'app_config','options','floorplans','agent_properties'
  ];
begin
  foreach t in array tables loop
    if exists (select 1 from information_schema.tables
               where table_schema = 'public' and table_name = t) then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists app_anon_all on public.%I', t);
      execute format(
        'create policy app_anon_all on public.%I for all to anon, authenticated using (true) with check (true)', t);
      execute format('grant select, insert, update, delete on public.%I to anon, authenticated', t);
      raise notice '已配置 anon 策略: %', t;
    end if;
  end loop;
end $$;

-- 主键是 bigint，多为序列生成；序列没有权限的话新增记录会失败
do $$
declare
  s record;
begin
  for s in
    select c.relname as seqname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'S' and n.nspname = 'public'
  loop
    execute format('grant usage, select on sequence public.%I to anon, authenticated', s.seqname);
    raise notice '已授权序列: %', s.seqname;
  end loop;
end $$;

-- ===================== 3. 运行后确认 =====================
select 'AFTER: 实时发布中的表' as section, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by tablename;

select 'AFTER: anon 可用的策略' as section, tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and 'anon' = any(roles::text[])
order by tablename, policyname;
