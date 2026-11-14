insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'wall-photos',
  'wall-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anonymous visitors can upload wall photos" on storage.objects;
create policy "Anonymous visitors can upload wall photos"
  on storage.objects for insert
  to anon
  with check (
    bucket_id = 'wall-photos'
    and (storage.foldername(name))[1] = 'public'
    and lower(storage.extension(name)) = any (array['jpg', 'jpeg', 'png', 'webp'])
  );

drop policy if exists "Anonymous visitors can create posts" on public.posts;
create policy "Anonymous visitors can create posts"
  on public.posts for insert
  to anon
  with check (
    author_name = 'Wall Visitor'
    and char_length(btrim(content)) between 1 and 280
    and (
      image_url is null
      or image_url ~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/wall-photos/public/'
    )
  );
