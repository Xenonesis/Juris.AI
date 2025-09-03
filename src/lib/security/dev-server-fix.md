# Development Server SSL Error Fix

## Problem
After implementing security headers, you may see `net::ERR_SSL_PROTOCOL_ERROR` when accessing your development server.

## Cause
The security headers (specifically HSTS and upgrade-insecure-requests) tell browsers to always use HTTPS, but the Next.js dev server runs on HTTP by default.

## Solutions

### Option 1: Clear Browser Data (Recommended for Development)
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Click "Clear Storage" on the left
4. Click "Clear site data"
5. Or visit `chrome://settings/content/all` and delete data for your localhost

### Option 2: Access via HTTP explicitly
- Use `http://localhost:3000` instead of `https://`
- Use `http://192.168.180.1:3000` instead of `https://`

### Option 3: Set up HTTPS for Development (Advanced)
```bash
# Install mkcert for local SSL certificates
npm install -g mkcert
mkcert -install
mkcert localhost 192.168.180.1

# Then modify your dev script in package.json:
"dev": "next dev --experimental-https"
```

## What We Fixed
The security configuration now:
- Only applies HSTS in production
- Only upgrades to HTTPS in production
- Allows HTTP in development mode

## Verification
After clearing browser data, you should be able to access:
- `http://localhost:3000` ✅
- `http://192.168.180.1:3000` ✅

The security headers will still be active but won't force HTTPS in development.