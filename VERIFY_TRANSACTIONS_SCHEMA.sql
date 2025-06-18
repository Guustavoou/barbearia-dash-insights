-- Script to verify the actual transactions table schema
-- Run this in Supabase SQL Editor to see the actual table structure

-- 1. Check if transactions table exists
SELECT EXISTS (
   SELECT 1
   FROM   information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name = 'transactions'
);

-- 2. Get all columns in transactions table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

-- 3. Check for specific date-related columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
  AND column_name IN ('date', 'transaction_date', 'payment_date', 'created_at');

-- 4. Check for business/barbershop ID columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
  AND column_name IN ('business_id', 'barbershop_id');

-- 5. Sample data to see actual structure (first 3 rows)
SELECT * FROM public.transactions LIMIT 3;

-- 6. Count total transactions
SELECT COUNT(*) as total_transactions FROM public.transactions;
