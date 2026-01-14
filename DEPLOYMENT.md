# Deployment Guide

This guide covers deploying the One Piece Lore Map to production using Vercel and Supabase.

## 🚀 Quick Deploy to Vercel

### Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Supabase project set up (see [SETUP.md](SETUP.md))

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit: One Piece Lore Map MVP"
git branch -M main
git remote add origin https://github.com/yourusername/one-piece-lore-map.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

6. Click **"Deploy"**

### Step 3: Seed Production Database

After deployment, seed your production database:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link to your project:
```bash
vercel link
```

3. Run seed command:
```bash
vercel env pull .env.production.local
npm run db:seed
```

Alternatively, run the seed script from your local machine:
```bash
# Make sure DATABASE_URL points to production
npm run db:seed
```

## 🔒 Security Best Practices

### Environment Variables

- Never commit `.env.local` or `.env` files
- Use different credentials for development and production
- Rotate keys periodically

### Supabase Security

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. Enable Row Level Security (RLS) on tables (optional for now)
3. Set up proper authentication when implementing user features

### API Rate Limiting

For production, consider adding rate limiting to API routes:

```typescript
// app/api/locations/route.ts
import { ratelimit } from '@/lib/redis' // You'll need to set this up

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  // ... rest of your code
}
```

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
1. Go to your project
2. Click **Analytics** tab
3. Enable Web Analytics (free)

### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Performance Monitoring

Use Vercel Speed Insights:

```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## 🌐 Custom Domain

### Add Custom Domain in Vercel

1. Go to **Project Settings** → **Domains**
2. Add your domain
3. Update DNS records with your domain provider
4. Wait for DNS propagation (can take up to 48 hours)

### SSL Certificate

Vercel automatically provides SSL certificates for all domains.

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to `main`:

```bash
git add .
git commit -m "Add new location: East Blue"
git push origin main
```

### Preview Deployments

Every pull request gets a preview deployment:
- Unique URL for testing
- Same environment as production
- Automatic SSL

## 📈 Scaling

### Free Tier Limits

**Vercel Free:**
- 100GB bandwidth/month
- Serverless function executions
- Automatic scaling

**Supabase Free:**
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users

### Upgrading for Growth

When you need more:

**Vercel Pro ($20/month):**
- 1TB bandwidth
- Team collaboration
- Analytics
- Advanced features

**Supabase Pro ($25/month):**
- 8GB database
- 50GB bandwidth
- Daily backups
- Email support

## 🐛 Debugging Production Issues

### View Logs

```bash
vercel logs [deployment-url]
```

Or in Vercel dashboard:
1. Go to **Deployments**
2. Click on a deployment
3. View **Functions** logs

### Check Build Logs

If deployment fails:
1. Go to **Deployments** in Vercel
2. Click failed deployment
3. Review build logs

### Database Issues

Use Prisma Studio on production:

```bash
# Set DATABASE_URL to production in .env
npm run db:studio
```

## 🔧 Environment-Specific Configuration

### Development

```env
# .env.local
DATABASE_URL="postgresql://localhost:5432/onepiece_dev"
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
```

### Production

```env
# Vercel environment variables
DATABASE_URL="postgresql://[production-url]"
NEXT_PUBLIC_SUPABASE_URL="https://[prod-ref].supabase.co"
```

### Staging

Create a preview branch:

```bash
git checkout -b staging
git push origin staging
```

Set up a separate Supabase project for staging.

## 📱 Performance Optimization

### Image Optimization

Images are automatically optimized by Next.js. For the map:

```tsx
<Image
  src="/onepieceworldmap.png"
  alt="One Piece World Map"
  fill
  priority // Load immediately
  quality={90} // Adjust quality
/>
```

### Caching Strategy

API routes cache for 1 minute by default. Adjust in API routes:

```typescript
export const revalidate = 3600 // 1 hour
```

### Database Connection Pooling

Use PgBouncer in your DATABASE_URL:

```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

## 🚦 Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return Response.json(
      { status: 'error', database: 'disconnected' },
      { status: 500 }
    )
  }
}
```

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

## 🆘 Troubleshooting

### Deployment Failed

1. Check build logs in Vercel
2. Verify all environment variables are set
3. Test build locally: `npm run build`

### Database Connection Error

1. Verify DATABASE_URL is correct
2. Check Supabase project is active
3. Confirm connection pooling settings

### API Routes Not Working

1. Check function logs in Vercel
2. Verify API routes return proper responses
3. Test API endpoints directly: `/api/locations`

Need help? Open an issue with the `deployment` label!


