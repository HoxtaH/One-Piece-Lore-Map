# Music Directory

This directory contains the background music files for the One Piece Lore Map.

## 🎵 Audio System Overview

The new audio system features:
- ✅ Single audio instance (no stacking or memory leaks)
- ✅ Smooth crossfade transitions (800ms)
- ✅ User controls (toggle on/off, volume slider)
- ✅ Automatic location music playback
- ✅ Map theme music with hover previews
- ✅ localStorage persistence of preferences

## 📁 File Naming Convention

### **REQUIRED: World Map Theme**
```
world-map-theme.mp3
```
This is the ambient background music that plays when viewing the main world map. It will automatically crossfade to location-specific themes when hovering or clicking on locations.

**Recommended One Piece Tracks:**
- "To the Grand Line"
- "Overtaken"
- "We Are!" (instrumental)
- "Binks' Sake" (slow version)
- Any epic One Piece adventure theme

---

### **Location-Specific Themes**
Name your audio files to match the location slug:

```
public/music/
  world-map-theme.mp3          ⭐ REQUIRED for main map
  {location-slug}-theme.mp3    (optional for each location)
```

**Examples:**
- `dawn-island-theme.mp3`
- `arlong-park-theme.mp3`
- `alabasta-theme.mp3`
- `skypeia-theme.mp3`
- `water-7-theme.mp3`
- `marineford-theme.mp3`
- `fish-man-island-theme.mp3`
- `dressrosa-theme.mp3`
- `whole-cake-island-theme.mp3`
- `wano-theme.mp3`
- `egghead-theme.mp3`
- `mary-geoise-theme.mp3`

## 🎼 Location Music Configuration

After adding an audio file, update the location's JSON file:

```json
{
  "slug": "alabasta",
  "name": "Alabasta",
  // ... other fields ...
  "music": {
    "url": "/music/alabasta-theme.mp3",
    "title": "Alabasta - Desert Kingdom",
    "volume": 0.3
  }
}
```

**Music Object Fields:**
- `url` (required): Path to audio file (relative to public/)
- `title` (required): Display name in "Now Playing" indicator
- `volume` (optional): Override default volume (0.0 - 1.0, default: 0.3)

## 📋 All Locations Needing Music

### East Blue
- [ ] dawn-island-theme.mp3 (Foosha Village, Goa Kingdom)
- [ ] shell-town-theme.mp3 (Morgan's base)
- [ ] orange-town-theme.mp3 (Buggy intro)
- [ ] syrup-village-theme.mp3 (Usopp's home)
- [ ] baratie-theme.mp3 (Sea restaurant)
- [ ] arlong-park-theme.mp3 (Nami's village)
- [ ] loguetown-theme.mp3 (Execution platform)

### Paradise (First Half Grand Line)
- [ ] reverse-mountain-theme.mp3 (Laboon, entrance)
- [ ] whiskey-peak-theme.mp3 (Baroque Works)
- [ ] little-garden-theme.mp3 (Dinosaur island, giants)
- [ ] drum-island-theme.mp3 (Winter island, Chopper)
- [ ] alabasta-theme.mp3 (Desert kingdom, Crocodile)
- [ ] jaya-theme.mp3 (Mock Town, Blackbeard)
- [ ] skypeia-theme.mp3 (Sky island, Enel)
- [ ] long-ring-long-land-theme.mp3 (Davy Back Fight)
- [ ] water-7-theme.mp3 (Water city, shipwrights)
- [ ] enies-lobby-theme.mp3 (Justice island)
- [ ] thriller-bark-theme.mp3 (Ghost ship, Moria)
- [ ] sabaody-archipelago-theme.mp3 (Groves, auction house)

### Summit War Saga
- [ ] amazon-lily-theme.mp3 (Women warriors, Hancock)
- [ ] impel-down-theme.mp3 (Underwater prison)
- [ ] marineford-theme.mp3 (Marine HQ, war)

### New World (Second Half Grand Line)
- [ ] fish-man-island-theme.mp3 (Underwater, mermaids)
- [ ] punk-hazard-theme.mp3 (Ice/fire island, Caesar)
- [ ] dressrosa-theme.mp3 (Toy island, Doflamingo)
- [ ] zou-theme.mp3 (Moving elephant, Minks)
- [ ] whole-cake-island-theme.mp3 (Big Mom's territory)
- [ ] wano-theme.mp3 (Samurai country, Kaido)
- [ ] egghead-theme.mp3 (Future island, Vegapunk)

### Special Locations
- [ ] sea-train-theme.mp3 (Puffing Tom)
- [ ] mary-geoise-theme.mp3 (Holy Land, World Government)

## 🎧 Audio Format Recommendations

### Format
- **Best**: MP3 (universal browser support)
- **Quality**: 128-192 kbps (balance of quality and file size)
- **Bitrate**: VBR (Variable Bit Rate) recommended
- **Sample Rate**: 44.1 kHz

### File Size Guidelines
- Target: 2-4 MB per track (2-4 minutes)
- Max: 10 MB per track
- Smaller is better for web performance

### Audio Processing
- **Normalize** volume levels across all tracks
- **Fade in/out** at track edges (system handles crossfades)
- **Remove silence** from beginning/end
- **Loop-friendly** - smooth transition from end to beginning

## 🎵 Music Sources

### Official One Piece Music
1. **One Piece Original Soundtrack** - Official OST albums
2. **YouTube** - Search "One Piece {location} theme"
3. **Spotify** - One Piece soundtrack playlists

### Royalty-Free Alternatives
If you can't use official music:

1. **YouTube Audio Library** (Free)
   - Filter by mood: Adventure, Epic, Suspense
   - Download MP3 directly

2. **Epidemic Sound** (Subscription)
   - High-quality royalty-free music
   - Perfect for projects

3. **Free Music Archive** (Free)
   - Creative Commons licensed
   - Various genres

4. **Incompetech** (Free)
   - Kevin MacLeod's royalty-free music
   - Adventure/cinematic tracks

### Suggested Themes by Location

**Dawn Island** - Peaceful, adventurous (We Are!, Luffy's theme)
**Arlong Park** - Intense, emotional (Nami's past theme)
**Alabasta** - Desert, epic (Alabasta arc theme)
**Skypeia** - Mystical, ethereal (Island of Skypia)
**Water 7** - Bittersweet, emotional (Merry's theme)
**Marineford** - Epic, tragic (Paramount War theme)
**Fish-Man Island** - Underwater, mystical (Shirahoshi's theme)
**Dressrosa** - Intense, dramatic (Doflamingo's theme)
**Whole Cake Island** - Sweet but sinister (Big Mom's theme)
**Wano** - Traditional Japanese, epic (Wano arc theme)
**Egghead** - Futuristic, mysterious (Egghead theme)
**Mary Geoise** - Grand, ominous (World Government theme)

## 🧪 Testing Your Audio

1. **Add audio file** to `public/music/`
2. **Update location JSON** with music object
3. **Restart dev server** (if needed)
4. **Navigate to location** page
5. **Click "Enable Music"** button
6. **Music should play** automatically with smooth fade-in

### Troubleshooting

**Music doesn't play:**
- Check file path in JSON matches actual file name
- Check browser console for errors
- Verify file format is supported (MP3 recommended)
- Ensure "Enable Music" button was clicked

**Music cuts off abruptly:**
- Verify crossfade duration in `audioService.ts`
- Check for audio file corruption

**Volume too loud/quiet:**
- Adjust `volume` in music object (0.0 - 1.0)
- Default is 0.3 (30%)

## 📝 Quick Start Example

1. Download One Piece music
2. Rename to match location: `alabasta-theme.mp3`
3. Place in `public/music/`
4. Update `data/locations/alabasta.json`:

```json
"music": {
  "url": "/music/alabasta-theme.mp3",
  "title": "Alabasta - Desert Kingdom",
  "volume": 0.3
}
```

5. Navigate to Alabasta location - music plays! 🎵

## 🎯 Priority Locations

Start with these popular locations:

1. ⭐ **world-map-theme.mp3** - REQUIRED for main map experience
2. ✅ **Marineford** - Epic war theme
3. ✅ **Wano** - Traditional epic theme
4. ✅ **Whole Cake Island** - Unique sweet/sinister vibe
5. ✅ **Alabasta** - Classic arc theme
6. ✅ **Skypeia** - Mystical atmosphere

## 🎮 How It Works

### Main Map Experience
1. **On Map Load**: Plays `world-map-theme.mp3` automatically (if audio enabled)
2. **On Hover**: After 800ms delay, crossfades to location's theme
3. **On Mouse Leave**: Cancels pending hover music (prevents spam)
4. **Return Button**: Blue music button 🎵 returns to map theme
5. **Navigate to Location**: Smooth transition to location detail page music

### Audio Behavior
- ✅ **No Stacking**: Only ONE track plays at a time (singleton pattern)
- ✅ **Debounced Hover**: 800ms delay prevents rapid switching when moving mouse
- ✅ **Cleanup on Leave**: Cancels pending audio when mouse leaves location
- ✅ **Smooth Crossfades**: 800ms fade out → fade in transitions
- ✅ **Persistent Preferences**: Volume and enabled state saved to localStorage

## 💡 Pro Tips

- **Loop your tracks** - Set them to fade smoothly from end to start
- **Batch normalize** all audio files to same volume level
- **Compress files** using Audacity or ffmpeg
- **Test on mobile** - Audio may behave differently
- **Cache audio files** - Browser will cache after first load

---

**Ready to make your One Piece map immersive with music!** 🏴‍☠️🎵


