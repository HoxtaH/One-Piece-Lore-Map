# 🖼️ Images Quick Start

Everything you need to add character images to your One Piece Lore Map!

## ✅ What's Been Set Up

### 📁 Directory Structure
```
public/images/
├── characters/
│   ├── skypeia/         ← Add Skypeia character images here
│   ├── sabaody/         ← Add Sabaody character images here
│   ├── wano/            ← Add Wano character images here
│   ├── dressrosa/       ← Add Dressrosa character images here
│   └── egghead/         ← Add Egghead character images here
├── locations/           ← For location backgrounds (future)
└── items/               ← For item icons (future)
```

### 🛠️ Scripts Created
- `scripts/add-images.js` - Batch add avatars to JSON files
- `scripts/check-image-coverage.js` - See what images you need

### 📚 Documentation
- `docs/IMAGE_WORKFLOW.md` - Complete tutorial
- `public/images/README.md` - Image specifications
- `public/images/characters/README.md` - Character image guide
- `scripts/README.md` - Script reference

---

## 🚀 3-Step Quick Start

### Step 1: Check What You Need
```bash
node scripts/check-image-coverage.js
```

This shows you:
- 40 total characters across 5 locations
- Expected filename for each character
- Current coverage: 0% (all need images!)

### Step 2: Add One Image (Test)

Let's test with Enel from Skypeia:

1. **Download image** from [One Piece Wiki - Enel](https://onepiece.fandom.com/wiki/Enel)
2. **Save as:** `enel.jpg`
3. **Move to:** `public/images/characters/skypeia/enel.jpg`

### Step 3: Run the Script
```bash
# Preview changes (safe, doesn't modify files)
node scripts/add-images.js

# You'll see:
# 📍 Processing: Skypeia
# ✅ Enel - Found: /images/characters/skypeia/enel.jpg
# ❌ Gan Fall - No image found
# ... etc

# Apply the changes
node scripts/add-images.js --apply
```

### Step 4: Test in Browser

1. Visit http://localhost:3000/locations/skypeia
2. Click "People" tab (👥)
3. Find Enel's card - should show image instead of "EN" initials!
4. Click the card - modal opens with larger image

---

## 📝 Naming Convention Cheat Sheet

| Character Name | Save As |
|---------------|---------|
| Enel | `enel.jpg` |
| Monkey D. Luffy | `monkey-d-luffy.jpg` |
| Gan Fall | `gan-fall.jpg` |
| Nico Robin | `nico-robin.jpg` |
| Trafalgar Law | `trafalgar-law.jpg` |

**Rule:** Lowercase + hyphens for spaces + remove apostrophes

---

## 🎯 Recommended Order

Add images in this order for maximum impact:

### Phase 1: Main Antagonists (High Priority)
```
public/images/characters/skypeia/enel.jpg
public/images/characters/dressrosa/donquixote-doflamingo.jpg
public/images/characters/wano/kaido.jpg
```

### Phase 2: Main Allies
```
public/images/characters/skypeia/gan-fall.jpg
public/images/characters/sabaody/silvers-rayleigh.jpg
public/images/characters/wano/kozuki-oden.jpg
```

### Phase 3: Complete Each Location
- Add all Skypeia characters (11 total)
- Then Sabaody (6 total)
- Then Wano (7 total)
- etc.

---

## 🌐 Where to Find Images

### Option 1: One Piece Wiki (Recommended)
- Visit https://onepiece.fandom.com/wiki/[Character_Name]
- Right-click portrait → Save image
- Consistent style, high quality

**Quick Links:**
- [Skypeia Characters](https://onepiece.fandom.com/wiki/Category:Skypiea_Characters)
- [Sabaody Characters](https://onepiece.fandom.com/wiki/Category:Sabaody_Archipelago_Characters)
- [Wano Characters](https://onepiece.fandom.com/wiki/Category:Wano_Country_Characters)

### Option 2: AI Generation
Use Midjourney/DALL-E with prompt:
```
"One Piece anime style portrait of [Character], official anime art style, clean background"
```

### Option 3: Anime Screenshots
- Netflix or Crunchyroll HD screenshots
- Crop to character portrait
- Save as 400x400px square

---

## 💡 Pro Tips

### Tip 1: Batch Download
1. Open wiki category page
2. Use browser extension "Download All Images"
3. Bulk rename files
4. Run script once for all images

### Tip 2: Test One First
- Add 1-2 images first to test workflow
- Verify they appear correctly in browser
- Then batch process the rest

### Tip 3: Use Compression
- Before adding, compress with https://squoosh.app
- Target: ~150KB per image
- Keeps site fast!

### Tip 4: Keep a Checklist
```bash
# Save todo list
node scripts/check-image-coverage.js > images-todo.txt

# Check off as you go
```

---

## 🐛 Common Issues

### "Image not showing in browser?"
1. Check filename exactly matches expected (case-sensitive!)
2. Hard refresh browser: `Ctrl+Shift+R`
3. Restart dev server: `npm run dev`

### "Script not finding my image?"
```bash
# Check your filename
dir public\images\characters\skypeia

# Compare to expected
node scripts/check-image-coverage.js
```

### "Image is too large/slow to load?"
- Compress with Squoosh.app
- Target: 400x400px, 150KB max

---

## 📊 Track Your Progress

Check coverage anytime:
```bash
node scripts/check-image-coverage.js

# Shows:
# Total: 40 characters
# ✅ With images: X (Y%)
# ❌ Without images: Z
```

---

## 🎉 Example: Complete Workflow

**Goal:** Add images for all Skypeia characters (10 minutes)

```bash
# 1. See what you need (30 seconds)
node scripts/check-image-coverage.js

# 2. Download 11 images from wiki (5 minutes)
#    Save as: enel.jpg, gan-fall.jpg, wyper.jpg, etc.

# 3. Move to directory (30 seconds)
Move-Item *.jpg public\images\characters\skypeia\

# 4. Preview changes (30 seconds)
node scripts/add-images.js

# 5. Apply changes (30 seconds)
node scripts/add-images.js --apply

# 6. Verify in browser (2 minutes)
#    Visit http://localhost:3000/locations/skypeia
#    Check People tab - all 11 should have images!

# 7. Check coverage
node scripts/check-image-coverage.js
#    Skypeia: 11/11 (100%) ✅
```

---

## 📚 Full Documentation

For detailed guides, see:
- **Complete tutorial:** `docs/IMAGE_WORKFLOW.md`
- **Image specs:** `public/images/README.md`
- **Script reference:** `scripts/README.md`

---

## 🚀 Ready to Start?

```bash
# Step 1: See what you need
node scripts/check-image-coverage.js

# Step 2: Add some images to public/images/characters/[location]/

# Step 3: Run the magic
node scripts/add-images.js --apply
```

**That's it!** Your character cards will now show beautiful images instead of initials. 🎨

---

**Questions?** Check `docs/IMAGE_WORKFLOW.md` for the full tutorial!

