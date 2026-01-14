# 📍 How to Update Coordinates - Step-by-Step Guide

**Goal**: Update all location coordinates to work with the new pixel map  
**Time Needed**: ~10-15 minutes for all locations  
**Difficulty**: Easy (just click and copy!)

---

## 🎯 Quick Start

### **Step 1: Open Your App**
```
http://localhost:3000
```

### **Step 2: Open Browser Console**
- **Windows**: Press `F12` or `Ctrl+Shift+I`
- **Mac**: Press `Cmd+Option+I`
- Click the **"Console"** tab

### **Step 3: Copy-Paste This Code**

```javascript
(function() {
  const svg = document.querySelector('svg[viewBox="0 0 10798 5429"]')
  if (!svg) {
    console.error('❌ SVG not found! Make sure you are on the map page.')
    return
  }
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan')
  console.log('%c🎮 PIXEL MAP COORDINATE FINDER', 'color: lime; font-size: 18px; font-weight: bold')
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan')
  console.log('%cInstructions:', 'color: yellow; font-weight: bold')
  console.log('  1. Click on any island on the map')
  console.log('  2. Coordinates will appear below')
  console.log('  3. Copy and paste into your JSON file')
  console.log('  4. Save and refresh to see hotspot!')
  console.log('')
  console.log('%c✅ Tool Active - Click islands now!', 'color: lime; font-weight: bold')
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan')
  console.log('')
  
  let clickCount = 0
  
  svg.addEventListener('click', function(e) {
    clickCount++
    const rect = svg.getBoundingClientRect()
    const scaleX = 10798 / rect.width
    const scaleY = 5429 / rect.height
    
    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)
    
    console.log(`%c📍 Click #${clickCount}`, 'color: yellow; font-weight: bold')
    console.log(`%c{ "x": ${x}, "y": ${y} }`, 'color: lime; font-size: 14px; font-weight: bold; background: #000; padding: 8px')
    console.log(`%c↑ Copy this!`, 'color: cyan')
    console.log('')
  })
  
  console.log('%cTip: To stop, just refresh the page', 'color: gray; font-style: italic')
})()
```

### **Step 4: Click Islands**
- Click on **Dawn Island** → Copy coordinates
- Click on **Shell Town** → Copy coordinates  
- Click on **Loguetown** → Copy coordinates
- (Repeat for all locations)

### **Step 5: Update JSON Files**

Open each location file and update:

**Example - `data/locations/dawn-island.json`:**
```json
{
  "slug": "dawn-island",
  "name": "Dawn Island",
  "region": "East Blue",
  "coordinates": { "x": 9500, "y": 2700 }  // ← Replace with your clicked coordinates
}
```

### **Step 6: Test**
- Save the JSON file
- Refresh browser (changes are instant in local mode!)
- Click the hotspot to verify it goes to the right location

---

## 📋 Location Checklist

Track your progress:

### **East Blue** (Far East side of map)
- [ ] Dawn Island - `data/locations/dawn-island.json`
- [ ] Shell Town - `data/locations/shell-town.json`
- [ ] Orange Town - `data/locations/orange-town.json`
- [ ] Syrup Village - `data/locations/syrup-village.json`
- [ ] Baratie - `data/locations/baratie.json`
- [ ] Arlong Park - `data/locations/arlong-park.json`
- [ ] Loguetown - `data/locations/loguetown.json`

### **Grand Line Paradise** (Center of map)
- [ ] Reverse Mountain (if exists) - Check if file exists
- [ ] Skypeia - `data/locations/skypeia.json`
- [ ] Sabaody Archipelago - `data/locations/sabaody-archipelago.json`

### **Grand Line New World** (West side of map)
- [ ] Wano - `data/locations/wano.json`
- [ ] Dressrosa - `data/locations/dressrosa.json`
- [ ] Egghead - `data/locations/egghead.json`

---

## 🎯 Tips for Finding Island Positions

### **General Geography** (Ohara Map)

```
West ←────────────────────────────────────────────→ East
0px                   5399px                    10798px

NEW WORLD    |  PARADISE/RED LINE  |   EAST BLUE
(Wano area)  | (Alabasta, Skypeia) | (Dawn Island)
```

### **Vertical Positioning**

```
Top (0px)
   ↓
   Sky Islands (Skypeia) - Higher Y value
   ↓
   Grand Line (most locations) - Middle Y ~2714
   ↓
   Below (5429px)
```

### **Quick Reference**

| Area | Approx X Range | Approx Y |
|------|----------------|----------|
| **East Blue** | 9000-10798 | 2500-3000 |
| **Paradise** | 4000-6000 | 2500-3000 |
| **New World** | 1000-4000 | 2500-3000 |
| **Sky Islands** | Any X | 1000-2000 |

---

## 🧪 Testing Your Coordinates

### **After Each Update:**

1. **Save the JSON file**
2. **Refresh browser** (Ctrl+R)
3. **Look for the hotspot** - Should be on the island!
4. **Click the hotspot** - Should navigate to location page
5. **If wrong**: 
   - Open console again
   - Click the correct spot
   - Update JSON with new coordinates

### **Quick Test All:**

Once you've updated all coordinates:
- Hover over each hotspot
- Should align with islands on map
- Click each one to verify navigation works

---

## 📝 Example Workflow

### **Updating Dawn Island:**

**Step 1**: Console tool active, click on Dawn Island on map
```
Console shows:
📍 Click #1
{ "x": 9485, "y": 2678 }
↑ Copy this!
```

**Step 2**: Open `data/locations/dawn-island.json`
```json
"coordinates": { "x": 65, "y": 42 }  // OLD
```

**Step 3**: Replace with new coordinates
```json
"coordinates": { "x": 9485, "y": 2678 }  // NEW
```

**Step 4**: Save file (Ctrl+S)

**Step 5**: Refresh browser - Hotspot is now on Dawn Island! ✅

---

## 🎮 Testing the New Zoom Features

### **Max Zoom (800%)**
1. Scroll wheel up repeatedly
2. Watch zoom indicator (bottom left)
3. Should reach **800%** (previously 400%)
4. See incredible pixel detail!

### **Double-Click Zoom**
1. Double-click anywhere on the map
2. Should **instantly zoom to 800%**
3. Should **center on where you clicked**
4. Great for quickly exploring specific islands!

### **Zoom Controls**
- **Mouse wheel**: Gradual zoom (scroll up/down)
- **Double-click**: Instant max zoom on clicked spot
- **+ button**: Zoom in by 20%
- **- button**: Zoom out by 20%
- **Reset button**: Back to 100%, centered
- **Drag**: Pan around when zoomed in

---

## ✅ Verification Checklist

Before you finish:

- [ ] Max zoom reaches 800% (not 400%)
- [ ] Double-click zooms to max instantly
- [ ] Double-click centers on clicked point
- [ ] Instruction text mentions double-click
- [ ] Coordinate finder tool works
- [ ] At least one location updated and working
- [ ] Hotspots appear on correct islands
- [ ] Clicking hotspots navigates properly

---

## 🐛 Troubleshooting

### **Coordinate Finder Not Working?**
**Check**:
- Are you on the map page? (not a location detail page)
- Is the console showing the green "Tool Active" message?
- Try refreshing and pasting the code again

### **Coordinates Don't Match?**
**Check**:
- Did you copy the full `{ "x": ..., "y": ... }` ?
- Are you in the right JSON file?
- Did you save the file after editing?
- Did you refresh the browser?

### **Hotspot Still in Wrong Place?**
**Check**:
- Coordinates are within 0-10798 (X) and 0-5429 (Y)
- No typos in JSON (check for commas, brackets)
- File is saved
- Browser cache cleared (Ctrl+F5)

---

## 📊 What's Working Now

✅ **Pixel map displays** (10798 × 5429)  
✅ **Max zoom 800%** (up from 400%)  
✅ **Double-click zoom** (instant max zoom)  
✅ **Coordinate finder** (console tool)  
✅ **Pixel rendering** (sharp, not blurry)  

---

## 🎯 Your Action Items

1. **Test the map** - Refresh and see pixel art
2. **Test double-click** - Should zoom to 800% on click
3. **Use coordinate finder** - Click islands, get coordinates
4. **Update JSON files** - Replace old coordinates with new
5. **Test each location** - Verify hotspots align

**Estimated Time**: 10-15 minutes to update all coordinates

---

## 🚀 After Coordinates Are Updated

You'll be ready for:
- ✅ Phase 2: Pixel aesthetic (fonts, borders, buttons)
- ✅ Phase 3: Island-shaped hovers
- ✅ Phase 4: Journey path animation
- ✅ Creating Alabasta Saga locations

---

## 💡 Quick Tip

**Start with one location** (like Dawn Island):
1. Click it on map
2. Update JSON
3. Test it works
4. Then do the rest!

This way you verify the system works before updating all locations.

---

## ✨ Everything is Ready!

Your pixel map migration is complete:
- ✅ New map active
- ✅ Enhanced zoom (800%)
- ✅ Double-click feature
- ✅ Coordinate finder tool
- ✅ Documentation complete

**Next**: Update those coordinates and your pixel One Piece map will be perfect! 🗺️✨

---

**Need help?** Just share:
- Console output from coordinate finder
- Which location you're working on
- Any coordinates that aren't aligning

I'm here to help! 🎮

