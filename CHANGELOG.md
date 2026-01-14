# Changelog

All notable changes to the One Piece Lore Map will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-14

### Added

#### Core Features
- Interactive world map with clickable location hotspots
- Hover popup system showing quick facts and preview content
- Detailed exploration pages for each location with tabbed navigation
- YouTube video integration for key moments and battles
- Responsive design for desktop and mobile

#### Locations (MVP)
- Skypeia - The legendary sky island
- Sabaody Archipelago - The soap bubble islands
- Wano Country - The isolated samurai nation
- Dressrosa - The passionate kingdom of toys
- Egghead - The futuristic island of science

#### Technical Infrastructure
- Next.js 14 with App Router and TypeScript
- Prisma ORM with PostgreSQL/Supabase database
- Tailwind CSS for styling
- Framer Motion for smooth animations
- React Query for efficient data fetching
- API routes for location data

#### Database Schema
- Location model with comprehensive lore fields
- Video model for YouTube content
- JSON seed data structure
- Database seeding system

#### Documentation
- README with project overview
- SETUP.md with local development guide
- DEPLOYMENT.md with production deployment instructions
- CONTRIBUTING.md with contribution guidelines
- Location data template for contributors

#### Developer Experience
- TypeScript interfaces for type safety
- ESLint configuration
- Prisma Studio integration
- Database migration scripts
- Automated Prisma Client generation

### Project Structure
- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components (map, popups, exploration)
- `/lib` - Utility functions and database client
- `/data` - JSON seed data for locations
- `/prisma` - Database schema and migrations
- `/public` - Static assets including world map image

### Future Plans
- Interactive pan/zoom map functionality
- Search and filter locations
- Character relationship graphs
- Story timeline visualization
- Admin panel for content management
- User accounts and progress tracking
- Additional locations from all arcs
- Mobile app version

---

## Release Notes Format

For future releases:

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security improvements


