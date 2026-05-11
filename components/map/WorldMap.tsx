'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { LocationSummary, Location } from '@/lib/types/location'
import MapHotspot from './MapHotspot'
import HoverPopup from '../popups/HoverPopup'
import { JourneyPath } from './JourneyPath'
import { JourneyControls } from './JourneyControls'
import { useMapAudio } from '@/lib/hooks/useMapAudio'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { getAssetUrl } from '@/lib/utils/assets'
import MobileTapPopup from '../popups/MobileTapPopup'
import AudioControls from '../audio/AudioControls'

interface WorldMapProps {
  locations: LocationSummary[]
}

export default function WorldMap({ locations }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<LocationSummary | null>(null)
  const [tappedLocation, setTappedLocation] = useState<LocationSummary | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Zoom and Pan state
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Journey animation state
  const [showJourneyPath, setShowJourneyPath] = useState(false)
  const [isJourneyPlaying, setIsJourneyPlaying] = useState(false)
  const [journeyProgress, setJourneyProgress] = useState(0)
  const [currentJourneyLocation, setCurrentJourneyLocation] = useState<Location | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Ref-based state for performance (eliminates re-renders during animation)
  const scaleRef = useRef(1)
  const positionRef = useRef({ x: 0, y: 0 })
  const containerSizeRef = useRef({ width: 0, height: 0 })
  
  // 🔧 DEVELOPMENT MODE: Coordinate Finder
  const [coordinateFinderMode, setCoordinateFinderMode] = useState(false)
  
  // 🔧 DEVELOPMENT MODE: Show/Hide Hotspots
  const [showHotspots, setShowHotspots] = useState(false)
  
  // Camera Lock for Journey
  const [isCameraLocked, setIsCameraLocked] = useState(true)

  const MIN_SCALE = 1
  const [maxScale, setMaxScale] = useState(10)
  const ZOOM_STEP = 0.21
  
  // Dynamic zoom level for journey: 6x for desktop, 8x for mobile
  const [journeyZoomLevel, setJourneyZoomLevel] = useState(6)
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setJourneyZoomLevel(10)
      setMaxScale(20)
    } else {
      setJourneyZoomLevel(6)
      setMaxScale(10)
    }
  }, [])

  // AUDIO: Initialize map audio
  useMapAudio();

  // Touch refs for pinch-to-zoom and panning
  const pinchStartDistRef = useRef<number>(0)
  const pinchStartScaleRef = useRef<number>(0)
  const lastTouchPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Toggle coordinate finder mode with Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+C for coordinate finder (dev only)
      if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && e.ctrlKey && e.shiftKey && e.key === 'C') {
        setCoordinateFinderMode(prev => {
          const newMode = !prev;
          console.clear();
          if (newMode) {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan');
            console.log('%c🎮 PIXEL MAP COORDINATE FINDER', 'color: lime; font-size: 18px; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan');
            console.log('%cMode: ACTIVE ✅', 'color: lime; font-weight: bold');
            console.log('%cInstructions:', 'color: yellow; font-weight: bold');
            console.log('  1. Click on any island on the map');
            console.log('  2. Coordinates will appear below');
            console.log('  3. Copy and paste into your JSON file');
            console.log('  4. Press Ctrl+Shift+C again to exit');
            console.log('');
            console.log('%c✅ Click islands now!', 'color: lime; font-weight: bold');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan');
          } else {
            console.log('%c🛑 Coordinate Finder Mode DISABLED', 'color: orange; font-weight: bold');
          }
          return newMode;
        });
        e.preventDefault();
      }
      
      // Ctrl+Shift+H for hotspot visibility (dev only)
      if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && e.ctrlKey && e.shiftKey && e.key === 'H') {
        setShowHotspots(prev => {
          const newMode = !prev;
          console.log(newMode 
            ? '%c👁️ HOTSPOTS VISIBLE - Press Ctrl+Shift+H to hide' 
            : '%c🙈 HOTSPOTS HIDDEN - Press Ctrl+Shift+H to show', 
            `color: ${newMode ? 'lime' : 'orange'}; font-weight: bold; font-size: 14px`
          );
          return newMode;
        });
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Mobile Scale
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setScale(1.8)
    }
    
    const handleResize = () => {
      if (window.innerWidth < 768 && scale === 1) {
        setScale(1.8)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sync refs with state when they change via controls/gestures
  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    positionRef.current = position
  }, [position])

  // Task 7: Cache getBoundingClientRect via ResizeObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerSizeRef.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height
        }
      }
    })

    observer.observe(container)
    
    // Initial size
    const rect = container.getBoundingClientRect()
    containerSizeRef.current = { width: rect.width, height: rect.height }

    return () => observer.disconnect()
  }, [])

  // Calculate bounds using cached size (no layout reflow)
  const getBounds = useCallback((currentScale: number) => {
    const { width, height } = containerSizeRef.current
    if (width === 0) return { x: 0, y: 0 }
    // Max offset is half the overflow width/height
    const x = (width * currentScale - width) / 2
    const y = (height * currentScale - height) / 2
    return { x, y }
  }, [])

  // Effect to clamp position when scale changes (e.g. zooming out)
  useEffect(() => {
    const bounds = getBounds(scale)
    setPosition(prev => ({
      x: Math.max(-bounds.x, Math.min(bounds.x, prev.x)),
      y: Math.max(-bounds.y, Math.min(bounds.y, prev.y))
    }))
  }, [scale, getBounds])

  // Handle wheel event with non-passive listener to prevent scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheelEvent = (event: WheelEvent) => {
      if (coordinateFinderMode) return
      event.preventDefault()
      
      // Unlock camera on user interaction
      if (isJourneyPlaying) setIsCameraLocked(false)
      
      const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
      const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), maxScale)
      
      if (newScale !== scale) {
        const rect = container.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const scaleRatio = newScale / scale
        const newX = (mouseX - centerX) - (mouseX - centerX - position.x) * scaleRatio
        const newY = (mouseY - centerY) - (mouseY - centerY - position.y) * scaleRatio
        
        // Clamp the new position immediately
        const bounds = getBounds(newScale)
        setPosition({ 
          x: Math.max(-bounds.x, Math.min(bounds.x, newX)),
          y: Math.max(-bounds.y, Math.min(bounds.y, newY))
        })
        setScale(newScale)
      }
    }

    // Add with { passive: false } to allow preventDefault
    container.addEventListener('wheel', handleWheelEvent, { passive: false })
    return () => container.removeEventListener('wheel', handleWheelEvent)
  }, [scale, position, coordinateFinderMode])

  const handleMouseEnter = (location: LocationSummary, event: React.MouseEvent) => {
    setHoveredLocation(location)
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (coordinateFinderMode) return; // Disable dragging in coordinate finder mode
    
    if (hoveredLocation) {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    
    // Handle dragging
    if (isDragging) {
      if (isJourneyPlaying && isCameraLocked) setIsCameraLocked(false)

      const deltaX = event.clientX - dragStart.x
      const deltaY = event.clientY - dragStart.y
      
      const nextX = position.x + deltaX
      const nextY = position.y + deltaY
      
      const bounds = getBounds(scale)
      
      setPosition({
        x: Math.max(-bounds.x, Math.min(bounds.x, nextX)),
        y: Math.max(-bounds.y, Math.min(bounds.y, nextY)),
      })
      
      setDragStart({ x: event.clientX, y: event.clientY })
    }
  }

  const handleMouseLeave = () => {
    setHoveredLocation(null)
    setIsDragging(false)
  }

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent) => {
    if (coordinateFinderMode) return; // Disable dragging in coordinate finder mode
    if (event.button === 0) { // Left mouse button
      setIsDragging(true)
      setDragStart({ x: event.clientX, y: event.clientY })
    }
  }

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // --- TOUCH HANDLERS ---
  
  const handleTouchStart = (event: React.TouchEvent) => {
    if (coordinateFinderMode) return

    if (event.touches.length === 1) {
      // Single finger pan
      const touch = event.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX, y: touch.clientY })
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    } else if (event.touches.length === 2) {
      // Pinch to zoom
      setIsDragging(false) // Stop panning when two fingers are down
      const t1 = event.touches[0]
      const t2 = event.touches[1]
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      pinchStartDistRef.current = dist
      pinchStartScaleRef.current = scale
    }
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (coordinateFinderMode) return
    
    if (event.touches.length === 1 && isDragging) {
      // Single finger pan
      const touch = event.touches[0]
      if (isJourneyPlaying && isCameraLocked) setIsCameraLocked(false)

      const deltaX = touch.clientX - lastTouchPosRef.current.x
      const deltaY = touch.clientY - lastTouchPosRef.current.y
      
      const nextX = position.x + deltaX
      const nextY = position.y + deltaY
      
      const bounds = getBounds(scale)
      
      setPosition({
        x: Math.max(-bounds.x, Math.min(bounds.x, nextX)),
        y: Math.max(-bounds.y, Math.min(bounds.y, nextY)),
      })
      
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
    } else if (event.touches.length === 2) {
      // Pinch to zoom
      const t1 = event.touches[0]
      const t2 = event.touches[1]
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      
      if (pinchStartDistRef.current > 0) {
        const ratio = currentDist / pinchStartDistRef.current
        const newScale = Math.min(Math.max(pinchStartScaleRef.current * ratio, MIN_SCALE), maxScale)
        
        if (newScale !== scale && containerRef.current) {
          // Calculate midpoint for focal point
          const rect = containerRef.current.getBoundingClientRect()
          const midX = (t1.clientX + t2.clientX) / 2 - rect.left
          const midY = (t1.clientY + t2.clientY) / 2 - rect.top
          
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          
          const scaleRatio = newScale / scale
          const newX = (midX - centerX) - (midX - centerX - position.x) * scaleRatio
          const newY = (midY - centerY) - (midY - centerY - position.y) * scaleRatio
          
          const bounds = getBounds(newScale)
          setPosition({ 
            x: Math.max(-bounds.x, Math.min(bounds.x, newX)),
            y: Math.max(-bounds.y, Math.min(bounds.y, newY))
          })
          setScale(newScale)
        }
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    pinchStartDistRef.current = 0
  }

  const handleLocationTap = (location: LocationSummary) => {
    setTappedLocation(location)
  }

  const handleBackgroundClick = () => {
    if (tappedLocation) setTappedLocation(null)
  }

  // Zoom controls
  const zoomIn = () => {
    setScale(Math.min(scale + ZOOM_STEP, maxScale))
  }

  const zoomOut = () => {
    setScale(Math.max(scale - ZOOM_STEP, MIN_SCALE))
  }

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Double-click to toggle between max zoom and default
  const handleDoubleClick = (event: React.MouseEvent) => {
    if (coordinateFinderMode) return; // Disable double-click zoom in coordinate finder mode
    event.preventDefault()
    
    // If already at max zoom, reset to default
    if (scale >= maxScale * 0.9) { // 90% threshold to account for floating point
      setScale(1)
      setPosition({ x: 0, y: 0 })
      return
    }
    
    // Otherwise, zoom to max at clicked position
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Calculate offset to center on double-click point at max zoom
    const centerOffsetX = (centerX - mouseX + position.x) * (maxScale / scale)
    const centerOffsetY = (centerY - mouseY + position.y) * (maxScale / scale)
    
    setScale(maxScale)
    setPosition({ 
      x: centerOffsetX, 
      y: centerOffsetY 
    })
  }

  // Prevent default wheel behavior on the container
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      const preventScroll = (e: WheelEvent) => e.preventDefault()
      container.addEventListener('wheel', preventScroll, { passive: false })
      return () => container.removeEventListener('wheel', preventScroll)
    }
  }, [])

  // Handle SVG clicks for coordinate finder
  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!coordinateFinderMode) return;
    
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 10798 / rect.width;
    const scaleY = 5429 / rect.height;
    
    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c📍 Clicked!`, 'color: yellow; font-weight: bold');
      console.log(`%c{ "x": ${x}, "y": ${y} }`, 'color: lime; font-size: 14px; font-weight: bold; background: #000; padding: 8px');
      console.log(`%c↑ Copy this!`, 'color: cyan');
      console.log('');
    }
    
    event.stopPropagation();
    event.preventDefault();
  };

  // Journey controls
  const handleToggleJourney = () => {
    setShowJourneyPath(!showJourneyPath)
    if (!showJourneyPath) {
      // Reset when showing
      setIsJourneyPlaying(false)
      setJourneyProgress(0)
      setIsCameraLocked(true) // Reset lock when opening
    }
  }

  const handlePlayJourney = () => {
    setIsJourneyPlaying(!isJourneyPlaying)
    if (!isJourneyPlaying) setIsCameraLocked(true) // Auto-lock on play
  }

  const handleRestartJourney = () => {
    setIsJourneyPlaying(false)
    setJourneyProgress(0)
    setCurrentJourneyLocation(null)
    setIsCameraLocked(true) // Reset lock
    // Small delay before restarting
    setTimeout(() => setIsJourneyPlaying(true), 100)
  }

  // Task 6: Wrap handleJourneyProgress in useCallback
  const handleJourneyProgress = useCallback((progress: number, location: Location | null, headPosition: {x:number, y:number} | null) => {
    // Only update progress state (updates UI controls)
    setJourneyProgress(progress)
    
    // Only update location state if it actually changed (minimizes re-renders)
    if (location?.id !== currentJourneyLocation?.id) {
      setCurrentJourneyLocation(location)
    }
    
    // Task 5: Ref-based camera follow (direct DOM transforms)
    if (isCameraLocked && headPosition && isJourneyPlaying && contentRef.current) {
       const { width, height } = containerSizeRef.current;
       if (width === 0) return;

       const mapWidth = 10798;
       const mapHeight = 5429;
       
       const mapRatio = mapWidth / mapHeight;
       const containerRatio = width / height;
       
       let scaleFactor = 1;
       if (containerRatio > mapRatio) {
          scaleFactor = height / mapHeight;
       } else {
          scaleFactor = width / mapWidth;
       }
       
       const centerX = mapWidth / 2;
       const centerY = mapHeight / 2;
       
       const offsetX = (headPosition.x - centerX) * scaleFactor;
       const offsetY = (headPosition.y - centerY) * scaleFactor;
       
       const targetScale = journeyZoomLevel;
       
       const newX = -offsetX * targetScale;
       const newY = -offsetY * targetScale;
       
       const bounds = getBounds(targetScale);
       const clampedX = Math.max(-bounds.x, Math.min(bounds.x, newX));
       const clampedY = Math.max(-bounds.y, Math.min(bounds.y, newY));
       
       // Update refs immediately
       positionRef.current = { x: clampedX, y: clampedY };
       scaleRef.current = targetScale;

       // TASK 5: Update DOM directly for smooth, zero-render camera follow
       contentRef.current.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px)) scale(${targetScale})`;
       
       // Update state occasionally to keep it in sync, but don't let it drive the animation
    }
  }, [isCameraLocked, isJourneyPlaying, currentJourneyLocation, journeyZoomLevel, getBounds])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleBackgroundClick}
      style={{ 
        cursor: coordinateFinderMode ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Coordinate Finder Mode Indicator */}
      {coordinateFinderMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-lime-500 text-black px-6 py-3 rounded-lg font-bold shadow-lg animate-pulse">
          🎮 COORDINATE FINDER MODE - Click islands to get coordinates! (Ctrl+Shift+C to exit)
        </div>
      )}

      {/* Hotspot Visibility Indicator */}
      {showHotspots && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
          👁️ HOTSPOTS VISIBLE (Ctrl+Shift+H to hide)
        </div>
      )}

      {/* Zoomable Content Container */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
          transformOrigin: 'center',
          transition: (isDragging || (isJourneyPlaying && isCameraLocked)) ? 'none' : 'transform 0.1s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      >
        {/* Map Image - Pixel Art */}
        <img
          src={getAssetUrl("/Ohara_World_Map_Pixel.png")}
          alt="One Piece World Map - Pixel Art"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          draggable={false}
        />
        
        {/* SVG Overlay - Pixel Coordinate System */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: coordinateFinderMode ? 'auto' : 'none',
          }}
          viewBox="0 0 10798 5429"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleSvgClick}
        >
          {/* Journey Path Animation Layer */}
          {showJourneyPath && (
            <JourneyPath
              locations={locations as Location[]}
              isPlaying={isJourneyPlaying}
              onProgressChange={handleJourneyProgress}
            />
          )}

          {/* Location Hotspots */}
          {!coordinateFinderMode && locations && locations.length > 0 && locations.map((location) => {
            // Support single coordinate or array of coordinates
            const coords = Array.isArray(location.coordinates) 
              ? location.coordinates 
              : [location.coordinates];
            
            return coords.map((coord, index) => (
              <g key={`${location.id}-${index}`} style={{ pointerEvents: 'auto' }}>
                <MapHotspot
                  location={location}
                  coordinates={coord}
                  showHotspot={showHotspots}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTap={handleLocationTap}
                  isTapped={tappedLocation?.id === location.id}
                  isJourneyPlaying={isJourneyPlaying}
                />
              </g>
            ));
          })}
        </svg>
      </div>

      {/* Mobile Location Popup */}
      <MobileTapPopup 
        location={tappedLocation} 
        onClose={() => setTappedLocation(null)} 
      />

      {/* Desktop Journey Controls (hidden on mobile — handled by MobileBottomHUD below) */}
      <JourneyControls
        showJourneyPath={showJourneyPath}
        isPlaying={isJourneyPlaying}
        isCameraLocked={isCameraLocked}
        progress={journeyProgress}
        currentLocation={currentJourneyLocation}
        onToggleJourney={handleToggleJourney}
        onPlay={handlePlayJourney}
        onRestart={handleRestartJourney}
        onToggleCameraLock={() => setIsCameraLocked(!isCameraLocked)}
      />

      {/* Desktop Audio Controls (hidden on mobile — handled by MobileBottomHUD below) */}
      <AudioControls />

      {/* ── Mobile Bottom HUD ──────────────────────────────────────────────
           Fixed to the bottom of the screen, grows upward as content expands.
           Stack order (bottom → top): Journey Controls → Audio Controls → Prompt
           Everything stays in the blue letterbox area below the map image.
      ────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-2 left-0 right-0 z-50 md:hidden flex flex-col [@media(max-height:600px)]:flex-row items-center justify-center gap-2 px-3">
        {/* Audio Controls (prompt + enable button) — sits above journey */}
        <AudioControls mobileInline />

        {/* Journey Controls — always at the very bottom */}
        <JourneyControls
          showJourneyPath={showJourneyPath}
          isPlaying={isJourneyPlaying}
          isCameraLocked={isCameraLocked}
          progress={journeyProgress}
          currentLocation={currentJourneyLocation}
          onToggleJourney={handleToggleJourney}
          onPlay={handlePlayJourney}
          onRestart={handleRestartJourney}
          onToggleCameraLock={() => setIsCameraLocked(!isCameraLocked)}
          mobileInline
        />
      </div>

      {/* Header */}
      <div 
        className="absolute top-2 left-0 right-0 p-2 md:p-6 z-[5]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          pointerEvents: 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
              One Piece World Map
            </h1>
            <p className="text-white/80 mt-1 text-xs md:text-sm drop-shadow hidden md:block">
              Scroll to zoom • Double-click to toggle zoom • Drag to pan • Hover over locations
            </p>
            <p className="text-white/80 mt-1 text-[10px] drop-shadow md:hidden opacity-70">
              Pinch to zoom • Drag to pan • Tap locations
            </p>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div 
        className="fixed top-20 left-2 md:top-auto md:bottom-6 md:left-6 hidden md:flex [@media(max-height:600px)]:hidden flex-col gap-2 z-50"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={zoomIn}
          disabled={scale >= maxScale}
          className="p-2 md:p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="p-2 md:p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        <button
          onClick={resetView}
          disabled={scale === MIN_SCALE && position.x === 0 && position.y === 0}
          className="p-2 md:p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        
        {/* Zoom Level Indicator */}
        <div className="px-2 py-1 md:px-3 md:py-2 bg-black/80 text-white text-[10px] md:text-sm rounded-lg backdrop-blur border border-white/10 text-center">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Hover Popup */}
      {hoveredLocation && !coordinateFinderMode && (
        <div style={{ zIndex: 100 }}>
          <HoverPopup
            location={hoveredLocation}
            position={mousePosition}
          />
        </div>
      )}
    </div>
  )
}


