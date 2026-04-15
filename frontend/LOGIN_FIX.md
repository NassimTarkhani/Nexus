# 🚨 Login Issue - Step by Step Fix

## Your Current Problem

You're getting **"Invalid login credentials"** even though you created the user via signup.

## Root Cause

Supabase has **email confirmation enabled** by default. Your user is created but can't log in until the email is confirmed.

## Immediate Fix (Choose One)

### Option A: Disable Email Confirmation (Fastest ✅)

1. Open **Supabase Dashboard**: https://xrotkyrndrpsgnckbnfe.supabase.co

2. Go to **Authentication** → **Settings** (left sidebar)

3. Scroll down to **Email Auth** section

4. Find "**Enable email confirmations**" toggle

5. **Turn it OFF** (disable it)

6. Click **Save** at the bottom

7. Try logging in again - it should work now!

### Option B: Manually Confirm Your Existing User

If you want to keep email confirmation ON, confirm the existing user:

1. Open **Supabase Dashboard** → **SQL Editor**

2. Run this query (replace with your email):
   ```sql
   UPDATE auth.users 
   SET email_confirmed_at = NOW(), 
       confirmed_at = NOW() 
   WHERE email = 'your@email.com';
   ```

3. Now try logging in

## Debug in Browser Console

The app now has built-in debug tools. Open browser console (F12) and run:

```javascript
// Check auth status
debugSupabaseAuth()

// Check if your user exists
checkUserExists('your@email.com')

// Check environment config  
getAuthSettings()
```

## Verify Your Setup

After making changes, visit: **http://localhost:3000/setup-check**

This will verify:
- ✅ Database connection
- ✅ Tables exist
- ✅ Your auth configuration

## Test the Fix

1. After disabling email confirmation OR manually confirming your user
2. Go to: http://localhost:3000/auth/signin
3. Enter your email and password
4. You should now be able to log in successfully

## If Still Not Working

### Check These:

1. **Is the password correct?**
   - Passwords are case-sensitive
   - No extra spaces

2. **Check Supabase Users Table:**
   - Dashboard → Authentication → Users
   - Find your email
   - Check "Confirmed At" column - should have a timestamp

3. **Check Browser Console:**
   - Look for detailed error messages
   - Use `debugSupabaseAuth()` command

4. **Try Creating a New User:**
   - With email confirmation disabled
   - Should work immediately now

## Success Criteria

✅ Email confirmation is disabled (or user is manually confirmed)
✅ User exists in **Authentication** → **Users** in Supabase Dashboard
✅ User exists in **Table Editor** → **users** table
✅ Can sign in at http://localhost:3000/auth/signin
✅ Redirected to dashboard after signin

## Production Note

For production, you should:
- ✅ Re-enable email confirmation
- ✅ Configure email templates
- ✅ Set up proper email service (SMTP)
- ✅ Test the full email confirmation flow

## Need More Help?

Check these files:
- `AUTH_FIX.md` - Detailed auth configuration
- `AUTH_SETUP.md` - Full authentication setup guide
- `/setup-check` - Automated setup verification

Or run in browser console:
```javascript
debugSupabaseAuth() // Check everything
```

---

**TL;DR**: Go to Supabase Dashboard → Authentication → Settings → Disable "Enable email confirmations" → Save → Try logging in again. Should work! ✅
