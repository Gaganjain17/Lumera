-- Migration: Make INR required and USD optional
-- Run this in Supabase SQL Editor

-- Step 1: Add price_inr column if it doesn't exist
alter table public.products
  add column if not exists price_inr numeric(12,2);

-- Step 2: Backfill existing data: calculate INR from USD if price_inr is null
-- Using the default conversion rate of 83.50
update public.products
set price_inr = price * 83.50
where price_inr is null;

-- Step 3: Make price_inr NOT NULL (required)
alter table public.products
  alter column price_inr set not null;

-- Step 4: Make price nullable (optional) - remove NOT NULL constraint if it exists
alter table public.products
  alter column price drop not null;

