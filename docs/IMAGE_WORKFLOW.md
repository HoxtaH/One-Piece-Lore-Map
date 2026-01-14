# 🖼️ Image Workflow Guide

Complete guide for adding character images to your One Piece Lore Map.

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Step-by-Step Tutorial](#-step-by-step-tutorial)
3. [Batch Processing](#-batch-processing)
4. [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### TL;DR - 3 Simple Steps:

```bash
# 1. Check what images are needed
node scripts/check-image-coverage.js

# 2. Add your images to the correct folders
#    (see naming convention below)

# 3. Run batch processor
node scripts/add-images.js --apply
```

---

## 📖 Step-by-Step Tutorial

### Step 1: Check Current Status

Run the coverage checker to see what you need:

```bash
node scripts/check-image-coverage.js
```

**Output shows:**
- ✅ Characters that already have images
- ❌ Characters that need images
- 📁 Expected filename for each character

### Step 2: Gather Images

**Option A: Download from One Piece Wiki**

1. Visit https://onepiece.fandom.com/
2. Search for character (e.g., "Enel")
3. Right-click on character portrait
4. Save image as `enel.jpg`

**Option B: Use AI to Generate Placeholders**

```bash
# If you have Midjourney/DALL-E access
Prompt: "One Piece anime style portrait of Enel, god of Skypeia, official anime art"
```

**Option C: Anime Screenshots**

- Take HD screenshots from Crunchyroll/Netflix
- Crop to character portrait

### Step 3: Rename Images

Use the naming convention shown in coverage report:

| Character Name | Filename |
|----------------|----------|
| Enel | `enel.jpg` |
| Gan Fall | `gan-fall.jpg` |
| Monkey D. Luffy | `monkey-d-luffy.jpg` |
| Trafalgar Law | `trafalgar-law.jpg` |

**Rules:**
- All lowercase
- Replace spaces with hyphens (`-`)
- Remove apostrophes and periods
- Use `.jpg`, `.png`, or `.webp`

### Step 4: Place in Correct Directory

```
public/images/characters/
├── skypeia/
│   ├── enel.jpg          ← Add here
│   ├── gan-fall.jpg
│   └── wyper.jpg
├── sabaody/
│   ├── rayleigh.jpg
│   └── shakky.jpg
└── wano/
    ├── kozuki-oden.jpg
    └── kaido.jpg
```

### Step 5: Test Individual Image (Optional)

You can manually test by editing the JSON directly:

**`data/locations/skypeia.json`:**
```json
{
  "name": "Enel",
  "role": "Self-proclaimed God",
  "avatar": "/images/characters/skypeia/enel.jpg"  ← Add this line
}
```

Refresh your browser → Check if image appears on the character card.

### Step 6: Run Batch Processor

**Dry run first (preview changes):**
```bash
node scripts/add-images.js
```

**Apply changes:**
```bash
node scripts/add-images.js --apply
```

**Process only one location:**
```bash
node scripts/add-images.js --location=skypeia --apply
```

### Step 7: Verify Results

1. Restart dev server (if using local mode):
   ```bash
   npm run dev
   ```

2. Navigate to location (e.g., http://localhost:3000/locations/skypeia)

3. Go to "People" tab

4. Check that character cards show images instead of initials

5. Click a card → Modal should show larger image

---

## 🔄 Batch Processing

### Example: Adding 5 Characters at Once

**1. Prepare your images:**
```
public/images/characters/skypeia/
├── enel.jpg         (400x400, 150KB)
├── gan-fall.jpg     (400x400, 180KB)
├── wyper.jpg        (400x400, 160KB)
├── conis.jpg        (400x400, 140KB)
└── pagaya.jpg       (400x400, 155KB)
```

**2. Run batch processor:**
```bash
node scripts/add-images.js --apply
```

**3. Output:**
```
🖼️  One Piece Lore Map - Batch Image Processor

💾 APPLY MODE - Files will be updated

📍 Processing: Skypeia (skypeia)
────────────────────────────────────────────────────────────
  ✅ Enel - Found: /images/characters/skypeia/enel.jpg
  ✅ Gan Fall - Found: /images/characters/skypeia/gan-fall.jpg
  ✅ Wyper - Found: /images/characters/skypeia/wyper.jpg
  ✅ Conis - Found: /images/characters/skypeia/conis.jpg
  ✅ Pagaya - Found: /images/characters/skypeia/pagaya.jpg

  Summary: ✅ 5 added | ⏭️  0 skipped | ❌ 0 not found

💾 Saving changes...
  ✅ Updated: skypeia.json

📈 Total characters updated: 5
```

### Bulk Download Tips

**For Wiki Images:**
1. Open wiki category page (e.g., Skypeia Characters)
2. Use browser extension "Download All Images"
3. Bulk rename with tool like "Bulk Rename Utility"
4. Move to correct directory

**Batch Rename Example (PowerShell):**
```powershell
# Convert spaces to hyphens
Get-ChildItem *.jpg | Rename-Item -NewName { $_.Name.ToLower().Replace(" ", "-") }
```

---

## 🐛 Troubleshooting

### Issue: Image Not Showing

**Check 1: File Path**
```bash
# Verify file exists
ls public/images/characters/skypeia/enel.jpg
```

**Check 2: Filename Casing**
- Windows is case-insensitive, but production servers are not
- Always use lowercase

**Check 3: JSON Updated**
```bash
# Check if avatar field was added
node scripts/check-image-coverage.js
```

**Check 4: Browser Cache**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: Script Not Finding Image

**Problem: Name mismatch**

Script normalizes names. Check the expected filename:
```bash
node scripts/check-image-coverage.js
```

Compare to your actual filename:
```bash
ls public/images/characters/skypeia/
```

**Example mismatch:**
- Character name: `Gan Fall`
- Your file: `GanFall.jpg` ❌
- Expected: `gan-fall.jpg` ✅

### Issue: Low Image Quality

**Solution: Use higher resolution**
- Minimum: 400x400px
- Recommended: 800x800px
- Compress with https://squoosh.app

### Issue: Large File Sizes

**Solution: Compress images**
```bash
# Install imagemagick (Windows)
choco install imagemagick

# Compress all JPGs
magick mogrify -quality 85 -resize 400x400 public/images/characters/skypeia/*.jpg
```

Or use online tool: https://squoosh.app

---

## 📊 Tracking Progress

### Create a Checklist

```bash
# Generate list of needed images
node scripts/check-image-coverage.js > image-todo.txt
```

### Priority Order

Suggested order for best impact:

1. **Main Antagonists** (Enel, Doflamingo, Kaido)
   - Most visually important
   - High user interest

2. **Main Allies** (Gan Fall, Rayleigh, Oden)
   - Supporting cast importance

3. **Citizens** (Conis, Pagaya)
   - Fill out the world

4. **Minor Characters**
   - Complete the collection

---

## 🎯 Example: Complete Skypeia in 10 Minutes

**Step 1:** Visit wiki (2 min)
- https://onepiece.fandom.com/wiki/Category:Skypiea_Characters

**Step 2:** Download 11 character portraits (3 min)
- Right-click each, save as character name

**Step 3:** Rename files (2 min)
```
Enel.png          → enel.jpg
Gan Fall.png      → gan-fall.jpg
Wyper.png         → wyper.jpg
... etc
```

**Step 4:** Move to directory (1 min)
```bash
Move-Item *.jpg public/images/characters/skypeia/
```

**Step 5:** Run script (1 min)
```bash
node scripts/add-images.js --location=skypeia --apply
```

**Step 6:** Test in browser (1 min)
- Visit http://localhost:3000/locations/skypeia
- Go to People tab
- Verify all 11 characters have images ✅

---

## 📚 Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [One Piece Wiki](https://onepiece.fandom.com/)
- [Squoosh Image Compressor](https://squoosh.app/)
- [Bulk Rename Utility](https://www.bulkrenameutility.co.uk/)

---

## 💡 Pro Tips

1. **Start with one location** - Test the workflow before batch processing all locations

2. **Use consistent sources** - All wiki images or all anime screenshots for visual consistency

3. **Compress before uploading** - Save bandwidth and loading time

4. **Keep originals** - Save high-res versions separately in case you need them

5. **Git ignore large files** - Add `*.psd` or raw files to `.gitignore`

6. **Use WebP format** - Better compression than JPG, supported by Next.js Image

7. **Lazy loading** - Already built-in with Next.js Image component

---

**Ready to add images?** Start with:
```bash
node scripts/check-image-coverage.js
```

Then follow the steps above! 🎨

