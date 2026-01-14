# 🎭 Character Images

Add character portrait images here, organized by location/arc.

## 📝 Quick Start

1. **Download** character images from [One Piece Wiki](https://onepiece.fandom.com/)
2. **Rename** to match character name (lowercase, hyphens)
3. **Place** in the appropriate location folder
4. **Run** batch script to update JSON files

## 📂 Example Structure

```
skypeia/
├── enel.jpg
├── gan-fall.jpg
├── wyper.jpg
├── conis.jpg
└── pagaya.jpg

sabaody/
├── rayleigh.jpg
├── shakky.jpg
├── duval.jpg
└── camie.jpg
```

## 🎯 Naming Examples

| Character Name | Filename |
|---------------|----------|
| Monkey D. Luffy | `monkey-d-luffy.jpg` |
| Enel | `enel.jpg` |
| Gan Fall | `gan-fall.jpg` |
| Nico Robin | `nico-robin.jpg` |
| Trafalgar Law | `trafalgar-law.jpg` |

## 📏 Image Specs

- **Size**: 400x400px minimum
- **Format**: JPG, PNG, or WebP
- **Quality**: 85-95% for JPG
- **Ratio**: Square (1:1) preferred

## 🔄 Auto-Update

After adding images, run:

```bash
# Preview changes
node scripts/add-images.js

# Apply changes
node scripts/add-images.js --apply
```

This will automatically add `avatar` fields to your JSON files!

## 🌐 Where to Find Images

### Best Sources:
1. **One Piece Wiki** - https://onepiece.fandom.com/
   - Click on character → Right-click portrait → Save image
2. **Anime Screenshots** - Netflix, Crunchyroll (HD quality)
3. **Official Art** - Volume covers, color spreads

### Quick Links:
- [Skypeia Characters](https://onepiece.fandom.com/wiki/Category:Skypiea_Characters)
- [Sabaody Characters](https://onepiece.fandom.com/wiki/Category:Sabaody_Archipelago_Characters)
- [Wano Characters](https://onepiece.fandom.com/wiki/Category:Wano_Country_Characters)
- [Dressrosa Characters](https://onepiece.fandom.com/wiki/Category:Dressrosa_Characters)

## 📊 Check Coverage

See which characters need images:

```bash
node scripts/check-image-coverage.js
```

