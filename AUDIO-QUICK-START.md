# 🎵 Audio System - Quick Start Guide

**Goal**: Implement a simple, reliable background music system in 3 phases.

---

## 📋 Checklist

### **Before We Start**
- [x] Delete old AudioContext.tsx
- [x] Review the plan (AUDIO-SYSTEM-PLAN.md)
- [x] Understand the architecture (AUDIO-ARCHITECTURE-DIAGRAM.txt)
- [ ] Ready to implement Phase 1

---

## 🎯 Phase 1: Basic Playback (30 mins)

**Goal**: Get music playing with clean navigation

### **Step 1: Create AudioContext.tsx** (10 mins)
```typescript
// lib/context/AudioContext.tsx
'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

interface AudioContextType {
  currentTrack: string | null
  isPlaying: boolean
  userHasInteracted: boolean
  playTrack: (url: string) => void
  stopAudio: () => void
  enableAudio: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const playTrack = useCallback((url: string) => {
    if (!userHasInteracted) return
    if (currentTrack === url && isPlaying) return
    
    // Stop current
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    
    // Play new
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

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within AudioProvider')
  return context
}
```

### **Step 2: Update Main Page** (5 mins)
```typescript
// app/page.tsx
import { useAudio } from '@/lib/context/AudioContext'

export default function Home() {
  const { playTrack, userHasInteracted } = useAudio()
  
  useEffect(() => {
    if (userHasInteracted) {
      playTrack('/music/main-map-theme.mp3')
    }
  }, [userHasInteracted])
  
  // ... rest of component
}
```

### **Step 3: Update Location Page** (5 mins)
```typescript
// components/exploration/LocationExploration.tsx
import { useAudio } from '@/lib/context/AudioContext'

export default function LocationExploration({ location }) {
  const { playTrack, stopAudio, userHasInteracted } = useAudio()
  const music = location.music?.url
  
  useEffect(() => {
    if (music && userHasInteracted) {
      playTrack(music)
    }
    
    return () => stopAudio()
  }, [music, userHasInteracted])
  
  // ... rest of component
}
```

### **Step 4: Update AudioControls** (10 mins)
```typescript
// components/audio/AudioControls.tsx
import { useAudio } from '@/lib/context/AudioContext'

export default function AudioControls() {
  const { userHasInteracted, enableAudio, currentTrack } = useAudio()
  
  if (!userHasInteracted) {
    return (
      <button onClick={enableAudio}>
        🎵 Enable Music
      </button>
    )
  }
  
  return (
    <div>
      Now Playing: {currentTrack || 'None'}
    </div>
  )
}
```

### **Test Phase 1** ✓
- [ ] Click "Enable Music" → Music plays
- [ ] Navigate to location → Location music plays
- [ ] Navigate back to map → Map music plays
- [ ] Console → No errors
- [ ] Check: Only ONE audio element at a time

---

## 🎮 Phase 2: Add Controls (15 mins)

**Goal**: Add play/pause, volume, mute

### **Step 1: Add State** (3 mins)
```typescript
// In AudioProvider:
const [volume, setVolumeState] = useState(0.3)
const [isMuted, setIsMuted] = useState(false)
```

### **Step 2: Add Functions** (7 mins)
```typescript
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

### **Step 3: Update AudioControls** (5 mins)
```typescript
export default function AudioControls() {
  const { 
    isPlaying, 
    isMuted, 
    togglePlay, 
    toggleMute, 
    setVolume 
  } = useAudio()
  
  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button onClick={toggleMute}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  )
}
```

### **Test Phase 2** ✓
- [ ] Pause button works
- [ ] Play button works
- [ ] Volume slider works
- [ ] Mute button works

---

## ✨ Phase 3: Polish (Optional - 30 mins)

### **Add Crossfade**
```typescript
// In AudioProvider:
const crossfade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement) => {
  return new Promise<void>((resolve) => {
    const duration = 2000
    const steps = 50
    const stepTime = duration / steps
    const volumeStep = volume / steps
    
    let step = 0
    const interval = setInterval(() => {
      step++
      fromAudio.volume = Math.max(0, volume - (volumeStep * step))
      toAudio.volume = Math.min(volume, volumeStep * step)
      
      if (step >= steps) {
        clearInterval(interval)
        fromAudio.pause()
        fromAudio.src = ''
        resolve()
      }
    }, stepTime)
  })
}, [volume])
```

---

## 🐛 Troubleshooting

### **Music Not Playing**
1. Check console for errors
2. Verify user clicked "Enable Music"
3. Check file paths (404 errors?)
4. Test with browser's autoplay policy

### **Music Doubling**
1. Check: Only ONE audioRef.current?
2. Verify stopAudio() is called on unmount
3. Check: No duplicate useEffects?

### **Music Not Stopping**
1. Verify cleanup in useEffect return
2. Check stopAudio() implementation
3. Ensure audio.src = '' is called

---

## ✅ Success Criteria

After Phase 1:
- ✅ Music plays when enabled
- ✅ Music changes on navigation
- ✅ Music stops when leaving
- ✅ No audio doubling
- ✅ No memory leaks

After Phase 2:
- ✅ Can pause/resume
- ✅ Can adjust volume
- ✅ Can mute/unmute

After Phase 3:
- ✅ Smooth crossfades
- ✅ Loading states
- ✅ Error handling

---

## 🚀 Implementation Time

- **Phase 1**: 30 minutes
- **Phase 2**: 15 minutes  
- **Phase 3**: 30 minutes (optional)

**Total**: ~45 minutes for working audio system!

---

**Ready to start?** 🎵

Let's implement Phase 1 first and test it thoroughly before moving on!

