# Location Banner Images

This folder contains custom banner images for location detail pages.

## 📐 Image Specifications

**Dimensions:**
- **Width**: 1920px (recommended)
- **Height**: 500-600px
- **Aspect Ratio**: 16:9 or 21:9 (cinematic)
- **Format**: WebP (preferred) or JPEG
- **File Size**: < 500KB (optimize for web)

## 📝 Naming Convention

Use the location slug as the filename:

```
wano-banner.jpg
alabasta-banner.jpg
dressrosa-banner.jpg
whole-cake-island-banner.jpg
sabaody-archipelago-banner.jpg
```

## 🎨 Banner Content Guidelines

**Good Banner Images:**
- Wide landscape shots of the location
- Iconic landmarks or scenery
- Key characters in front of location backdrop
- Atmospheric/cinematic compositions
- High-quality fan art or official artwork
- Panoramic views

**Avoid:**
- Low resolution images
- Blurry or pixelated images
- Busy compositions with too many elements
- Dark images that lose detail

## 🔧 How to Add a Banner

1. **Find or create a high-quality image** for your location
2. **Optimize the image:**
   - Resize to 1920x600px
   - Compress to < 500KB
   - Convert to WebP if possible
3. **Save to this folder** with the location slug as filename
4. **Add to location JSON:**

```json
{
  "slug": "wano",
  "name": "Wano Country",
  "banner": "/images/banners/wano-banner.jpg",
  // ... rest of data
}
```

## 🔄 Fallback Behavior

If no `banner` field is set in the location JSON, the system will automatically use the featured video's YouTube thumbnail as the banner image.

**Priority:**
1. Custom `banner` field (if set)
2. Featured video thumbnail (auto-generated from YouTube)
3. First video thumbnail (if no featured video)
4. No banner (if no videos)

## 📂 Recommended Banners for Key Locations

### East Blue Saga
- **Dawn Island**: Windmill Village with Luffy's ship
- **Shell Town**: Marine Base 153
- **Orange Town**: Buggy's circus tent
- **Syrup Village**: Going Merry at the coast
- **Baratie**: Floating restaurant at sea
- **Arlong Park**: Arlong Park tower
- **Loguetown**: Execution platform

### Alabasta Saga
- **Reverse Mountain**: Waterfalls meeting point
- **Whiskey Peak**: Cactus rock formations
- **Little Garden**: Giant dinosaurs and jungle
- **Drum Island**: Snowy mountains and cherry blossoms
- **Alabasta**: Palace and desert landscape

### Sky Island Saga
- **Jaya**: Mock Town tavern
- **Skypeia**: Cloud sea and Upper Yard

### Water 7 Saga
- **Long Ring Long Land**: Circular island
- **Water 7**: Aqua Laguna wave
- **Enies Lobby**: Gates of Justice
- **Sea Train**: Puffing Tom on tracks

### Thriller Bark Saga
- **Thriller Bark**: Ghost ship at night
- **Sabaody Archipelago**: Mangrove bubbles

### Summit War Saga
- **Amazon Lily**: Kuja Palace
- **Impel Down**: Prison levels
- **Marineford**: War battlefield

### Fish-Man Island Saga
- **Fish-Man Island**: Coral underwater palace

### Dressrosa Saga
- **Punk Hazard**: Fire and ice sides
- **Dressrosa**: Colosseum and Flower Hill

### Whole Cake Island Saga
- **Zou**: Elephant back with city
- **Whole Cake Island**: Chateau and candy landscape

### Wano Saga
- **Wano**: Flower Capital or Onigashima

### Final Saga
- **Egghead**: Futuristic lab island
- **Mary Geoise**: Pangaea Castle

## 🛠️ Image Optimization Tools

**Online:**
- TinyPNG - https://tinypng.com
- Squoosh - https://squoosh.app
- CloudConvert - https://cloudconvert.com

**Desktop:**
- Adobe Photoshop (Export for Web)
- GIMP (Free alternative)
- ImageOptim (Mac)
- FileOptimizer (Windows)

## ✅ Testing Your Banner

1. Add the banner to this folder
2. Update the location JSON with the `banner` field
3. Navigate to the location detail page
4. Verify the banner displays correctly
5. Check that it looks good on mobile devices
