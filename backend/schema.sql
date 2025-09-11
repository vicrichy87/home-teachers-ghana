-- Supabase schema (minimal)
create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('student','teacher')),
  full_name text,
  phone text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now()
);

create table teacher_details (
  user_id uuid primary key references profiles(id) on delete cascade,
  subjects text[],
  levels text[],
  monthly_fee numeric(10,2)
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id),
  teacher_id uuid references profiles(id),
  subject text,
  level text,
  start_date timestamptz,
  price numeric(10,2),
  status text default 'pending'
);
