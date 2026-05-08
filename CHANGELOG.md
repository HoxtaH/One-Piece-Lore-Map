# Changelog

All notable changes to the One Piece Lore Map will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

#### Audio System
- Global `AudioContext` for centralized audio state across the entire application
- Smooth 2–3 second crossfading between tracks on page navigation
- User consent flow respecting browser autoplay policies ("Enable Music" prompt)
- Audio preferences persisted in `localStorage`
- Location-specific background music for all 5 MVP locations
- Volume control and mute toggle via floating `AudioControls` widget

#### News Feed
- One Piece news feed powered by `rss-parser` pulling from external RSS sources
- `NewsPanel` component with scrollable feed and loading/error states
- `/api/news` route for server-side RSS fetching and parsing

#### Community Contribution Form
- `/contribute` page with a multi-field submission form
- Submission API route (`/api/contributions`) storing entries in the database
- Form validation and success/error feedback

#### Image Management
- `scripts/image-manager.js` utility for character image tracking
- `npm run images:list` — list all expected character image paths
- `npm run images:missing` — identify characters without images
- `npm run images:verify` — validate image paths referenced in JSON files
- Full workflow documented in `docs/IMAGE_WORKFLOW.md`

#### Testing Infrastructure
- Vitest + React Testing Library configured and integrated into CI
- Unit tests for: `locationService`, `contributionService`, `newsFeedService`
- Component tests for: `CharacterCard`, `HomeClient`, `NewsPanel`
- Hook tests for: `useMapAudio`
- Coverage reporting via `npm run test:coverage`

#### Developer Experience
- `DATA_SOURCE` environment variable toggle (`local` / `database`)
- Local mode reads directly from `data/locations/*.json` — no database needed
- Instant feedback loop: edit JSON → refresh browser → see changes
- Documented in `docs/LOCAL_DEVELOPMENT.md`

---

## [0.1.0] - 2025-10-14

### Added

#### Core Features
- Interactive world map with clickable location hotspots
- Hover popup system showing quick facts and preview content
- Detailed exploration pages for each location with tabbed navigation
- YouTube video integration for key moments and battles
- Responsive design for desktop and mobile

#### Locations (MVP)
- Skypeia — The legendary sky island
- Sabaody Archipelago — The soap bubble islands
- Wano Country — The isolated samurai nation
- Dressrosa — The passionate kingdom of toys
- Egghead — The futuristic island of science

#### Technical Infrastructure
- Next.js 14 with App Router and TypeScript
- Prisma ORM with PostgreSQL/Supabase database
- Tailwind CSS for styling
- Framer Motion for smooth animations
- React Query for efficient data fetching
- API routes for location data

#### Database
- `Location` model with comprehensive lore fields
- `Video` model for YouTube content
- JSON seed data structure (`data/locations/`)
- Database seeding system (`npm run db:seed`)

#### Documentation
- README with project overview
- SETUP.md with local development and self-hosting guide
- CONTRIBUTING.md with developer contribution guidelines
- CONTRIBUTING-COMMUNITY.md for non-developer contributions
- Location data template (`LOCATION_TEMPLATE.json`)

#### Developer Experience
- TypeScript interfaces for type safety
- ESLint configuration
- Prisma Studio integration (`npm run db:studio`)
- Automated Prisma Client generation on `npm install`

---

## Release Notes Format

For future releases, use the following format:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```
