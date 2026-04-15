# NEXUS Authentication Setup Guide

## Prerequisites

You need a Supabase account. If you don't have one:
1. Go to [https://supabase.com/](https://supabase.com/)
2. Sign up and create a new project
3. Wait for your project to be provisioned

## Database Setup

### Step 1: Run the SQL Schema

1. Open your Supabase dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `DATABASE_SCHEMA.sql` in this project
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create:
- All necessary tables (users, user_preferences, user_api_keys, etc.)
- Row Level Security (RLS) policies
- Triggers for automatic user profile creation
- Indexes for performance

### Step 2: Verify Tables

Go to **Table Editor** and verify these tables exist:
- `users`
- `user_preferences`
- `user_api_keys`
- `user_agents`
- `user_workflows`
- `user_mcp_servers`
- `conversations`
- `messages`

## Environment Variables

Your `.env` file should contain:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

You can find these values in:
1. Supabase Dashboard → **Settings** → **API**
2. Copy **Project URL** and **anon/public** key

## Creating Your First Admin User

### Option 1: Via Supabase Dashboard

1. Sign up through the app at `/auth/signup`
2. Go to Supabase Dashboard → **Authentication** → **Users**
3. Find your user and copy the UUID
4. Go to **Table Editor** → **users** table
5. Find your user row and change `role` from `user` to `admin`
6. Save changes

### Option 2: Via SQL

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Testing Authentication

### Sign Up Flow
1. Navigate to `http://localhost:3000/auth/signup`
2. Fill in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
3. Click "Create Account"
4. You'll be redirected to the dashboard

### Sign In Flow
1. Navigate to `http://localhost:3000/auth/signin`
2. Enter email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

## User Roles

### User (Default)
- Can access chat, workflows, agents, archive
- Can manage their own data (API keys, agents, workflows, etc.)
- Cannot see other users

### Admin
- All user permissions
- Additional **User Management** tab in settings
- Can view, edit, and delete all users
- Can change user roles

## Features by Role

### All Users
- ✅ Multi-LLM chat
- ✅ Create and manage agents
- ✅ Build workflows
- ✅ Upload documents (RAG)
- ✅ Configure MCP servers
- ✅ Manage API keys
- ✅ View chat history
- ✅ User preferences (theme, language, etc.)

### Admin Only
- ✅ View all users
- ✅ Edit user profiles
- ✅ Change user roles
- ✅ Delete users
- ✅ User management dashboard

## Data Privacy

All user data is protected by Row Level Security (RLS):
- Users can only see their own data
- API keys are stored encrypted
- Admins have read-only access to user profiles (not API keys)
- Conversations and messages are private per user

## Troubleshooting

### "User not found" after signup
- Check if the trigger `on_auth_user_created` is active
- Verify RLS policies are enabled
- Check Supabase logs for errors

### "Permission denied" errors
- Verify RLS policies are correctly set up
- Run the schema again if needed
- Check if the user's role is correctly set

### Can't sign in
- Verify email confirmation is disabled in Supabase (Settings → Authentication → Email Auth)
- Check if the user exists in the Authentication tab
- Reset password if needed

### Admin can't see User Management tab
- Check if `role` column in `users` table is set to `'admin'`
- Refresh the page after changing role
- Sign out and sign in again

## Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Create your first admin user
3. ✅ Test sign up/in flows
4. ✅ Configure LLM providers in Settings
5. ✅ Start chatting!

## Development Tips

- Run `npm run dev` to start the Next.js server
- The app will redirect to `/auth/signin` if not authenticated
- Use incognito mode to test different user accounts
- Check browser console for auth errors

## Production Deployment

Before deploying:
1. ✅ Verify all RLS policies are enabled
2. ✅ Test with multiple user accounts
3. ✅ Ensure admin accounts are properly set
4. ✅ Update `APP_URL` in `.env` for production
5. ✅ Enable email confirmation in Supabase (optional)

## Support

If you encounter issues:
1. Check Supabase logs (Dashboard → Logs)
2. Verify RLS policies (Table Editor → RLS)
3. Test API calls in the Network tab
4. Check the database schema matches `DATABASE_SCHEMA.sql`
