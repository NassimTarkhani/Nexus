# Supabase Auth Configuration Fix

## Problem: "Invalid login credentials" even though user exists

This happens because Supabase has **email confirmation enabled** by default.

## Quick Fix Options

### Option 1: Disable Email Confirmation (Development Only)

1. Open **Supabase Dashboard**
2. Go to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. **Disable** "Enable email confirmations"
5. Click **Save**

Now users can sign in immediately after signup without email verification.

### Option 2: Use Email Confirmation (Production Recommended)

Keep email confirmation enabled and handle it properly in the app.

## Implementation

The app now handles both scenarios:
- ✅ Shows clear message if email needs confirmation
- ✅ Provides option to resend confirmation email
- ✅ Handles auto-confirmation for development

## Testing

### After Disabling Email Confirmation:
1. Sign up with a new email
2. Sign in immediately (no email check needed)

### With Email Confirmation Enabled:
1. Sign up with a new email
2. Check your email inbox
3. Click the confirmation link
4. Return to app and sign in

## Database Check

Run this in Supabase SQL Editor to check existing users:

```sql
-- Check auth.users (Supabase's auth table)
SELECT id, email, email_confirmed_at, confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Check public.users (your app's table)
SELECT id, email, full_name, role 
FROM public.users 
ORDER BY created_at DESC;
```

## Manual Email Confirmation

If you need to manually confirm a user's email:

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email = 'user@example.com';
```

## Recommended Settings for Development

In Supabase Dashboard → Authentication → Settings:

1. **Email Auth**:
   - ✅ Enable email provider
   - ❌ Disable email confirmations (dev only)
   - ❌ Disable email change confirmations (dev only)
   - Set Minimum Password Length: 6

2. **Auth Providers**:
   - Enable only Email for now

3. **Email Templates** (if using confirmation):
   - Update "Confirm signup" template with your app URL
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

## Production Settings

For production, ENABLE email confirmation and configure:

1. **Site URL**: Your production domain
2. **Redirect URLs**: Add your production URLs
3. **Email Templates**: Customize for your brand
4. **SMTP Settings**: Configure custom email server (optional)
