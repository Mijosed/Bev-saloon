-- ===========================================================
--  BEV Aesthetic — schéma de réservation
--  À exécuter une fois dans Supabase : SQL Editor > New query
-- ===========================================================

-- ---------- Tables ----------

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text not null,
  type        text not null check (type in ('coiffure', 'ongles')),
  service_id  text not null,
  service     text not null,
  date        date not null,
  time        time not null,
  duration_h  numeric not null check (duration_h > 0),
  price       numeric not null default 0,
  deposit     numeric not null default 0,
  paid        boolean not null default false,
  notes       text not null default '',
  status      text not null default 'confirmed' check (status in ('confirmed', 'cancelled'))
);

create index if not exists bookings_date_idx on public.bookings (date);

-- Garde-fou : deux rendez-vous confirmés ne peuvent pas se chevaucher,
-- même si deux clientes valident exactement au même moment.
create extension if not exists btree_gist;

alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings add constraint bookings_no_overlap
  exclude using gist (
    tsrange(
      (date + time)::timestamp,
      (date + time)::timestamp + make_interval(mins => (duration_h * 60)::int)
    ) with &&
  ) where (status = 'confirmed');

-- Créneaux ouverts en plus du week-end, ajoutés depuis l'espace admin
create table if not exists public.extra_slots (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  date        date not null,
  start_time  time not null,
  end_time    time not null,
  check (end_time > start_time)
);

-- ---------- Row Level Security ----------

alter table public.bookings enable row level security;
alter table public.extra_slots enable row level security;

-- Le public peut créer un rendez-vous, mais ne peut JAMAIS lire les données
-- personnelles des autres clientes (nom, email, téléphone).
drop policy if exists "public can book" on public.bookings;
create policy "public can book"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Seule l'admin connectée lit et modifie les rendez-vous.
drop policy if exists "admin reads bookings" on public.bookings;
create policy "admin reads bookings"
  on public.bookings for select
  to authenticated
  using (true);

drop policy if exists "admin updates bookings" on public.bookings;
create policy "admin updates bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes bookings" on public.bookings;
create policy "admin deletes bookings"
  on public.bookings for delete
  to authenticated
  using (true);

-- Les créneaux ouverts doivent être lisibles par le public (pour proposer les dates).
drop policy if exists "public reads extra slots" on public.extra_slots;
create policy "public reads extra slots"
  on public.extra_slots for select
  to anon, authenticated
  using (true);

drop policy if exists "admin writes extra slots" on public.extra_slots;
create policy "admin writes extra slots"
  on public.extra_slots for all
  to authenticated
  using (true)
  with check (true);

-- ---------- Disponibilités publiques ----------

-- Renvoie uniquement les créneaux occupés (date, heure, durée).
-- Aucune donnée personnelle ne sort de cette fonction.
create or replace function public.busy_slots(from_date date, to_date date)
returns table (slot_date date, slot_time time, slot_duration_h numeric)
language sql
security definer
set search_path = public
as $$
  select b.date, b.time, b.duration_h
  from public.bookings b
  where b.status = 'confirmed'
    and b.date between from_date and to_date;
$$;

grant execute on function public.busy_slots(date, date) to anon, authenticated;
