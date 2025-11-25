# Forgot Password Error Fix

## Error Description
When attempting to use the forgot password feature, you may encounter this error:
```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'lms.password_reset_tokens' doesn't exist
```

## Root Cause
The `password_reset_tokens` table hasn't been created in your database. This table is required for the password reset functionality to work.

## Solution
The migration file for this table already exists in the codebase at:
```
backend/database/migrations/2025_11_25_000001_create_password_reset_tokens_table.php
```

### Steps to Fix:

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Run the migrations:**
   ```bash
   php artisan migrate
   ```

   This will create the `password_reset_tokens` table with the following structure:
   - `email` (primary key)
   - `token` (hashed reset token)
   - `created_at` (timestamp)

3. **Verify the table was created:**
   You can verify the table exists by checking your database or running:
   ```bash
   php artisan tinker
   DB::table('password_reset_tokens')->count();
   exit
   ```

## What the Table Does
The `password_reset_tokens` table stores temporary password reset tokens when users request to reset their password. Each token is:
- Hashed for security
- Valid for 60 minutes
- Automatically deleted after successful password reset

## Testing the Fix
After running the migration, test the forgot password feature:
1. Go to the forgot password page
2. Enter a registered email address
3. You should receive a password reset email (if email is configured)
4. The error should no longer occur

## Related Files
- Controller: `backend/app/Http/Controllers/Api/AuthController.php` (lines 25-86, 88-165)
- Migration: `backend/database/migrations/2025_11_25_000001_create_password_reset_tokens_table.php`
- Route: Check `backend/routes/api.php` for the `/api/auth/forgot-password` endpoint
