# Setup Guide

Get the One Piece Lore Map running locally in a few minutes. For a project overview, see the [README](README.md).

## Prerequisites

- **Node.js 18+** (Node 24 recommended)
- **npm** (comes with Node.js)

---

## ⚡ Quick Start (No Database Required)

The fastest way to run the app locally uses the built-in local JSON mode — no database or external accounts needed.

### 1. Clone & Install

```bash
git clone https://github.com/HoxtaH/One-Piece-Lore-Map.git
cd One-Piece-Lore-Map
npm install
```

### 2. Configure Environment

Copy the example file:

```bash
cp .env.example .env.local
```

Then set the data source to local mode in `.env.local`:

```env
DATA_SOURCE=local
```

### 3. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it!

> **How local mode works:** The app reads directly from the JSON files in `data/locations/` instead of a database. Edit a file, refresh your browser, and changes appear instantly. See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) for tips on tweaking hotspot coordinates and colors.

---

## Useful Commands

```bash
# Development server
npm run dev

# Run linter
npm run lint

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Image management
npm run images:list       # List all expected character images
npm run images:missing    # Show which images are missing
npm run images:verify     # Validate image paths in JSON files
```

---

## Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

### Prisma Client errors

```bash
npx prisma generate
```

### No locations showing in local mode

- Confirm `DATA_SOURCE=local` is set in `.env.local`
- Check that `.env.local` exists (copy from `.env.example` if not)
- Check the browser console for errors

---

## 🗄️ Full Stack Setup (With Database)

Only needed if you want to test the database integration directly — for example, if you're working on the contribution form submission flow or the Prisma schema.

### Additional Prerequisites

- A PostgreSQL database — [Supabase](https://supabase.com) free tier is the easiest option

### Database Setup (Supabase)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project and wait for it to provision (2–3 minutes)
3. Go to **Project Settings → API** and copy:
   - Project URL (`https://xxxxx.supabase.co`)
   - Anon/Public key
   - Database connection string

### Configure `.env.local`

```env
DATA_SOURCE=database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### Initialize the Database

```bash
# Create all tables
npm run db:push

# Populate with location data
npm run db:seed
```

### Database Commands

```bash
# Open Prisma Studio (visual database editor at localhost:5555)
npm run db:studio

# Re-seed database (clears and repopulates)
npm run db:seed
```

### Reset Database

If you need a clean slate:

1. Delete tables from the Supabase dashboard
2. Run `npm run db:push`
3. Run `npm run db:seed`

### Troubleshooting Database Issues

**"Can't reach database server"**
- Verify your `DATABASE_URL` is correct
- Confirm your Supabase project is active (free projects pause after inactivity)

**"Table doesn't exist"**
- Run `npm run db:push` to create the schema

**"No locations showing"**
- Run `npm run db:seed` to populate the database
- Test the API directly: [http://localhost:3000/api/locations](http://localhost:3000/api/locations)

---

## Next Steps

- Read [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to add new locations
- See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) for hotspot positioning and coordinate tips
- Check `data/locations/` to explore the JSON data structure
- Browse `docs/` for deeper technical documentation

Need help? [Open an issue](https://github.com/HoxtaH/One-Piece-Lore-Map/issues) with the `question` label.

Happy coding! 🏴‍☠️
