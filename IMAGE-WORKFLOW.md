# 🎨 Quick Reference: Adding Character Images

> **⚠️ Important**: Use the full location name when running commands:
> - Use `sabaody-archipelago` (not `sabaody`)
> - Run: `node scripts/image-manager.js batch sabaody-archipelago`

## 🚀 5-Minute Workflow

### Step 1: See What You Need
```bash
npm run images:missing
```

### Step 2: Get Download Links
```bash
node scripts/image-manager.js wiki skypeia
```

### Step 3: Download Images
1. Click each wiki URL
2. Right-click character portrait → **Save image as...**
3. Save to: `public/images/characters/skypeia/[name].jpg`

### Step 4: Auto-Add to JSON
```bash
node scripts/image-manager.js batch skypeia
```

### Step 5: Verify & View
```bash
npm run images:verify
npm run dev
# Visit http://localhost:3000/locations/skypeia → People tab
```

---

## 📁 Where to Save Images

```
public/
  └── images/
      └── characters/
          ├── skypeia/               ← Skypeia characters here
          ├── sabaody-archipelago/   ← Sabaody characters here
          ├── wano/                  ← Wano characters here
          ├── dressrosa/             ← Dressrosa characters here
          └── egghead/               ← Egghead characters here
```

---

## 🎯 File Naming Examples

| Character Name | Save As |
|---------------|---------|
| Enel | `enel.jpg` |
| Gan Fall | `gan-fall.jpg` |
| Monkey D. Luffy | `monkey-d-luffy.jpg` |
| Roronoa Zoro | `roronoa-zoro.jpg` |
| Trafalgar Law | `trafalgar-law.jpg` |

**Rule**: Lowercase, replace spaces with hyphens

---

## 🛠️ All Commands

| Command | What It Does |
|---------|-------------|
| `npm run images:missing` | Show characters without images |
| `npm run images:list` | List all characters |
| `npm run images:verify` | Check if image files exist |
| `node scripts/image-manager.js wiki <location>` | Get wiki download URLs |
| `node scripts/image-manager.js batch <location>` | Auto-add images by filename |
| `node scripts/image-manager.js add <location>` | Interactive add (custom names) |

---

## 📊 Current Status

**Total Characters**: 40  
**With Images**: 0  
**Missing**: 40

Run `npm run images:missing` to see the latest count.

---

## 💡 Pro Tips

1. **Batch Download First**: Get 5-10 images before running batch add
2. **Use Wiki**: Most consistent source for character portraits
3. **Square Images Work Best**: 400x400px minimum for quality
4. **Don't Worry About All Images**: Initials fallback looks good too!
5. **No Restart Needed**: Just refresh browser after adding images

---

## 🎨 Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px minimum (for retina displays)
- **Ratio**: Square (1:1) preferred for circular avatars
- **Quality**: High resolution preferred

---

## 🔗 Download Sources

### Best Sources (in order):
1. **One Piece Wiki** (onepiece.fandom.com) - Most reliable ✅
2. **Crunchyroll/Netflix** - Anime screenshots
3. **Colored Manga** - Fan-colored panels
4. **Official Art** - From One Piece official site

### Avoid:
- Low resolution images
- Heavily watermarked images
- Inconsistent art styles

---

## 🐛 Troubleshooting

**Images not showing?**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Check file path matches exactly
- Run `npm run images:verify` to find issues

**Wrong filename?**
- The script suggests the exact filename to use
- Or run interactive mode: `node scripts/image-manager.js add skypeia`

**Want to use external URLs?**
- You can! Just add the URL directly:
  ```json
  "avatar": "https://example.com/image.jpg"
  ```

---

## 📝 Example Workflow for Skypeia

```bash
# 1. See what you need
npm run images:missing
# Shows: 11 characters missing from Skypeia

# 2. Get wiki links
node scripts/image-manager.js wiki skypeia
# Copy URLs and download images

# 3. Save images to:
# public/images/characters/skypeia/enel.jpg
# public/images/characters/skypeia/gan-fall.jpg
# public/images/characters/skypeia/wyper.jpg
# ... etc

# 4. Batch add them
node scripts/image-manager.js batch skypeia
# ✅ Enel - Added: enel.jpg
# ✅ Gan Fall - Added: gan-fall.jpg
# ✅ Wyper - Added: wyper.jpg

# 5. Verify it worked
npm run images:verify
# ✅ Enel - /images/characters/skypeia/enel.jpg
# ✅ Gan Fall - /images/characters/skypeia/gan-fall.jpg

# 6. View in app
npm run dev
# Visit: http://localhost:3000/locations/skypeia
# Click "People" tab → See beautiful character cards! 🎉
```

---

**For more details**: See `scripts/README.md` and `public/images/README.md`

**Questions?** The scripts will guide you with suggestions and examples! 🚀

