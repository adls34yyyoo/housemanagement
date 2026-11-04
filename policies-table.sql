-- 上海最新政策表（前端首页「上海最新政策」模块从本表读取，随时在后台改数据即可更新，无需改代码发版）
-- 幂等，可重复执行

create table if not exists public.policies (
    id           text primary key,                       -- 英文/拼音短标识，如 loan-rate
    title        text not null,                          -- 政策标题
    policy_date  date not null default current_date,     -- 政策日期（列表按它倒序）
    summary      text default '',                        -- 列表摘要（一句话）
    tag          text default '新规',                    -- 标签：房贷/限购/公积金/税费/保障房/新规
    content      text default '',                        -- 详情正文：纯文本，换行用 \n；如内容含 < 标签则按 HTML 渲染
    source       text default '',                        -- 来源，如 上海市住房和城乡建设管理委员会
    is_active    boolean not null default true,          -- false = 下架不在前端显示
    sort_order   integer not null default 0,             -- 同日期时的排序（大在前）
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

comment on table public.policies is '上海最新政策（首页运营位，后台随时更新）';

-- 行级安全：允许匿名读取；写入只走 service_role（后台维护）
alter table public.policies enable row level security;

drop policy if exists "policies_public_read" on public.policies;
create policy "policies_public_read"
    on public.policies for select
    using (true);

grant select on public.policies to anon, authenticated;

-- 更新时间自动维护
create or replace function public.set_updated_at_policies()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_set_updated_at_policies on public.policies;
create trigger trg_set_updated_at_policies
    before update on public.policies
    for each row execute function public.set_updated_at_policies();

-- 校验
select id, title, policy_date, tag, is_active from public.policies order by policy_date desc, sort_order desc;
