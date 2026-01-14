# Audio System Documentation

## Overview

The One Piece Lore Map features a sophisticated audio system with smooth crossfading between tracks as users navigate between the main map and location detail pages.

## Features

✅ **Global Audio Management** - Centralized audio state across the entire application  
✅ **Smart Crossfading** - Smooth 2-3 second transitions between tracks  
✅ **User Consent** - Elegant "Enable Music" prompt respecting browser autoplay policies  
✅ **Persistent Settings** - Audio preferences stored in localStorage  
✅ **Volume Control** - User-adjustable volume with mute functionality  
✅ **Track Display** - Shows currently playing track in the audio control widget  
✅ **Route-aware** - Automatically switches music based on current page  

## Architecture

### Components

#### 1. **AudioContext** (`lib/context/AudioContext.tsx`)
Global React Context that manages all audio state and playback logic.

**Key Functions:**
- `playTrack()` - Play a new track with optional crossfade
- `togglePlay()` - Play/pause current track
- `toggleMute()` - Mute/unmute audio
- `setVolume()` - Adjust volume (0.0 - 1.0)
- `enableAudio()` - User grants permission for audio playback

**State:**
- `currentTrack` - Currently playing track metadata
- `isPlaying` - Playback state
- `isMuted` - Mute state
- `userHasInteracted` - Whether user has enabled audio
- `globalVolume` - Current volume level

#### 2. **AudioControls** (`components/audio/AudioControls.tsx`)
Floating widget in bottom-right corner for audio control.

**Features:**
- Play/Pause button
- Volume slider
- Mute toggle
- Current track display
- "Enable Music" prompt for first-time visitors

#### 3. **Audio Integration**
Audio playback is integrated into:
- **Main Map** (`app/page.tsx`) - Plays main theme
- **Location Pages** (`components/exploration/LocationExploration.tsx`) - Plays location-specific themes

## How It Works

### Initial Load
1. User visits the site
2. Audio system checks localStorage for `audioEnabled` preference
3. If not enabled, shows "Enable Music" button
4. User clicks button → audio system activates

### Track Playback
1. Page component calls `playTrack()` with track URL and metadata
2. Audio system creates new `<audio>` element
3. If a track is already playing, initiates crossfade:
   - Fades out current track (volume decreases)
   - Fades in new track (volume increases)
   - Duration: 2-3 seconds depending on context
4. Old track stops, new track loops

### Navigation
1. User navigates from main map to location (e.g., Dressrosa)
2. Location page `useEffect` detects the change
3. Calls `playTrack()` with Dressrosa theme
4. Audio system crossfades from main theme to location theme (3 seconds)
5. Returning to main map triggers reverse crossfade (2 seconds)

## Configuration

### Adding Music to Locations

Edit location JSON files in `data/locations/`:

```json
{
  "slug": "dressrosa",
  "name": "Dressrosa",
  // ... other fields ...
  "music": {
    "url": "/music/dressrosa-theme.mp3",
    "title": "Dressrosa - Kingdom of Passion",
    "volume": 0.3
  }
}
```

### Main Map Theme

Configured in `app/page.tsx`:

```typescript
playTrack({
  url: '/music/main-map-theme.mp3',
  title: 'One Piece - Grand Line Theme',
  volume: 0.3,
}, 2000) // 2 second fade
```

### Crossfade Timing

Adjust fade duration in function calls:

```typescript
playTrack(track, 2000) // 2 seconds
playTrack(track, 3000) // 3 seconds
playTrack(track, 5000) // 5 seconds
```

## File Structure

```
public/
  └── music/
      ├── README.md
      ├── main-map-theme.mp3
      ├── dressrosa-theme.mp3
      ├── skypeia-theme.mp3
      ├── sabaody-archipelago-theme.mp3
      ├── wano-theme.mp3
      └── egghead-theme.mp3

lib/
  └── context/
      └── AudioContext.tsx

components/
  └── audio/
      └── AudioControls.tsx

app/
  ├── providers.tsx (wraps with AudioProvider)
  └── page.tsx (uses audio context)

components/exploration/
  └── LocationExploration.tsx (uses audio context)

data/locations/
  ├── dressrosa.json (has music field)
  ├── skypeia.json (has music field)
  ├── sabaody-archipelago.json (has music field)
  ├── wano-theme.json (has music field)
  └── egghead.json (has music field)
```

## Browser Compatibility

### Autoplay Policies
Modern browsers block autoplay until user interaction. The system handles this by:
1. Showing "Enable Music" button
2. Storing consent in localStorage
3. Only playing audio after user clicks the button

### Supported Audio Formats
- **MP3** - Best compatibility (recommended)
- **OGG** - Good compatibility
- **WAV** - Universal but large file size
- **AAC/M4A** - Good quality, moderate compatibility

## Troubleshooting

### Music doesn't play
1. Check browser console for errors
2. Verify audio files exist in `public/music/`
3. Ensure file names match JSON configuration
4. Check if browser is blocking autoplay

### Crossfade not smooth
1. Adjust fade duration (increase from 2000ms to 3000ms+)
2. Check CPU usage (complex animations may affect timing)
3. Verify audio files are properly encoded

### Volume too loud/quiet
1. Normalize audio files to consistent volume
2. Adjust `volume` in track configuration (0.0-1.0)
3. User can adjust volume via control widget

## Performance Considerations

### Memory Management
- Audio elements are properly cleaned up after use
- Only one track plays at a time
- Previous tracks are stopped and garbage collected

### File Sizes
- Keep audio files under 5MB for web performance
- Use 128-192kbps MP3 encoding for good quality/size balance
- Consider using shorter loops (2-3 minutes)

### Network Loading
- Audio files load on-demand (not preloaded)
- Browser caching helps with repeat visits
- Consider CDN hosting for production

## Future Enhancements

- [ ] Playlist support for multiple tracks per location
- [ ] Fade to silence during video playback
- [ ] Audio visualizer in control widget
- [ ] Keyboard shortcuts (spacebar for play/pause)
- [ ] Audio preloading for smoother transitions
- [ ] Multiple track variants (day/night themes)
- [ ] Battle music triggers for specific events

## Credits

**Icons**: Lucide React  
**Audio Playback**: HTML5 Audio API  
**Crossfade Logic**: Custom implementation with setInterval  
**State Management**: React Context API

