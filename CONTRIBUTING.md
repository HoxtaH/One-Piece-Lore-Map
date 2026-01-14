# Contributing to One Piece Lore Map

Thank you for your interest in contributing! This guide will help you add locations, improve lore, and enhance the project.

## 🌊 Ways to Contribute

- **Add New Locations**: Expand the map with more islands and locations
- **Enhance Existing Lore**: Add details, correct information, or improve descriptions
- **Add Media**: Find better YouTube videos or images
- **Fix Bugs**: Report and fix issues
- **Improve UI/UX**: Enhance the visual design and user experience
- **Documentation**: Improve guides and documentation

## 📍 Adding a New Location

### Step 1: Research the Location

Gather comprehensive information about the location:
- Official name and aliases
- Region (Paradise, New World, etc.)
- History and key events
- Culture and traditions
- Economy and industries
- Notable characters
- Food and cuisine
- Transportation methods
- Manga chapters and anime episodes
- YouTube videos of key moments

### Step 2: Create the JSON File

Create a new file in `/data/locations/` named `location-slug.json`:

```json
{
  "slug": "location-slug",
  "name": "Location Name",
  "region": "Region Name",
  "aliases": ["Alias 1", "Alias 2"],
  "coordinates": { "x": 50, "y": 50 },
  "description": "A brief description of the location (2-3 sentences).",
  "history": "Detailed history paragraph explaining the location's past, significant events, and how it fits into the One Piece world.",
  "culture": "Description of the local culture, customs, traditions, and way of life.",
  "economy": {
    "industries": ["Industry 1", "Industry 2", "Industry 3"],
    "currency": "Currency name or description",
    "tradeGoods": ["Trade good 1", "Trade good 2"]
  },
  "transportation": "How people move around the location and how to reach it.",
  "food": {
    "cuisine": ["Dish 1", "Dish 2", "Dish 3"],
    "traditions": ["Food tradition 1", "Food tradition 2"],
    "quirks": ["Unique food quirk 1", "Unique food quirk 2"]
  },
  "notablePeople": [
    {
      "name": "Character Name",
      "role": "Their role or title",
      "description": "Brief description of who they are and their significance."
    }
  ],
  "storyArcs": {
    "mangaChapters": "Chapters X-Y",
    "animeEpisodes": "Episodes X-Y",
    "events": [
      "Major event 1",
      "Major event 2"
    ]
  },
  "images": [],
  "colorScheme": {
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR",
    "accent": "#HEX_COLOR"
  },
  "quickFacts": [
    "Interesting fact 1",
    "Interesting fact 2",
    "Interesting fact 3"
  ],
  "videos": [
    {
      "youtubeId": "YOUTUBE_VIDEO_ID",
      "title": "Video Title",
      "type": "fight|comedy|lore|scenic",
      "description": "What happens in this video",
      "featured": true,
      "order": 1
    }
  ]
}
```

### Step 3: Determine Coordinates

The map uses a 0-100 coordinate system:
- `x`: 0 (left) to 100 (right)
- `y`: 0 (top) to 100 (bottom)

To find coordinates:
1. Open the map at `http://localhost:3000`
2. Visually estimate where your location should appear
3. Test different coordinates until the hotspot is positioned correctly

### Step 4: Choose Color Scheme

Pick colors that reflect the location's theme:
- **Primary**: Main color for the hotspot and highlights
- **Secondary**: Used for subtitles and accents
- **Accent**: Used for borders and call-outs

Use hex color codes (e.g., `#FF5733`).

### Step 5: Find YouTube Videos

Search for:
- Key battles or fights
- Emotional or important lore moments
- Comedy scenes
- Scenic shots of the location

Get the video ID from the URL:
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID: `dQw4w9WgXcQ`

Mark one video as `"featured": true` to display in the hero section.

### Step 6: Submit Your Contribution

1. Fork the repository
2. Create a new branch: `git checkout -b add-location-name`
3. Add your JSON file to `/data/locations/`
4. Test locally:
   ```bash
   npm run db:seed
   npm run dev
   ```
5. Commit your changes: `git commit -m "Add [Location Name] to the map"`
6. Push to your fork: `git push origin add-location-name`
7. Open a Pull Request

## ✏️ Editing Existing Locations

To improve existing location data:

1. Find the location's JSON file in `/data/locations/`
2. Make your changes
3. Run `npm run db:seed` to update the database
4. Test your changes at `http://localhost:3000`
5. Submit a Pull Request with a clear description of changes

## 🐛 Reporting Bugs

When reporting bugs, please include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors (if any)

## 💡 Suggesting Features

Open an issue with:

- Clear feature description
- Use case / problem it solves
- Potential implementation approach
- Mockups or examples (if applicable)

## 📜 Code Style Guidelines

- **TypeScript**: Use proper types, avoid `any`
- **Components**: Keep components small and focused
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **Comments**: Add comments for complex logic
- **Formatting**: Run the linter before committing

## 🎨 UI/UX Contributions

If contributing to the interface:

- Maintain the current design language
- Ensure responsive design (mobile and desktop)
- Test animations for smoothness
- Consider accessibility (color contrast, keyboard navigation)
- Follow Tailwind CSS conventions

## 📚 Lore Accuracy

Please ensure:

- Information is accurate to the manga/anime
- Citations or sources for controversial information
- Spoiler warnings for recent content
- Respect canon vs. non-canon distinctions

## ⚖️ Content Guidelines

- Keep descriptions family-friendly
- Focus on factual lore over opinions
- Avoid excessive spoilers in quick facts
- Be respectful and inclusive
- No plagiarism - write in your own words

## 🙌 Recognition

Contributors will be recognized in:

- GitHub contributors page
- Project README
- Release notes

## ❓ Questions?

- Open an issue for questions
- Check existing issues first
- Join discussions in open PRs

Thank you for helping to build the ultimate One Piece lore resource! 🏴‍☠️


