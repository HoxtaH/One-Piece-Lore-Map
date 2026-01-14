# 🛠️ One Piece Lore Map - Scripts

This directory contains utility scripts to help manage the One Piece Lore Map project.

## 📸 Image Manager (`image-manager.js`)

A comprehensive tool to help you add and manage character images.

### Quick Start

```bash
# See all available commands
node scripts/image-manager.js

# Or use the npm shortcuts
npm run images:list
npm run images:missing
```

---

## 🎯 Common Workflows

### **Workflow 1: Finding Which Characters Need Images**

```bash
# List all characters with their image status
node scripts/image-manager.js missing
```

**Output:**
```
🔍 Characters Missing Images:

🏝️  Skypeia (11 missing)
────────────────────────────────────────────────────────────
  1. Enel
     Role: Self-proclaimed God / Former Ruler
     Suggested filename: enel.jpg
  2. Gan Fall
     Role: Former God of Skypeia / Knight of the Sky
     Suggested filename: gan-fall.jpg
  ...
```

---

### **Workflow 2: Getting Download Links**

Generate direct wiki URLs for each character:

```bash
node scripts/image-manager.js wiki skypeia
```

**Output:**
```
🔗 One Piece Wiki URLs for Skypeia:

❌ Enel
   https://onepiece.fandom.com/wiki/Enel
   Save as: enel.jpg

❌ Gan Fall
   https://onepiece.fandom.com/wiki/Gan_Fall
   Save as: gan-fall.jpg
```

**Then:**
1. Click each URL
2. Right-click on character portrait → Save image as...
3. Save to `public/images/characters/skypeia/[name].jpg`

---

### **Workflow 3: Batch Adding Images (Auto-detect)**

If you've downloaded images with matching filenames:

```bash
# 1. Download images to: public/images/characters/skypeia/
#    - enel.jpg
#    - gan-fall.jpg
#    - wyper.jpg

# 2. Run batch add (auto-detects files)
node scripts/image-manager.js batch skypeia
```

**Output:**
```
✅ Enel - Added: enel.jpg
✅ Gan Fall - Added: gan-fall.jpg
✅ Wyper - Added: wyper.jpg
❌ Conis - No image found (expected: conis.jpg)

✅ Batch updated 3 character(s) in skypeia.json
```

---

### **Workflow 4: Interactive Adding (Custom filenames)**

If your filenames don't match exactly:

```bash
node scripts/image-manager.js add skypeia
```

**Prompts you for each character:**
```
❌ Enel
   Role: Self-proclaimed God / Former Ruler
   Suggested: enel.jpg
   Enter filename (or press Enter to skip): enel-portrait.png

   ✅ Added: /images/characters/skypeia/enel-portrait.png
```

---

### **Workflow 5: Verifying All Images**

Check if all image paths actually point to real files:

```bash
node scripts/image-manager.js verify
```

**Output:**
```
🔍 Verifying Image Files:

🏝️  Skypeia
────────────────────────────────────────────────────────────
  ✅ Enel - /images/characters/skypeia/enel.jpg
  ❌ Gan Fall - /images/characters/skypeia/gan-fall.jpg (FILE NOT FOUND)
  ✅ Wyper - /images/characters/skypeia/wyper.jpg

📊 Summary:
   Total checked: 3
   Found: 2
   Missing files: 1
```

---

## 📋 All Commands

| Command | Description |
|---------|-------------|
| `list` | List all characters across all locations |
| `missing` | Show only characters without images |
| `wiki <location>` | Generate One Piece Wiki URLs for downloading |
| `verify` | Check if image files actually exist |
| `add <location>` | Interactive: Add images one by one |
| `batch <location>` | Automatic: Add images by matching filenames |

---

## 🗺️ Valid Locations

When running commands, use these **exact** location slugs:

- `skypeia`
- `sabaody-archipelago` ⚠️ (full name, not `sabaody`)
- `wano`
- `dressrosa`
- `egghead`

**Note**: The directory name must match the slug exactly!

---

## 💡 Tips & Best Practices

### **Image Requirements**
- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px minimum (for retina displays)
- **Aspect Ratio**: Square (1:1) works best
- **File Naming**: Use lowercase with hyphens
  - ✅ `monkey-d-luffy.jpg`
  - ❌ `Monkey D. Luffy.jpg`

### **Filename Conventions**
The script auto-generates filenames by:
1. Converting to lowercase
2. Replacing spaces/special chars with hyphens
3. Removing extra hyphens

**Examples:**
- "Monkey D. Luffy" → `monkey-d-luffy.jpg`
- "Roronoa Zoro" → `roronoa-zoro.jpg`
- "Nico Robin" → `nico-robin.jpg`

### **Download Sources**

**Best Sources:**
1. **One Piece Wiki** (onepiece.fandom.com)
   - Most reliable
   - High quality
   - Consistent style

2. **Official Anime Screenshots**
   - Crunchyroll, Netflix
   - Consistent art style

3. **Manga Colored Versions**
   - Fan-colored manga panels
   - High quality

**Avoid:**
- Low resolution images
- Fan art with inconsistent styles (unless intentional)
- Watermarked images

---

## 🔄 Recommended Workflow

```bash
# Step 1: See what you need
node scripts/image-manager.js missing

# Step 2: Get download links for a location
node scripts/image-manager.js wiki skypeia

# Step 3: Download images from wiki
# (Manual: Visit URLs, save images to public/images/characters/skypeia/)

# Step 4: Auto-add the images
node scripts/image-manager.js batch skypeia

# Step 5: Verify everything worked
node scripts/image-manager.js verify

# Step 6: View in app!
npm run dev
# Visit http://localhost:3000/locations/skypeia → People tab
```

---

## 🐛 Troubleshooting

**Q: "FILE NOT FOUND" error?**
- Check the file is in the correct directory
- Verify filename matches exactly (case-sensitive on some systems)
- Run `node scripts/image-manager.js verify` to see which files are missing

**Q: Images not showing in the app?**
- Make sure you're in LOCAL mode (`DATA_SOURCE=local` in `.env.local`)
- Restart the dev server: `npm run dev`
- Hard refresh browser: `Ctrl+F5` or `Cmd+Shift+R`

**Q: Can I use external URLs?**
- Yes! Instead of downloading, you can use direct image URLs:
  ```json
  "avatar": "https://static.wikia.nocookie.net/onepiece/images/..."
  ```
- But local files are faster and more reliable

---

## 🚀 Advanced Usage

### Scripting Multiple Locations

```bash
# Add images to all locations at once
for loc in skypeia sabaody-archipelago wano dressrosa egghead; do
  node scripts/image-manager.js batch $loc
done
```

### Custom Image Processing

If you want to resize/optimize images:

```bash
# Using ImageMagick (install separately)
cd public/images/characters/skypeia
for img in *.jpg; do
  convert "$img" -resize 400x400^ -gravity center -extent 400x400 "optimized-$img"
done
```

---

## 📝 Notes

- The script modifies your JSON files directly
- Always commit changes to Git after batch updates
- The `avatar` field is optional - characters without images show initials
- You can mix local files and external URLs in the same location

---

Happy image collecting! 🎨🗺️
