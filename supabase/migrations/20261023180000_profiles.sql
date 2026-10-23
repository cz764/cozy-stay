-- Accounts live in Supabase Auth (auth.users holds credentials and sessions).
-- public.profiles is the app-owned row per user: created by trigger on signup,
-- readable only by its owner, and the place future columns (display name,
-- avatar) go. Keying it on auth.users.id lets later tables such as wishlists
-- use auth.uid() in their row-level security.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "owner read" on public.profiles
  for select using ((select auth.uid()) = id);

-- security definer: the signup transaction runs as the auth admin role, which
-- has no grant on public.profiles. search_path is pinned so the function body
-- cannot be hijacked through a schema the caller controls.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
