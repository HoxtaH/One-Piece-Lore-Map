# 🎵 Audio System - Complete Architecture Plan

**Date**: November 6, 2025  
**Status**: Planning Phase  
**Goal**: Simple, reliable background music system

---

## 🎯 Requirements

### **What We Need**
1. ✅ Play background music on main map
2. ✅ Play different music on each location page
3. ✅ Stop old music when navigating
4. ✅ User can enable/disable music
5. ✅ User can control volume
6. ✅ User can pause/play
7. ✅ Respect browser autoplay policies

### **What We DON'T Need (Yet)**
- ❌ Crossfading (can add later)
- ❌ Multiple simultaneous tracks
- ❌ Playlist management
- ❌ Audio visualization
- ❌ Complex audio effects

---

## 📊 State Machine

### **Audio States**

```
┌─────────────┐
│   SILENT    │ ← Initial state (no user interaction)
└──────┬──────┘
       │ User clicks "Enable Music"
       ▼
┌─────────────┐
│   READY     │ ← Can play audio now
└──────┬──────┘
       │ playTrack() called
       ▼
┌─────────────┐
│   LOADING   │ ← Audio file loading
└──────┬──────┘
       │ Audio loaded
       ▼
┌─────────────┐
│   PLAYING   │ ← Audio actively playing
└──────┬──────┘
       │ User pauses OR navigate away
       ▼
┌─────────────┐
│   STOPPED   │ ← Audio stopped, can play again
└──────┬──────┘
       │ playTrack() called
       │
       └──────► Back to LOADING
```

### **State Transitions**

| From | To | Trigger | Action |
|------|------|---------|--------|
| SILENT | READY | User clicks "Enable Music" | Set `userHasInteracted = true` |
| READY | LOADING | `playTrack(url)` called | Create Audio element, load file |
| LOADING | PLAYING | Audio loaded | Call `audio.play()` |
| PLAYING | STOPPED | Navigate away | Call `stopAudio()`, cleanup |
| PLAYING | PLAYING | `playTrack(different url)` | Stop current, load new |
| PLAYING | PLAYING | `playTrack(same url)` | Do nothing (already playing) |
| PLAYING | STOPPED | User pauses | Pause audio |
| STOPPED | PLAYING | User plays | Resume audio |

---

## 🏗️ Architecture

### **Core Components**

#### **1. AudioContext (React Context)**
```typescript
interface AudioContextState {
  // State
  currentTrack: string | null       // Current track URL
  isPlaying: boolean                 // Is audio playing?
  isMuted: boolean                   // Is audio muted?
  volume: number                     // Volume level (0-1)
  userHasInteracted: boolean         // Has user clicked "Enable Music"?
  
  // Actions
  playTrack: (url: string) => void   // Play a track
  stopAudio: () => void              // Stop current track
  togglePlay: () => void             // Pause/resume
  toggleMute: () => void             // Mute/unmute
  setVolume: (vol: number) => void   // Set volume
  enableAudio: () => void            // First user interaction
}
```

#### **2. Audio Manager (Internal)**
```typescript
class AudioManager {
  private audioElement: HTMLAudioElement | null = null
  
  // Play a track (stops current if playing)
  play(url: string, volume: number): Promise<void>
  
  // Stop and cleanup
  stop(): void
  
  // Pause/Resume
  pause(): void
  resume(): void
  
  // Volume control
  setVolume(volume: number): void
  mute(): void
  unmute(): void
  
  // Cleanup
  destroy(): void
}
```

---

## 📝 Implementation Strategy

### **Phase 1: Minimal Working Version (30 mins)**

**Goal**: Get basic audio working with no frills

```typescript
// AudioContext.tsx - MINIMAL VERSION
export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const playTrack = useCallback((url: string) => {
    // If user hasn't interacted, do nothing
    if (!userHasInteracted) return
    
    // If same track, do nothing
    if (currentTrack === url && isPlaying) return
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    
    // Create and play new audio
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0.3
    audio.play()
    
    audioRef.current = audio
    setCurrentTrack(url)
    setIsPlaying(true)
  }, [userHasInteracted, currentTrack, isPlaying])
  
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setCurrentTrack(null)
    setIsPlaying(false)
  }, [])
  
  const enableAudio = useCallback(() => {
    setUserHasInteracted(true)
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])
  
  return (
    <AudioContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      userHasInteracted,
      playTrack, 
      stopAudio, 
      enableAudio 
    }}>
      {children}
    </AudioContext.Provider>
  )
}
```

**Phase 1 Features:**
- ✅ Play/stop audio
- ✅ User interaction required
- ✅ No duplicate tracks
- ✅ Clean cleanup
- ❌ No controls (yet)
- ❌ No volume (yet)
- ❌ No crossfade (yet)

### **Phase 2: Add Controls (15 mins)**

**Goal**: Add play/pause, volume, mute

```typescript
// Add to AudioContext:
const [volume, setVolumeState] = useState(0.3)
const [isMuted, setIsMuted] = useState(false)

const togglePlay = useCallback(() => {
  if (!audioRef.current) return
  
  if (isPlaying) {
    audioRef.current.pause()
    setIsPlaying(false)
  } else {
    audioRef.current.play()
    setIsPlaying(true)
  }
}, [isPlaying])

const setVolume = useCallback((vol: number) => {
  setVolumeState(vol)
  if (audioRef.current) {
    audioRef.current.volume = vol
  }
}, [])

const toggleMute = useCallback(() => {
  if (audioRef.current) {
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }
}, [isMuted])
```

**Phase 2 Features:**
- ✅ Play/pause toggle
- ✅ Volume slider
- ✅ Mute button
- ❌ No crossfade (yet)

### **Phase 3: Add Crossfade (Optional - 30 mins)**

**Goal**: Smooth transitions between tracks

```typescript
const crossfade = useCallback(
  (fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement) => {
    return new Promise<void>((resolve) => {
      const duration = 2000 // 2 seconds
      const steps = 50
      const stepTime = duration / steps
      const volumeStep = volume / steps
      
      let step = 0
      const interval = setInterval(() => {
        step++
        
        // Fade out old
        fromAudio.volume = Math.max(0, volume - (volumeStep * step))
        
        // Fade in new
        toAudio.volume = Math.min(volume, volumeStep * step)
        
        if (step >= steps) {
          clearInterval(interval)
          fromAudio.pause()
          fromAudio.src = ''
          resolve()
        }
      }, stepTime)
    })
  },
  [volume]
)
```

---

## 🎮 Usage Patterns

### **Main Map Page**

```typescript
// app/page.tsx
export default function Home() {
  const { playTrack, userHasInteracted } = useAudio()
  
  useEffect(() => {
    if (userHasInteracted) {
      playTrack('/music/main-map-theme.mp3')
    }
  }, [userHasInteracted])
  
  return <WorldMap />
}
```

### **Location Page**

```typescript
// app/locations/[slug]/page.tsx
export default function LocationPage() {
  const { playTrack, stopAudio, userHasInteracted } = useAudio()
  const music = location.music?.url
  
  useEffect(() => {
    if (music && userHasInteracted) {
      playTrack(music)
    }
    
    // Cleanup when leaving
    return () => stopAudio()
  }, [music, userHasInteracted])
  
  return <LocationExploration />
}
```

---

## 🐛 Common Pitfalls to Avoid

### **1. Multiple Audio Elements**
❌ **Wrong**: Creating new Audio() every render
```typescript
function Component() {
  const audio = new Audio() // ← Creates new element on every render!
  // ...
}
```

✅ **Right**: Use useRef
```typescript
function Component() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  // Only create once when needed
}
```

### **2. Circular Dependencies**
❌ **Wrong**: Functions calling each other in dependencies
```typescript
useEffect(() => {
  cleanup()
}, [cleanup]) // ← cleanup includes useEffect logic = infinite loop
```

✅ **Right**: Inline cleanup or empty deps
```typescript
useEffect(() => {
  return () => {
    // Inline cleanup, no dependencies needed
  }
}, [])
```

### **3. Not Cleaning Up**
❌ **Wrong**: Leaving audio playing
```typescript
useEffect(() => {
  playTrack('/music/theme.mp3')
  // No cleanup!
}, [])
```

✅ **Right**: Always cleanup on unmount
```typescript
useEffect(() => {
  playTrack('/music/theme.mp3')
  
  return () => stopAudio() // ← Cleanup
}, [])
```

### **4. Replaying Same Track**
❌ **Wrong**: No check for current track
```typescript
function playTrack(url: string) {
  const audio = new Audio(url)
  audio.play() // ← Always plays, even if already playing!
}
```

✅ **Right**: Check if already playing
```typescript
function playTrack(url: string) {
  if (currentTrack === url && isPlaying) {
    return // Already playing this track
  }
  // ... create and play
}
```

---

## 🧪 Testing Checklist

### **Phase 1 Tests**
- [ ] Click "Enable Music" → Main theme plays
- [ ] Navigate to location → Location theme plays
- [ ] Navigate back to map → Map theme plays
- [ ] Refresh page → Music stops (user must re-enable)
- [ ] Open console → No errors, no 404s

### **Phase 2 Tests**
- [ ] Click pause → Music pauses
- [ ] Click play → Music resumes
- [ ] Drag volume slider → Volume changes
- [ ] Click mute → Audio mutes
- [ ] Click unmute → Audio unmutes

### **Phase 3 Tests**
- [ ] Navigate between pages → Smooth crossfade
- [ ] Fast navigation → No audio doubling
- [ ] Multiple navigations → No memory leak

---

## 📦 File Structure

```
lib/
  context/
    AudioContext.tsx       ← Main audio context
components/
  audio/
    AudioControls.tsx      ← Player UI (already exists)
app/
  page.tsx                 ← Uses playTrack
  locations/[slug]/
    page.tsx              ← Uses playTrack + cleanup
public/
  music/
    main-map-theme.mp3
    sabaody-archipelago-theme.mp3
    wano-theme.mp3
    dressrosa-theme.mp3
    egghead-theme.mp3
    skypeia-theme.mp3
```

---

## 🎯 Implementation Order

1. **Phase 1** - Basic playback (30 mins)
   - Create AudioContext with minimal features
   - Test with main page
   - Test with location pages
   - Verify cleanup works

2. **Phase 2** - Add controls (15 mins)
   - Add play/pause
   - Add volume control
   - Add mute
   - Update AudioControls component

3. **Phase 3** - Polish (optional)
   - Add crossfade
   - Add loading states
   - Add error handling
   - Add animations

---

## 💡 Success Criteria

✅ **Must Have**
- Only ONE audio element at a time
- Clean cleanup on navigation
- No memory leaks
- No audio doubling
- Respects browser autoplay policy

✅ **Nice to Have**
- Smooth crossfading
- Pretty controls
- Loading indicators
- Error messages

---

## 🚀 Ready to Implement?

The plan is:
1. **Simple first** - Get basic playback working
2. **Test thoroughly** - Make sure it works reliably
3. **Add features** - Controls, crossfade, etc.
4. **Keep it simple** - Don't over-engineer

Each phase is independent and can be tested separately.

**Next Step**: Implement Phase 1 (Minimal Working Version)

Ready when you are! 🎵
