# One Piece Lore Map 🗺️

[![CI](https://github.com/HoxtaH/One-Piece-Lore-Map/actions/workflows/ci.yml/badge.svg)](https://github.com/HoxtaH/One-Piece-Lore-Map/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/HoxtaH/One-Piece-Lore-Map/pulls)

An interactive, immersive web application that brings the vast world of One Piece to life. Explore legendary locations, discover hidden lore, and experience the journey of the Straw Hat Pirates through an intuitive and visually stunning interface.

---

## 📑 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [Current Locations](#-current-locations)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Features

- **Interactive World Map** — Hover over locations to see quick facts and preview content
- **Detailed Exploration Pages** — Deep dive into each location with comprehensive lore
- **YouTube Integration** — Watch key moments, epic battles, and memorable scenes
- **Rich Lore Database** — Economy, culture, notable people, food, transportation, and more
- **Immersive Audio** — Location-specific background music with smooth crossfading
- **News Feed** — Latest One Piece news and updates pulled from RSS feeds
- **Community Contributions** — Submit new locations and lore via the built-in web form
- **Responsive Design** — Works on desktop and mobile
- **Modern Tech Stack** — Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion

---

## 🚀 Getting Started

The project is not yet publicly deployed. To run it locally, see the **[Setup Guide](SETUP.md)** for full instructions.

### Quick Start

```bash
git clone https://github.com/HoxtaH/One-Piece-Lore-Map.git
cd One-Piece-Lore-Map
npm install
```

Set `DATA_SOURCE=local` in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — no database required!

> See **[SETUP.md](SETUP.md)** for full instructions, including optional database setup.

### 📖 Guides

| Guide | Description |
|-------|-------------|
| [Setup Guide](SETUP.md) | Local development setup + self-hosting reference |
| [Contributing Guide](CONTRIBUTING.md) | For developers — add locations via JSON and PRs |
| [Community Guide](CONTRIBUTING-COMMUNITY.md) | For non-developers — contribute via GitHub Issues |
| [Local Development](docs/LOCAL_DEVELOPMENT.md) | Data source toggle, hotspot positioning |
| [Audio System](docs/AUDIO_SYSTEM.md) | Audio architecture and configuration |
| [Image Workflow](docs/IMAGE_WORKFLOW.md) | Adding character images |

---

## 📚 Current Locations

The map covers **31 locations** spanning nearly the entire One Piece world — from the earliest East Blue arcs through Egghead.

### East Blue
| Location | Description |
|----------|-------------|
| **Shell Town** | Where Zoro was imprisoned and the crew first formed |
| **Orange Town** | Nami's introduction and the Buggy the Clown arc |
| **Syrup Village** | Usopp's hometown and the Kaya arc |
| **Baratie** | The floating restaurant where Sanji joined the crew |
| **Arlong Park** | Nami's tragic past and the Arlong arc |
| **Loguetown** | The town of the beginning and the end — Gol D. Roger's birthplace |

### Alabasta Saga
| Location | Description |
|----------|-------------|
| **Reverse Mountain** | The legendary entrance to the Grand Line |
| **Whiskey Peak** | The bounty hunter town disguised as a welcoming port |
| **Little Garden** | The prehistoric island where time stands still |
| **Drum Island** | Chopper's homeland and the kingdom of medicine |
| **Alabasta** | The desert kingdom and Vivi's homeland |

### Sky Island Saga
| Location | Description |
|----------|-------------|
| **Jaya** | The island of dreams and Mock Town |
| **Skypeia** | The legendary sky island 10,000 meters above the sea |

### Water 7 Saga
| Location | Description |
|----------|-------------|
| **Long Ring Long Land** | The flat archipelago of the Davy Back Fight |
| **Water 7** | The city of water and the greatest shipwrights in the world |
| **Sea Train (Puffing Tom)** | The iconic sea train connecting Water 7 to Enies Lobby |
| **Enies Lobby** | The judicial island — site of the Straw Hats' most daring rescue |
| **Thriller Bark** | Gecko Moria's massive ghost ship island |

### Summit War Saga
| Location | Description |
|----------|-------------|
| **Sabaody Archipelago** | The soap bubble islands and gateway to the New World |
| **Amazon Lily** | The all-female island ruled by the Pirate Empress Boa Hancock |
| **Impel Down** | The world's most inescapable underwater prison |
| **Marineford** | The site of the Summit War and Ace's final stand |

### Fishman Island Saga
| Location | Description |
|----------|-------------|
| **Fish-Man Island** | The underwater kingdom at the base of the Red Line |

### Dressrosa Saga
| Location | Description |
|----------|-------------|
| **Punk Hazard** | The lawless island of ice and fire |
| **Dressrosa** | The passionate kingdom of toys and secrets |

### Yonko Saga
| Location | Description |
|----------|-------------|
| **Zou** | The living elephant island home of the Mink Tribe |
| **Whole Cake Island** | Big Mom's territory and the land of sweets |
| **Wano Country** | The isolated samurai nation fighting for freedom |
| **Mary Geoise** | The holy land atop the Red Line — seat of the World Government |

### Final Saga
| Location | Description |
|----------|-------------|
| **Egghead** | Dr. Vegapunk's futuristic island of cutting-edge science |

---

### 🏴‍☠️ Want to Contribute?

**Elbaf** — the legendary Giant Island — is intentionally left open as the first major community contribution. If you're a One Piece fan who wants to add to the map, this is where to start. See [CONTRIBUTING.md](CONTRIBUTING.md) to get involved.

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

### Backend & Data
- **Next.js API Routes**
- **PostgreSQL** (via Supabase)
- **Prisma ORM**
- **RSS Parser** (news feed)

### Testing
- **Vitest** (unit tests)
- **Testing Library** (React testing)

</td>
<td valign="top">

### Infrastructure
- **Supabase** (database)
- **GitHub Actions** (CI)

</td>
</tr>
</table>

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (locations, contributions, news)
│   ├── contribute/        # Community contribution form
│   └── locations/[slug]/  # Dynamic location pages
├── components/            # React components
│   ├── map/              # Map canvas and hotspot components
│   ├── exploration/      # Location detail views
│   ├── audio/            # Audio player and controls
│   └── news/             # News feed components
├── lib/                   # Utilities and services
│   ├── context/          # React context (AudioContext)
│   ├── services/         # Business logic
│   └── types/            # TypeScript interfaces
├── data/locations/        # JSON location data (used in local dev mode)
├── prisma/                # Database schema
├── scripts/               # Image management utilities
├── tests/                 # Unit test suite
└── docs/                  # Technical documentation
```

---

## 🧪 Testing

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Tests cover services, hooks, and key UI components using Vitest and React Testing Library.

---

## 🤝 Contributing

Contributions from the One Piece community are very welcome!

### 👨‍💻 For Developers

Fork the repo, make changes, and submit a PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to add locations via JSON
- Code style guidelines
- PR checklist

### 🏴‍☠️ For Non-Developers

No coding required! Open a [GitHub Issue](https://github.com/HoxtaH/One-Piece-Lore-Map/issues) using one of the templates to:
- Suggest new locations
- Submit lore corrections
- Recommend YouTube videos

See [CONTRIBUTING-COMMUNITY.md](CONTRIBUTING-COMMUNITY.md) for details.

---

## 🔮 Roadmap

### Completed ✅
- Interactive world map with clickable hotspots
- Detailed lore exploration pages
- Immersive audio with crossfading
- YouTube video integration
- One Piece news feed
- Community contribution form
- Unit testing infrastructure

### Planned
- [ ] Interactive pan/zoom map (Leaflet.js or Mapbox)
- [ ] Character relationship graphs
- [ ] Story arc timeline visualization
- [ ] Search and filter functionality
- [ ] User accounts with favorites and progress tracking
- [ ] Mobile app version (React Native)

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Eiichiro Oda** for creating the incredible world of One Piece
- **The One Piece Community** for their passion and dedication
- **All Contributors** — see [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 📞 Contact

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
