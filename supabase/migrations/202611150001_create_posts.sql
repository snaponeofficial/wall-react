create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'Wall Visitor'
    check (char_length(btrim(author_name)) between 1 and 60),
  content text not null
    check (char_length(btrim(content)) between 1 and 280),
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc, id desc);

alter table public.posts enable row level security;

drop policy if exists "Public posts are readable" on public.posts;
create policy "Public posts are readable"
  on public.posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Anonymous visitors can create posts" on public.posts;
create policy "Anonymous visitors can create posts"
  on public.posts for insert
  to anon
  with check (
    author_name = 'Wall Visitor'
    and image_url is null
    and char_length(btrim(content)) between 1 and 280
  );

revoke update, delete on table public.posts from anon, authenticated;
grant select, insert on table public.posts to anon;
grant select on table public.posts to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'posts'
  ) then
    alter publication supabase_realtime add table public.posts;
  end if;
end $$;
