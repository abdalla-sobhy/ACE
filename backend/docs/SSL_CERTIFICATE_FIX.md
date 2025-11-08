# SSL Certificate Error Fix

## Problem

When trying to connect to the JSearch API (or any HTTPS API), you may encounter:

```
cURL error 60: SSL certificate problem: unable to get local issuer certificate
```

This is a common issue on Windows when PHP's cURL doesn't have the CA certificate bundle configured properly.

## Quick Fix (Development Only)

### Step 1: Add to Your .env File

Add this line to disable SSL verification:

```env
HTTP_VERIFY_SSL=false
```

Your complete JSearch configuration should look like:

```env
JSEARCH_API_KEY=your_api_key_here
JSEARCH_DEFAULT_LOCATION="United States"
JSEARCH_DEFAULT_SEARCH="developer OR engineer OR intern"

# Disable SSL verification (development only!)
HTTP_VERIFY_SSL=false
```

### Step 2: Clear Config Cache

```powershell
php artisan config:clear
```

### Step 3: Test

```powershell
php test-jsearch-direct.php
```

You should now see jobs being returned!

---

## Proper Fix (For Production)

**⚠️ WARNING:** Never disable SSL verification in production! Here's how to properly fix the SSL certificate issue:

### Method 1: Download CA Certificate Bundle (Recommended)

1. **Download the latest CA bundle:**
   - Go to: https://curl.se/docs/caextract.html
   - Download `cacert.pem`
   - Save it to a secure location (e.g., `C:\php\extras\ssl\cacert.pem`)

2. **Update php.ini:**
   ```ini
   ; Find your php.ini file (run: php --ini)
   ; Add or update this line:
   curl.cainfo = "C:\php\extras\ssl\cacert.pem"

   ; Also update this for OpenSSL:
   openssl.cafile = "C:\php\extras\ssl\cacert.pem"
   ```

3. **Restart your web server:**
   - If using Laravel Artisan: Stop and restart `php artisan serve`
   - If using Apache/Nginx: Restart the service

4. **Test:**
   ```powershell
   # Remove the HTTP_VERIFY_SSL line from .env
   php artisan config:clear
   php test-jsearch-direct.php
   ```

### Method 2: Update php.ini for Windows

If you're using XAMPP, WAMP, or Laragon:

1. **Locate php.ini:**
   ```powershell
   php --ini
   ```

2. **Open php.ini and uncomment these lines:**
   ```ini
   ; Remove the semicolon at the start:
   extension=openssl
   curl.cainfo = "C:/path/to/cacert.pem"
   ```

3. **Restart your server**

### Method 3: Use Guzzle Configuration (Laravel Specific)

Instead of using environment variable, you can configure Guzzle globally:

**config/app.php:**
```php
return [
    // ... other config

    'http' => [
        'verify' => env('HTTP_VERIFY_SSL', true),
    ],
];
```

Then in your HTTP requests:
```php
Http::withOptions([
    'verify' => config('app.http.verify'),
])->get($url);
```

---

## Security Considerations

### Why You Should Never Disable SSL in Production

Disabling SSL verification means:
- ❌ Your app can't verify it's talking to the real API server
- ❌ Man-in-the-middle attacks become possible
- ❌ Your API keys and data can be intercepted
- ❌ You're violating security best practices

### When It's OK to Disable SSL

✅ **Only in development/testing:**
- Local development on your machine
- Testing in isolated environments
- When you understand the security implications

❌ **Never in production:**
- Live servers
- Staging servers accessible from internet
- Any environment with real user data

---

## Verification

### Test if SSL is Working Properly

**Method 1: PHP Command Line**
```powershell
php -r "file_get_contents('https://jsearch.p.rapidapi.com');"
```

If this works without errors, SSL is configured correctly.

**Method 2: cURL Command**
```powershell
curl -I https://jsearch.p.rapidapi.com
```

Should return headers without SSL errors.

### Check Your Current Configuration

```powershell
php -i | findstr "curl.cainfo"
php -i | findstr "openssl.cafile"
```

Should show paths to certificate files.

---

## For Your Deployment

Before deploying to production:

1. **Remove from .env:**
   ```env
   # Remove or comment out:
   # HTTP_VERIFY_SSL=false
   ```

2. **Ensure server has proper CA certificates:**
   - Most Linux servers have this pre-configured
   - Verify with: `curl -I https://jsearch.p.rapidapi.com`

3. **Test API calls work with SSL enabled**

---

## Alternative: Update the Direct Test Script

If you only want to test and don't want to modify Laravel:

**test-jsearch-direct.php:**
```php
// Only for testing! Remove these lines for production
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
```

The updated test script already includes this, so you can test immediately.

---

## Summary

**For Development (Now):**
```env
HTTP_VERIFY_SSL=false
```

**For Production (Later):**
1. Download cacert.pem from https://curl.se/docs/caextract.html
2. Update php.ini with certificate path
3. Remove HTTP_VERIFY_SSL=false from .env
4. Restart server and test

**Questions?**
Check the Laravel logs for detailed error messages:
```powershell
Get-Content storage/logs/laravel.log -Tail 50 | Select-String "JSearch"
```
