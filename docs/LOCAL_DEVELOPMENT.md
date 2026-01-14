# Local Development Guide

## 🔄 Data Source Toggle

This project supports switching between **local JSON files** and **Supabase database** for easier development.

### Development Mode (Recommended)

Edit `.env.local`:
```env
DATA_SOURCE=local
```

**Benefits:**
- ✅ Edit coordinates instantly in JSON files
- ✅ Refresh browser to see changes
- ✅ No database seeding required
- ✅ Perfect for tweaking hotspot positions

**Workflow:**
1. Edit `/data/locations/*.json` files
2. Change coordinates, colors, or content
3. Save file
4. Refresh browser (Ctrl+Shift+R)
5. See changes immediately!

### Production Mode

Edit `.env.local`:
```env
DATA_SOURCE=database
```

**When to use:**
- Testing database integration
- Preparing for deployment
- After finalizing all changes

**Don't forget:** Run `npm run db:seed` to sync JSON files to database before deploying!

---

## 📍 Adjusting Hotspot Positions

### Coordinate System
- **X-axis**: 0 (left) to 100 (right)
- **Y-axis**: 0 (top) to 100 (bottom)

### Example: Moving Dressrosa
Edit `data/locations/dressrosa.json`:

```json
{
  "coordinates": { "x": 30, "y": 60 }
}
```

With `DATA_SOURCE=local`, just refresh to see the change!

### Quick Reference Grid
```
    0    25   50   75   100  ← X axis
0   ┌────┬────┬────┬────┐
    │ TL │    │    │ TR │
25  ├────┼────┼────┼────┤
    │    │    │    │    │
50  ├────┼────┼────┼────┤  ← Y axis
    │    │    │ C  │    │
75  ├────┼────┼────┼────┤
    │ BL │    │    │ BR │
100 └────┴────┴────┴────┘
```

---

## 🎨 Adjusting Hotspot Size

Edit `components/map/MapHotspot.tsx`, line 22:

```typescript
const radius = 3  // Change this value (2-8 recommended)
```

- **2-3**: Small, subtle hotspots
- **4-5**: Medium, balanced (recommended)
- **6-8**: Large, prominent hotspots

---

## 🚀 Deployment Checklist

Before deploying to production:

1. ✅ Finalize all coordinates and content
2. ✅ Test everything in local mode
3. ✅ Switch to `DATA_SOURCE=database` in `.env.local`
4. ✅ Run `npm run db:seed` to sync to Supabase
5. ✅ Test with database mode locally
6. ✅ Deploy to Vercel
7. ✅ Set `DATA_SOURCE=database` in Vercel environment variables

---

## 📝 Console Messages

When the app is running, check the terminal for data source confirmation:

**Local Mode:**
```
📁 [LOCAL MODE] Reading locations from JSON files
```

**Database Mode:**
```
🗄️  [DATABASE MODE] Reading locations from Supabase
```

This helps you confirm which data source is active!

