# 🎮 Pixel Map Coordinate System Guide

**Map**: Ohara_World_Map_Pixel.png  
**Dimensions**: 10798 × 5429 pixels  
**Aspect Ratio**: ~1.989:1 (almost 2:1)  
**Coordinate System**: Pixel-based (0-10798 on X, 0-5429 on Y)

---

## 🎯 How to Find Coordinates

### **Method 1: Using Image Editor** (Recommended)

**Photoshop/GIMP**:
1. Open `Ohara_World_Map_Pixel.png`
2. Enable "Info" panel (Window → Info)
3. Hover mouse over island location
4. Note the X, Y coordinates shown
5. Use those exact values in your JSON

**Paint.NET/Krita**:
1. Open the map
2. Use the cursor position display (usually bottom-left)
3. Hover over island
4. Note X, Y values

**Online Tool**:
1. Upload to https://www.pixelmap.net or similar
2. Click on island location
3. Get X, Y coordinates

### **Method 2: Using Browser DevTools**

1. Open the map in your app
2. Open DevTools (F12) → Console
3. Run this code:
```javascript
const svg = document.querySelector('svg')
svg.addEventListener('click', (e) => {
  const rect = svg.getBoundingClientRect()
  const x = Math.round((e.clientX - rect.left) / rect.width * 10798)
  const y = Math.round((e.clientY - rect.top) / rect.height * 5429)
  console.log(`"coordinates": { "x": ${x}, "y": ${y} }`)
})
```
4. Click islands on the map
5. Coordinates appear in console!

---

## 📊 Coordinate System Explained

### **Old System** (Percentage)
```json
"coordinates": { "x": 50, "y": 50 }
```
- X: 0-100 (percentage across)
- Y: 0-100 (percentage down)
- Simple but imprecise

### **New System** (Pixel)
```json
"coordinates": { "x": 5399, "y": 2714 }
```
- X: 0-10798 (actual pixels across)
- Y: 0-5429 (actual pixels down)
- Precise, matches image editor

### **Conversion Formula**

If you have old percentage coordinates:

```javascript
// Old percentage → New pixels
const newX = Math.round((oldX / 100) * 10798)
const newY = Math.round((oldY / 100) * 5429)

// Example:
// Old: x: 50, y: 50 (center)
// New: x: 5399, y: 2714 (center)
```

---

## 🗺️ Reference Points

### **Key Coordinates on Ohara Map**

| Area | Approx X | Approx Y | Description |
|------|----------|----------|-------------|
| **Far West** | 0-2000 | 1000-3000 | West Blue |
| **North West** | 2000-4000 | 0-2000 | North Blue |
| **Center** | 4000-6000 | 2000-3500 | Grand Line center |
| **North East** | 6000-8000 | 0-2000 | North Blue |
| **Far East** | 8000-10798 | 1000-3000 | East Blue |
| **South West** | 2000-4000 | 3500-5429 | South Blue |
| **South East** | 6000-8000 | 3500-5429 | South Blue |

### **Example Coordinates**

Based on typical One Piece geography:

```json
// East Blue (Far East)
"dawn-island": { "x": 9500, "y": 2700 }
"loguetown": { "x": 9800, "y": 2700 }

// Grand Line Paradise (Center)
"reverse-mountain": { "x": 5000, "y": 2700 }
"alabasta": { "x": 4500, "y": 2700 }
"skypeia": { "x": 6000, "y": 1500 }  // Sky island (higher Y)

// Grand Line New World (West)
"dressrosa": { "x": 3000, "y": 2700 }
"wano": { "x": 2500, "y": 2700 }

// Sabaody (Red Line crossing)
"sabaody-archipelago": { "x": 5399, "y": 2714 }  // Center of map
```

**Note**: These are estimates - use image editor to get exact positions!

---

## 🛠️ Coordinate Finder Tool

### **Quick Coordinate Finder**

Add this to your browser console while viewing the map:

```javascript
// Copy-paste this into browser console:
(function() {
  const svg = document.querySelector('svg[viewBox="0 0 10798 5429"]')
  if (!svg) {
    console.error('SVG not found! Make sure you are on the map page.')
    return
  }
  
  console.log('🎮 PIXEL MAP COORDINATE FINDER ACTIVE')
  console.log('Click anywhere on the map to get coordinates!')
  console.log('---')
  
  svg.addEventListener('click', function handler(e) {
    const rect = svg.getBoundingClientRect()
    const scaleX = 10798 / rect.width
    const scaleY = 5429 / rect.height
    
    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)
    
    console.log(`📍 Coordinates: { "x": ${x}, "y": ${y} }`)
    console.log(`   Copy this to your JSON file!`)
    console.log('---')
  })
  
  console.log('✅ Click the map to get coordinates')
  console.log('To stop: Refresh the page')
})()
```

**How to use**:
1. Visit http://localhost:3000
2. Open console (F12)
3. Paste the code above
4. Click on any island
5. Coordinates appear in console
6. Copy to your JSON!

---

## 📝 Updating Location Coordinates

### **Current Locations to Update**

You have **12+ locations** that need pixel coordinates:

```javascript
// Old percentage coordinates → New pixel coordinates

// East Blue
Dawn Island:     x: 65   → x: ~9500   (estimate)
Shell Town:      x: 70   → x: ~9650
Orange Town:     x: 75   → x: ~9800
Syrup Village:   x: 80   → x: ~9900
Baratie:         x: 85   → x: ~10000
Arlong Park:     x: 90   → x: ~10100
Loguetown:       x: 95   → x: ~10200

// Grand Line
Reverse Mountain: x: ? → x: ~5000 (center, Red Line)
Skypeia:         x: 88   → x: ~6000 (sky, higher)
Sabaody:         x: 142.5 → x: ~5500 (near center)
Wano:            x: 16   → x: ~3000 (New World west)
Dressrosa:       x: -32.5 → x: ~2500 (New World west)
Egghead:         x: 20   → x: ~3200 (New World)
```

**Note**: Use the coordinate finder tool to get EXACT positions!

---

## 🎯 Updating JSON Files

### **Before** (Old system):
```json
{
  "coordinates": { "x": 65, "y": 42 }
}
```

### **After** (New pixel system):
```json
{
  "coordinates": { "x": 9500, "y": 2700 }
}
```

### **Batch Update Script**

You can update all at once:

```javascript
// update-coordinates.js
const fs = require('fs')
const path = require('path')

const conversions = {
  'dawn-island': { x: 9500, y: 2700 },
  'shell-town': { x: 9650, y: 2650 },
  // ... add all locations
}

Object.entries(conversions).forEach(([slug, coords]) => {
  const file = path.join(__dirname, 'data', 'locations', `${slug}.json`)
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  data.coordinates = coords
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  console.log(`✅ Updated ${slug}`)
})
```

---

## ✅ Testing Your Coordinates

### **Test 1: Check Alignment**
1. Refresh browser
2. Hover over a hotspot
3. Does it align with the island on the map?
4. If not, adjust coordinates in JSON

### **Test 2: Resize Browser**
1. Make browser very wide
2. Make browser very narrow
3. Hotspots should stay aligned with islands
4. If they drift, check `preserveAspectRatio` setting

### **Test 3: Zoom**
1. Zoom in on the map
2. Hotspots should zoom with the map
3. Should maintain alignment

---

## 🎨 Hotspot Size for Pixel Map

With a 10798px wide map, you'll want larger hotspots:

```typescript
// In MapHotspot.tsx
const radius = 100  // Increased from 3 (for 100x100 map) to 100 (for 10798px map)
```

**Formula**:
```
radius = (mapWidth / 100) * desiredSizeAsPercentage
radius = (10798 / 100) * 1 = ~108 pixels for 1% of map width
```

For a hotspot that's ~1% of map width, use `radius: 100-120`

---

## 🐛 Troubleshooting

### **Hotspots Not Visible?**
- Check coordinates are within 0-10798, 0-5429
- Check hotspot radius isn't too small
- Check SVG viewBox matches map dimensions

### **Hotspots Drift When Resizing?**
- Verify `preserveAspectRatio="xMidYMid meet"`
- Check both img and SVG use same positioning
- Ensure no CSS overriding positioning

### **Map Looks Blurry?**
- Verify `imageRendering: 'pixelated'` is applied
- Check browser supports pixel rendering
- Make sure no CSS is smoothing the image

---

## 📚 Next Steps

After updating coordinates:

1. **Test all locations** - Click each hotspot
2. **Adjust as needed** - Fine-tune positions
3. **Document final coordinates** - Keep a reference
4. **Move to Phase 2** - Add pixel aesthetic!

---

## 🎮 Pixel Map is Now Active!

Your new map:
- ✅ 10798 × 5429 pixels (massive detail!)
- ✅ Crisp pixel rendering
- ✅ Precise coordinate system
- ✅ Ready for island-shaped hover areas
- ✅ Perfect for zoom/pan

**Test it now**: Refresh http://localhost:3000 and see your beautiful pixel map! 🗺️✨

Use the coordinate finder tool to start updating your locations! 🎯

