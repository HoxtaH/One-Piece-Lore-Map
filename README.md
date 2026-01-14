# One Piece Lore Map 🗺️

[![CI](https://github.com/HoxtaH/One-Piece-Lore-Map/actions/workflows/ci.yml/badge.svg)](https://github.com/HoxtaH/One-Piece-Lore-Map/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/HoxtaH/One-Piece-Lore-Map/pulls)

An interactive, immersive web application that brings the vast world of One Piece to life. Explore legendary locations, discover hidden lore, and experience the journey of the Straw Hat Pirates through an intuitive and visually stunning interface.

<!-- TODO: Add screenshot/GIF of the map in action -->
<!-- ![One Piece Lore Map Preview](public/screenshots/map-preview.gif) -->

---

## 📑 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [Current Locations](#-current-locations)
- [Tech Stack](#️-tech-stack)
- [Contributing](#-contributing)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Features

- **Interactive World Map**: Hover over locations to see quick facts and preview content
- **Detailed Exploration Pages**: Deep dive into each location with comprehensive lore
- **YouTube Integration**: Watch key moments, epic battles, and memorable scenes
- **Rich Lore Database**: Economy, culture, notable people, food, transportation, and more
- **Immersive Audio**: Location-specific background music and ambient sounds
- **News Feed**: Latest One Piece news and updates from across the web
- **Community Contributions**: Submit new locations and lore via our easy web form
- **Responsive Design**: Beautiful experience on desktop and mobile
- **Modern Tech Stack**: Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion

---

## 🎮 Live Demo

> **Coming Soon!** This project will be deployed at a custom domain soon.
>
> In the meantime, you can run it locally following the [Getting Started](#-getting-started) guide below.

---

## 🚀 Getting Started

Want to run this locally? See the **[Setup Guide](SETUP.md)** for detailed instructions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/HoxtaH/One-Piece-Lore-Map.git
cd One-Piece-Lore-Map

# Install dependencies
npm install

# Set up your Supabase database (see SETUP.md)
# Then configure your .env.local file

# Push database schema
npm run db:push

# Seed with MVP locations
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the map!

### 📖 Detailed Guides

| Guide | Description |
|-------|-------------|
| [Setup Guide](SETUP.md) | Complete local development setup |
| [Deployment Guide](DEPLOYMENT.md) | Deploy to production with Vercel |
| [Contributing Guide](CONTRIBUTING.md) | For developers - add locations via code |
| [Community Guide](CONTRIBUTING-COMMUNITY.md) | For non-developers - contribute via web form |

---

## 📚 Current Locations

The map currently features these showcase locations:

| Location | Region | Description |
|----------|--------|-------------|
| **Skypeia** | Sky Island | The legendary sky island 10,000 meters above the sea |
| **Sabaody Archipelago** | Paradise | The soap bubble islands and gateway to the New World |
| **Wano Country** | New World | The isolated samurai nation with rich history |
| **Dressrosa** | New World | The passionate kingdom of toys and secrets |
| **Egghead** | New World | The futuristic island of cutting-edge science |

*...and many more from the East Blue Saga!*

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top">

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Query** (data fetching)
- **React Player** (YouTube integration)

</td>
<td valign="top">

### Backend & Database
- **Next.js API Routes**
- **PostgreSQL** (via Supabase)
- **Prisma ORM**

### Testing
- **Vitest** (unit tests)
- **Testing Library** (React testing)

</td>
<td valign="top">

### DevOps
- **Vercel** (hosting)
- **Supabase** (database)
- **GitHub Actions** (CI/CD)

</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions from the One Piece community! There are two ways to contribute:

### 👨‍💻 For Developers

Fork the repo, make changes, and submit a PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- How to add locations via JSON
- PR checklist

### 🏴‍☠️ For Non-Developers

No coding required! Visit our **[Contribution Form](/contribute)** to:
- Suggest new locations
- Submit lore corrections
- Add YouTube video recommendations

See [CONTRIBUTING-COMMUNITY.md](CONTRIBUTING-COMMUNITY.md) for detailed instructions.

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── contribute/        # Community contribution form
│   └── locations/[slug]/  # Dynamic location pages
├── components/            # React components
│   ├── map/              # Map and hotspot components
│   ├── exploration/      # Location detail views
│   └── audio/            # Audio player components
├── lib/                   # Utilities and services
│   ├── services/         # Business logic
│   └── types/            # TypeScript interfaces
├── data/locations/        # JSON seed data for locations
├── prisma/                # Database schema
├── tests/                 # Test files
└── public/                # Static assets
```

---

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 🌐 Deployment

This project is designed to be deployed on **Vercel** with a **Supabase** PostgreSQL database.

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment instructions.

### Domain Setup Guidance

Looking to set up a custom domain? Here are recommended options:

| Provider | Pros | Best For |
|----------|------|----------|
| **Vercel Domains** | Seamless integration, automatic SSL | Easiest setup with Vercel hosting |
| **Cloudflare** | Free tier, excellent DNS, DDoS protection | Performance-focused, free option |
| **Namecheap** | Affordable, good reputation | Budget-friendly domain registration |
| **Google Domains** | Reliable, clean interface | Simple, straightforward option |

> **Tip**: If hosting on Vercel, purchasing a domain directly through Vercel provides the smoothest setup experience with automatic HTTPS and zero configuration.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Eiichiro Oda** for creating the incredible world of One Piece
- **The One Piece Community** for their passion and dedication
- **All Contributors** who help bring this map to life - see [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 🔮 Roadmap

Future enhancements planned:

- [ ] Interactive pan/zoom map (Leaflet.js/Mapbox)
- [ ] Character relationship graphs
- [ ] Story timeline visualization
- [ ] Search and filter functionality
- [ ] User accounts with favorites and progress tracking
- [ ] Mobile app version (React Native)

---

## 📞 Contact

Have questions or suggestions? 

- 🐛 [Open an Issue](https://github.com/HoxtaH/One-Piece-Lore-Map/issues)
- 💬 [Join Discussions](https://github.com/HoxtaH/One-Piece-Lore-Map/discussions)
- 🔒 [Security Issues](SECURITY.md)

---

<p align="center">
  <strong>⚓ Set sail on the Grand Line! ⚓</strong>
</p>

<p align="center">
  <sub>This is a fan project and is not affiliated with or endorsed by Eiichiro Oda, Shueisha, or Toei Animation.</sub>
</p>
