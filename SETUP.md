# Setup Guide

This guide will help you get the One Piece Lore Map running locally.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- A Supabase account (free tier is fine)

## Step-by-Step Setup

### 1. Database Setup with Supabase

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (2-3 minutes)
4. Go to **Project Settings** → **API**
5. Copy the following:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - Anon/Public key
   - Database connection string

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root:

```bash
# Copy the example and edit it
cp .env.example .env.local
```

2. Edit `.env.local` with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

**Important**: Replace the placeholders with your actual Supabase values:
- `[YOUR-PASSWORD]`: Your Supabase database password
- `[YOUR-PROJECT-REF]`: Your project reference (from the URL)
- `[YOUR-ANON-KEY]`: Your anon/public key

### 3. Install Dependencies

```bash
npm install
```

This will:
- Install all required packages
- Generate Prisma Client automatically (via postinstall script)

### 4. Push Database Schema

```bash
npm run db:push
```

This creates all the necessary tables in your Supabase database.

### 5. Seed the Database

```bash
npm run db:seed
```

This populates the database with the 5 MVP locations (Skypeia, Sabaody, Wano, Dressrosa, Egghead).

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Troubleshooting

### "Can't reach database server"

- Check your DATABASE_URL is correct
- Verify your Supabase project is active
- Check if you're behind a firewall

### "Table doesn't exist"

- Make sure you ran `npm run db:push`
- Check Supabase dashboard → Table Editor to verify tables were created

### "No locations showing"

- Run `npm run db:seed` to populate the database
- Check browser console for errors
- Verify API routes are working: visit `http://localhost:3000/api/locations`

### Port 3000 already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Prisma Client errors

```bash
# Regenerate Prisma Client
npx prisma generate
```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Open Prisma Studio (visual database editor)
npm run db:studio

# Re-seed database (clears and repopulates)
npm run db:seed
```

## Next Steps

- Read [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to add new locations
- Explore the codebase in `/app`, `/components`, and `/lib`
- Check out the data structure in `/data/locations`
- Join the development by opening issues or PRs!

## Database Management

### View Data with Prisma Studio

```bash
npm run db:studio
```

Opens a visual editor at `http://localhost:5555` where you can:
- View all locations
- Edit data directly
- Add test data
- Debug database issues

### Reset Database

If you need to start fresh:

1. Delete all data from Supabase dashboard
2. Run `npm run db:push` again
3. Run `npm run db:seed` again

## Need Help?

- Check existing [GitHub Issues](https://github.com/yourusername/one-piece-lore-map/issues)
- Open a new issue with the `question` label
- Provide error messages and steps you've tried

Happy coding! 🏴‍☠️


