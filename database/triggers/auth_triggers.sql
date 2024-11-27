-- =============================================
-- Auth Triggers for Supabase Integration
-- =============================================

-- =================
-- User Creation
-- =================
-- Automatically creates a profile when a new user signs up
-- Links auth.users with public.profiles
-- Handles data from both regular signup and OAuth providers

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new profile for the user
  -- Maps auth.users fields to public.profiles
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.email, 'no-email-' || NEW.id || '@placeholder.com'),  -- Fallback for no email
    COALESCE(
      (NEW.raw_user_meta_data->>'full_name'),  -- From regular signup form
      (NEW.raw_user_meta_data->>'name'),       -- From Google OAuth
      NULL
    ),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================
-- User Deletion
-- =================
-- Soft deletes the associated profile when a user is deleted
-- Maintains referential integrity while preserving order history

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete the user's profile
  -- Sets deleted_at timestamp instead of removing the record
  UPDATE public.profiles
  SET deleted_at = NOW()
  WHERE user_id = OLD.id
    AND deleted_at IS NULL;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion();
