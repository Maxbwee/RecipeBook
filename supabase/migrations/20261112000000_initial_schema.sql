-- Recipe Book: initial schema
-- Recipes are private per user; each user has one running grocery list.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  description text,
  instructions text,
  servings int check (servings > 0),
  prep_minutes int check (prep_minutes >= 0),
  cook_minutes int check (cook_minutes >= 0),
  image_path text, -- path inside the 'recipe-images' storage bucket
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  quantity numeric check (quantity >= 0),
  unit text,
  note text,
  position int not null default 0
);

create table public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  quantity numeric check (quantity >= 0),
  unit text,
  checked boolean not null default false,
  recipe_id uuid references public.recipes(id) on delete set null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index recipes_user_id_idx on public.recipes (user_id, position);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id, position);
create index grocery_items_user_id_idx on public.grocery_items (user_id, position);
create index grocery_items_recipe_id_idx on public.grocery_items (recipe_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Keep recipes.updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- Create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.grocery_items enable row level security;

-- profiles: users can read and update only their own profile
create policy "Own profile: select" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile: update" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- recipes: full access to own rows
create policy "Own recipes" on public.recipes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- recipe_ingredients: access through the parent recipe's owner
create policy "Own recipe ingredients" on public.recipe_ingredients
  for all to authenticated
  using (exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.user_id = (select auth.uid())
  ));

-- grocery_items: full access to own rows
create policy "Own grocery items" on public.grocery_items
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage: private bucket, files stored as {user_id}/{recipe_id}.jpg
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', false)
on conflict (id) do nothing;

create policy "Own recipe images: select" on storage.objects
  for select to authenticated
  using (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Own recipe images: insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Own recipe images: update" on storage.objects
  for update to authenticated
  using (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Own recipe images: delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'recipe-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
