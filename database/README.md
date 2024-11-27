# Database Configuration

This directory contains database-related configurations and documentation for the Femlux application.

## Supabase Auth Triggers

Located in `triggers/auth_triggers.sql`, these triggers handle the synchronization between Supabase auth and our application's user profiles.

### User Creation Trigger
- **When**: After a new user signs up (INSERT on auth.users)
- **What it does**: 
  - Creates a corresponding profile in public.profiles
  - Maps user data from auth.users to our profile structure
  - Handles both regular signup and OAuth providers (e.g., Google)
  - Sets default values for required fields

### User Deletion Trigger
- **When**: Before a user is deleted (DELETE on auth.users)
- **What it does**:
  - Soft deletes the user's profile by setting deleted_at timestamp
  - Preserves order history and other related data
  - Maintains referential integrity

## Important Notes

1. **Trigger Management**:
   - These triggers are managed through Supabase's SQL Editor
   - The SQL files here are for documentation and version control
   - Do NOT run these directly through Prisma migrations

2. **Security**:
   - Triggers use SECURITY DEFINER to ensure proper permissions
   - They handle the auth.users to public.profiles relationship securely

3. **Data Handling**:
   - User emails have a fallback pattern if none provided
   - Full names are extracted from either signup form or OAuth data
   - Soft deletion is used to preserve data integrity
