# 🖼️ Images Directory

This directory contains all static images for the One Piece Lore Map.

## 📁 Directory Structure

```
images/
├── characters/        # Character portraits and avatars
│   ├── skypeia/
│   ├── sabaody/
│   ├── wano/
│   ├── dressrosa/
│   └── egghead/
├── locations/         # Location backgrounds and scenery
└── items/            # Item icons and images
```

## 🎯 Quick Start

### Adding Character Images

1. **Download images** from One Piece Wiki or other sources
2. **Save to the correct location folder**:
   - Example: `characters/skypeia/enel.jpg`
3. **Use the image manager script**:
   ```bash
   npm run images:missing    # See what you need
   node scripts/image-manager.js batch skypeia    # Auto-add images
   ```

## 📸 Image Guidelines

### Character Avatars

- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px minimum
- **Aspect Ratio**: Square (1:1) preferred
- **File Naming**: Lowercase with hyphens
  - ✅ `monkey-d-luffy.jpg`
  - ❌ `Monkey D. Luffy.jpg`

### File Naming Convention

The image manager automatically converts names:
- "Enel" → `enel.jpg`
- "Gan Fall" → `gan-fall.jpg`
- "Monkey D. Luffy" → `monkey-d-luffy.jpg`

## 🔗 Where to Find Images

### Recommended Sources

1. **One Piece Wiki** (onepiece.fandom.com)
   - Most reliable source
   - High quality character portraits
   - Consistent styling

2. **Official Anime Screenshots**
   - Crunchyroll, Netflix
   - Best for consistency

3. **Manga Colored Versions**
   - Fan-colored manga panels
   - Often high quality

### Quick Download

Use the image manager to get wiki URLs:

```bash
node scripts/image-manager.js wiki skypeia
```

Then right-click portraits on the wiki and save to the appropriate folder.

## 📊 Current Status

Run this to see how many images you have:

```bash
npm run images:missing    # Characters without images
npm run images:verify     # Check if files exist
```

## 💡 Tips

- Start with main characters first (protagonists and antagonists)
- Try to use images from the same source for consistency
- The app shows character initials as a fallback if no image is provided
- You can use external URLs instead of local files if preferred

## 🛠️ Image Manager Commands

```bash
# See all characters
npm run images:list

# Find missing images
npm run images:missing

# Generate wiki download links
node scripts/image-manager.js wiki <location>

# Batch add images (auto-detect by filename)
node scripts/image-manager.js batch <location>

# Interactive add (custom filenames)
node scripts/image-manager.js add <location>

# Verify all image paths
npm run images:verify
```

## 📝 Notes

- All paths in JSON are relative to `/public`
- Example: `/images/characters/skypeia/enel.jpg`
- Images are served statically by Next.js
- No restart needed when adding new images (just refresh browser)

---

**Need help?** Check `scripts/README.md` for detailed workflow examples.
