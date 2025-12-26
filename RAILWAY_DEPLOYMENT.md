# Railway Deployment Guide

## Prerequisites

- Railway account
- PostgreSQL database (Railway provides this)
- GitHub repository connected to Railway

## Step 1: Prepare Your Project

Make sure you have:

1. ✅ `output: 'standalone'` in `next.config.mjs`
2. ✅ `Dockerfile` configured for Next.js 16 + Payload CMS
3. ✅ `.dockerignore` to exclude unnecessary files

## Step 2: Create Railway Project

1. Go to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

## Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Copy the `DATABASE_URL` from the database service

## Step 4: Configure Environment Variables

In your Railway service settings, add these variables:

### Required Variables

```bash
# Database (automatically provided if you add PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Payload CMS Secret (generate a secure random string)
PAYLOAD_SECRET=your-super-secret-key-here-minimum-32-characters

# Node Environment
NODE_ENV=production

# Next.js
NEXT_PUBLIC_SERVER_URL=https://your-app.railway.app
```

### Optional Variables

```bash
# Disable telemetry
NEXT_TELEMETRY_DISABLED=1

# Port (Railway automatically provides this)
PORT=3000
```

## Step 5: Generate PAYLOAD_SECRET

Generate a secure secret key (minimum 32 characters):

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Step 6: Railway Settings

### Build Configuration

Railway will automatically detect the Dockerfile. If not:

1. Go to your service settings
2. Under "Build & Deploy"
3. Set:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: Dockerfile
   - **Build Command**: (leave empty, Docker handles this)

### Health Check (Optional)

1. Go to service settings → "Health Check"
2. Set:
   - **Path**: `/api/health` or `/`
   - **Timeout**: 300 seconds (for initial build)

## Step 7: Deploy

1. Click "Deploy" or push to your GitHub repository
2. Railway will automatically build and deploy
3. Wait for the build to complete (this may take 5-10 minutes for first deploy)

## Step 8: Run Database Migrations

After first deployment, you may need to initialize the database:

1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Variables"
4. The DATABASE_URL should be automatically connected

Payload CMS will automatically create tables on first run.

## Step 9: Create First Admin User

1. Visit `https://your-app.railway.app/admin`
2. You'll see the initial setup page
3. Create your first admin user

## Troubleshooting

### Build Fails: "standalone not found"

**Solution**: Make sure `output: 'standalone'` is in your `next.config.mjs`

### Database Connection Error

**Solution**: 
- Check that PostgreSQL service is running
- Verify `DATABASE_URL` environment variable is set correctly
- Make sure the format is: `postgresql://user:password@host:port/database`

### Build Timeout

**Solution**:
- Increase health check timeout to 300 seconds
- Check Railway build logs for specific errors

### Out of Memory During Build

**Solution**:
- Upgrade Railway plan for more memory
- Or optimize your build by reducing dependencies

### PAYLOAD_SECRET Error

**Solution**: 
- Make sure `PAYLOAD_SECRET` is set
- Must be at least 32 characters long

## Environment Variables Summary

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| DATABASE_URL | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| PAYLOAD_SECRET | ✅ Yes | Secret key for Payload CMS | `your-32-char-secret-here...` |
| NODE_ENV | ✅ Yes | Node environment | `production` |
| NEXT_PUBLIC_SERVER_URL | ⚠️ Recommended | Your app URL | `https://your-app.railway.app` |
| PORT | ❌ Optional | Port (auto-provided by Railway) | `3000` |

## Performance Tips

1. **Use PostgreSQL Connection Pooling**: Already configured in `payload.config.ts`
2. **Enable Caching**: Next.js 16 Cache Components is enabled
3. **Monitor Logs**: Check Railway logs for performance issues
4. **Scale Resources**: Upgrade Railway plan if needed

## Security Checklist

- ✅ Use strong `PAYLOAD_SECRET` (min 32 chars)
- ✅ Enable HTTPS (Railway provides this automatically)
- ✅ Set proper CORS if using API from other domains
- ✅ Don't commit `.env` files to git
- ✅ Review user roles and permissions

## Useful Commands

### View Logs
```bash
# In Railway dashboard, click on your service → "Logs"
```

### Restart Service
```bash
# In Railway dashboard, click on your service → "Restart"
```

### Rollback Deployment
```bash
# In Railway dashboard, go to "Deployments" → Click on previous deployment → "Redeploy"
```

## Support

- [Railway Documentation](https://docs.railway.app/)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js 16 Documentation](https://nextjs.org/docs)

