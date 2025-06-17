-- QUICK DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to check current state

-- Check what tables currently exist
SELECT 'EXISTING TABLES:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if appointments table specifically exists
SELECT 'APPOINTMENTS TABLE CHECK:' as info;
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments'
    ) 
    THEN '✅ appointments table EXISTS' 
    ELSE '❌ appointments table MISSING - NEEDS FIX'
  END as status;

-- Check if businesses table exists (for multi-tenant)
SELECT 'BUSINESSES TABLE CHECK:' as info;
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'businesses'
    ) 
    THEN '✅ businesses table EXISTS' 
    ELSE '❌ businesses table MISSING - NEEDS FULL SCHEMA'
  END as status;

-- If tables exist, show record counts
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
    RAISE NOTICE '📊 RECORD COUNTS:';
    -- This will only run if tables exist
  END IF;
END $$;

SELECT 'NEXT STEPS:' as info;
SELECT 
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'appointments'
    ) 
    THEN '🚨 RUN THE URGENT_DATABASE_FIX.sql SCRIPT NOW'
    ELSE '✅ Tables exist - check application'
  END as action_needed;
