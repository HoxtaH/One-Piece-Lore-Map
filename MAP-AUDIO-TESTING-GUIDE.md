# Map Audio System - Testing & Verification Guide

## ✅ Audio System Implementation Complete

The map audio system has been successfully implemented with all safeguards against audio stacking and memory leaks.

---

## 🔒 Anti-Stacking Safeguards

### **How We Prevent Audio Stacking:**

1. **Singleton AudioService** (`lib/services/audioService.ts`)
   - Only ONE `HTMLAudioElement` exists in the entire application
   - All audio goes through single instance: `audioService.getInstance()`
   - Impossible to create multiple audio elements

2. **Timeout Cleanup** (`lib/hooks/useMapAudio.ts`)
   - `hoverTimeoutRef` tracks pending hover audio
   - **ALWAYS cleared** before setting new timeout
   - Prevents delayed hovers from playing after mouse leaves

3. **State Tracking** (`lib/hooks/useMapAudio.ts`)
   - `lastHoveredRef` prevents replaying same location
   - Avoids unnecessary audio restarts on re-hover

4. **Cleanup on Unmount** (All components)
   - Timeouts cleared on component unmount
   - Audio service cleanup on context unmount
   - No orphaned audio elements

---

## 🧪 Testing Checklist

### **Phase 1: Basic Map Audio**

- [ ] **1.1** Load main map → `world-map-theme.mp3` plays automatically
- [ ] **1.2** Click "Enable Music" button → music starts
- [ ] **1.3** Refresh page → music setting persists (localStorage)
- [ ] **1.4** Disable music → audio stops immediately
- [ ] **1.5** Re-enable music → returns to map theme

### **Phase 2: Hover Behavior**

- [ ] **2.1** Hover over location → wait 800ms → location music plays
- [ ] **2.2** Move mouse before 800ms → no music plays (timeout canceled)
- [ ] **2.3** Hover same location twice → music doesn't restart
- [ ] **2.4** Hover location A → wait 800ms → hover location B → smooth crossfade
- [ ] **2.5** Hover location → immediately leave → no audio plays (cleanup works)

### **Phase 3: Rapid Mouse Movement (Stress Test)**

- [ ] **3.1** Quickly move mouse across multiple locations → only ONE track plays
- [ ] **3.2** Hover spam same location → no audio stacking
- [ ] **3.3** Hover + leave repeatedly → no pending audio piles up
- [ ] **3.4** Check browser DevTools → only ONE `<audio>` element exists

### **Phase 4: Navigation & Transitions**

- [ ] **4.1** Click location → navigate to detail page → smooth transition
- [ ] **4.2** Back button to map → returns to map theme (if enabled)
- [ ] **4.3** Navigate between locations → smooth crossfades
- [ ] **4.4** Open location in new tab → independent audio (separate window)

### **Phase 5: Volume & Controls**

- [ ] **5.1** Adjust volume slider → volume changes immediately
- [ ] **5.2** Mute → audio silent
- [ ] **5.3** Unmute → audio resumes at previous volume
- [ ] **5.4** Volume persists across page refreshes
- [ ] **5.5** "Now Playing" indicator shows correct track

### **Phase 6: Return to Map Theme**

- [ ] **6.1** Hover location → music changes
- [ ] **6.2** Click blue 🎵 button → returns to map theme
- [ ] **6.3** Map theme plays with smooth crossfade
- [ ] **6.4** Button works while location music is playing

### **Phase 7: Edge Cases**

- [ ] **7.1** Location without music → no errors, no audio plays
- [ ] **7.2** Invalid music file → graceful error handling, shows in console
- [ ] **7.3** Network slow → loading state shows, no crashes
- [ ] **7.4** Browser autoplay blocked → shows "Enable Music" prompt
- [ ] **7.5** Tab switch → audio continues (expected behavior)
- [ ] **7.6** Multiple tabs open → each has independent audio

---

## 🔍 Debug Verification

### **Check for Audio Stacking:**

Open browser DevTools (F12) and run:

```javascript
// Should always return 1
document.querySelectorAll('audio').length
```

**Expected Result:** `1` (only one audio element)
**Problem Result:** `2+` (audio stacking detected!)

### **Monitor Audio Service State:**

Check console logs (already added):

```
[Audio] Audio is disabled, skipping playback
[Audio] Creating new audio element for: /music/...
[Audio] Playback started successfully
[Audio] Failed to play track: ...
```

### **Check LocalStorage:**

```javascript
localStorage.getItem('audioEnabled')  // "true" or "false"
localStorage.getItem('audioVolume')   // "0.3" (30%)
```

---

## 🎯 Expected Behavior Summary

### **Main Map:**
1. Loads → Map theme plays
2. Hover location (800ms) → Crossfade to location theme
3. Leave location → Cancels pending hover
4. Click 🎵 button → Returns to map theme

### **Location Detail:**
1. Navigate to location → Crossfade to location theme
2. Music loops seamlessly
3. Navigate to another location → Crossfade to new theme
4. Back to map → Returns to map theme

### **Audio Controls:**
1. Toggle → Instantly enables/disables all audio
2. Volume → Adjusts in real-time, persists
3. Now Playing → Shows current track title
4. Settings → Expands volume slider

---

## ⚠️ Known Limitations (By Design)

1. **Hover Delay:** 800ms delay before hover music plays
   - **Why:** Prevents spam from rapid mouse movement
   - **Configurable:** Change `hoverDelay` in `useMapAudio` options

2. **Single Audio Instance:** Only one track plays at a time
   - **Why:** Prevents stacking and memory leaks
   - **Cannot:** Play multiple tracks simultaneously

3. **Browser Autoplay:** Requires user interaction
   - **Why:** Browser security policy
   - **Solution:** "Enable Music" button on first visit

---

## 🐛 Troubleshooting

### **Problem: Audio Stacking (Multiple Tracks Playing)**

**Symptoms:**
- Hear multiple songs overlapping
- `document.querySelectorAll('audio').length > 1`

**Causes:**
- Singleton pattern broken
- Multiple AudioService instances created

**Solution:**
1. Check `audioService.ts` → ensure `getInstance()` is used
2. Verify no `new Audio()` calls outside audioService
3. Restart dev server

---

### **Problem: Hover Music Not Playing**

**Symptoms:**
- Hover over location → no music after 800ms

**Causes:**
- Location missing `music` object in JSON
- Audio disabled in UI
- Hover delay not waited long enough

**Solution:**
1. Check location JSON has `music: { url, title }`
2. Ensure "Music On" button is enabled
3. Hover and hold for full 800ms

---

### **Problem: Music Doesn't Return to Map Theme**

**Symptoms:**
- Click 🎵 button → nothing happens
- Leave location → old music keeps playing

**Causes:**
- `world-map-theme.mp3` missing
- `returnToMapTheme` not called

**Solution:**
1. Add `world-map-theme.mp3` to `public/music/`
2. Check 🎵 button `onClick={returnToMapTheme}`

---

### **Problem: Volume Slider Not Working**

**Symptoms:**
- Move slider → volume doesn't change

**Causes:**
- State not syncing with audioService

**Solution:**
1. Check `setVolume` calls `audioService.setVolume()`
2. Verify volume state updates in AudioContext

---

### **Problem: Crossfades Are Abrupt**

**Symptoms:**
- Music cuts off instead of smooth fade

**Causes:**
- Fade duration too short
- Audio service not using fade functions

**Solution:**
1. Increase `fadeDuration` in `audioService.ts` config
2. Verify `fadeOut()` and `fadeIn()` are called in `play()`

---

## 📊 Performance Metrics

### **Expected Performance:**

- **Memory:** ~5-10 MB per audio file (cached)
- **CPU:** <1% during playback
- **Audio Elements:** Always 1
- **Timeouts:** 0-1 active at any time
- **Event Listeners:** Cleaned up on unmount

### **Warning Signs:**

- Memory increasing over time → Memory leak
- Multiple audio elements → Stacking
- Many active timeouts → Cleanup not working
- High CPU usage → Processing error

---

## ✅ Success Criteria

**The audio system is working correctly when:**

1. ✅ Only ONE audio element exists (check DevTools)
2. ✅ Smooth crossfades between all transitions
3. ✅ Hover delay prevents spam (800ms works well)
4. ✅ No audio plays after mouse leaves (cleanup works)
5. ✅ Volume and enabled state persist across refreshes
6. ✅ No console errors related to audio
7. ✅ Return to map theme button works
8. ✅ Memory stable over time (no leaks)

---

## 🎵 Final Setup Steps

### **1. Add World Map Theme**

Place a file named `world-map-theme.mp3` in `public/music/`

**Suggested tracks:**
- "To the Grand Line" (epic adventure)
- "Overtaken" (action-packed)
- "We Are!" instrumental (iconic)

### **2. Add Location Themes (Optional)**

For each location you want music:

```json
// data/locations/{location}.json
{
  "music": {
    "url": "/music/{location}-theme.mp3",
    "title": "{Location Name} Theme",
    "volume": 0.3
  }
}
```

### **3. Test Everything**

Run through the testing checklist above

### **4. Monitor Console**

Check for any `[Audio]` logs or errors

---

## 🎉 You're Done!

The map audio system is now ready with:

✅ **No audio stacking** (singleton pattern)
✅ **Smooth transitions** (800ms crossfades)
✅ **Hover previews** (800ms debounce)
✅ **User controls** (volume, toggle, settings)
✅ **Persistent preferences** (localStorage)
✅ **Memory leak prevention** (proper cleanup)
✅ **Return to map theme** (blue 🎵 button)

**Enjoy your immersive One Piece world map experience!** 🏴‍☠️🎵
