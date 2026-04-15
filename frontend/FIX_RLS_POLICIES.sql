-- Fix RLS Policies - Remove Circular Dependencies
-- Run this in Supabase SQL Editor to fix infinite recursion

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Enable insert during signup" ON public.users;

-- Create fixed policies without circular references
-- SELECT policies
CREATE POLICY "Users can view their own profile" 
ON public.users
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Service role can view all users" 
ON public.users
FOR SELECT 
USING (auth.jwt()->>'role' = 'service_role');

-- INSERT policies (needed for signup trigger and manual profile creation)
CREATE POLICY "Allow insert during signup" 
ON public.users
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- UPDATE policies
CREATE POLICY "Users can update their own profile" 
ON public.users
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE policies (only service role or explicit admin function)
CREATE POLICY "Service role can delete users" 
ON public.users
FOR DELETE 
USING (auth.jwt()->>'role' = 'service_role');

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
