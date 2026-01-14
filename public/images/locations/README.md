# 🗺️ Location Images Directory

This directory contains images for **sub-locations** (Places tab) within each main location.

## 📁 Directory Structure

```
locations/
├── skypeia/
│   ├── upper-yard.jpg
│   ├── angel-island.jpg
│   └── gods-shrine.jpg
├── sabaody-archipelago/
├── wano/
├── dressrosa/
├── egghead/
├── dawn-island/
├── shell-town/
├── orange-town/
├── syrup-village/
├── baratie/
├── arlong-park/
└── loguetown/
```

## 🎯 Purpose

These images appear in the **"Places" tab** of each location's detail page, showing:
- Key areas within the location
- Landmarks and buildings
- Memorable scenes and settings

## 📸 Image Guidelines

### **Format & Size**
- **Format**: JPG, PNG, or WebP
- **Dimensions**: 800x600px recommended (landscape)
- **Aspect Ratio**: 4:3 or 16:9 works well
- **File Size**: Under 500KB per image

### **File Naming**
Use kebab-case matching the sub-location name:

```
"Upper Yard" → upper-yard.jpg
"Angel Island" → angel-island.jpg
"God's Shrine" → gods-shrine.jpg
"Party's Bar" → partys-bar.jpg
```

## 💡 How to Add

### **Step 1: Find Sub-locations**
Check the location's JSON file for `subLocations` array:

```json
"subLocations": [
  {
    "name": "Upper Yard",
    "type": "sacred land",
    "description": "The original landmass of Jaya...",
    "image": "/images/locations/skypeia/upper-yard.jpg"  // ← Add this field
  }
]
```

### **Step 2: Download Images**
**Best Sources**:
1. One Piece Wiki (onepiece.fandom.com)
2. Official anime screenshots
3. Manga panels (colored versions)
4. Official artwork

### **Step 3: Save Images**
Save to the appropriate location folder:
```
public/images/locations/[location-slug]/[place-name].jpg
```

### **Step 4: Add to JSON**
Add the `image` field to the sub-location:

```json
{
  "name": "Upper Yard",
  "type": "sacred land",
  "description": "...",
  "image": "/images/locations/skypeia/upper-yard.jpg",
  "notableFeatures": [...]
}
```

### **Step 5: Test**
- Save the JSON file (changes are instant in local mode)
- Refresh browser
- Navigate to location → Places tab
- See the beautiful image! 🎉

## 🎨 Image Tips

### **What Makes a Good Place Image**
- ✅ Shows the overall area/atmosphere
- ✅ Recognizable from the anime/manga
- ✅ Good lighting and composition
- ✅ Captures the mood of the location

### **Examples**
- **Upper Yard**: Wide shot of the ancient ruins
- **Arlong Park**: The fortress with saw-shark tower
- **Baratie**: The fish-shaped restaurant exterior
- **Kaya's Mansion**: The grand estate exterior

### **Avoid**
- ❌ Character-focused shots (use character images instead)
- ❌ Very dark or unclear images
- ❌ Heavily watermarked images
- ❌ Low resolution images

## 📊 Current Status

Run this to see which locations have sub-locations:

```bash
# Check JSON files for subLocations
grep -l "subLocations" data/locations/*.json
```

**Locations with sub-locations**:
- ✅ Skypeia (5 sub-locations)
- ✅ Dawn Island (4 sub-locations)
- ✅ Shell Town (3 sub-locations)
- ✅ Orange Town (4 sub-locations)
- ✅ Syrup Village (4 sub-locations)
- ✅ Baratie (4 sub-locations)
- ✅ Arlong Park (4 sub-locations)
- ✅ Loguetown (5 sub-locations)

**Total Sub-locations**: 37+ across all locations

## 🔍 Finding Images on One Piece Wiki

### **Search Pattern**
```
1. Go to: https://onepiece.fandom.com/wiki/[Location_Name]
2. Look for "Gallery" section
3. Find images of:
   - Location exteriors
   - Key landmarks
   - Memorable scenes
4. Right-click → Save image
5. Name it matching the sub-location
```

### **Example: Skypeia**
```
https://onepiece.fandom.com/wiki/Skypiea
- Find Upper Yard images
- Find Angel Island images
- Find God's Shrine images
- Save to: public/images/locations/skypeia/
```

## 📝 Example Usage

### **Before** (No Image):
```json
{
  "name": "Upper Yard",
  "type": "sacred land",
  "description": "The original landmass of Jaya...",
  "notableFeatures": ["Golden Bell", "Ancient Ruins"]
}
```

**UI Shows**: Just text

---

### **After** (With Image):
```json
{
  "name": "Upper Yard",
  "type": "sacred land",
  "description": "The original landmass of Jaya...",
  "image": "/images/locations/skypeia/upper-yard.jpg",
  "notableFeatures": ["Golden Bell", "Ancient Ruins"]
}
```

**UI Shows**: Beautiful image with gradient overlay + text below

## 🎯 Priority Locations for Images

Start with iconic locations:
1. **Skypeia** - Upper Yard, Golden Bell
2. **Arlong Park** - The fortress
3. **Baratie** - The fish restaurant
4. **Loguetown** - Execution platform
5. **Dawn Island** - Party's Bar

Then expand to all others!

---

**Note**: Sub-location images are **optional** - locations without images still look good with just text. Add them gradually for maximum visual impact! 🌟




