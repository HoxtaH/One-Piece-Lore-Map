'use client'

import { useState, useRef, useEffect } from 'react'
import { LocationSummary, Location } from '@/lib/types/location'
import MapHotspot from './MapHotspot'
import HoverPopup from '../popups/HoverPopup'
import { JourneyPath } from './JourneyPath'
import { JourneyControls } from './JourneyControls'
import { useMapAudio } from '@/lib/hooks/useMapAudio'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

interface WorldMapProps {
  locations: LocationSummary[]
}

export default function WorldMap({ locations }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<LocationSummary | null>(null)
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
  
  // 🔧 DEVELOPMENT MODE: Coordinate Finder
  const [coordinateFinderMode, setCoordinateFinderMode] = useState(false)
  
  // 🔧 DEVELOPMENT MODE: Show/Hide Hotspots
  const [showHotspots, setShowHotspots] = useState(false)
  
  // Camera Lock for Journey
  const [isCameraLocked, setIsCameraLocked] = useState(true)

  const MIN_SCALE = 1
  const MAX_SCALE = 10  // Increased from 4 to 8 for high-detail pixel map
  const JOURNEY_ZOOM_LEVEL = 6
  const ZOOM_STEP = 0.21

  // AUDIO: Initialize map audio
  useMapAudio();

  // AUDIO: Initialize map audio
  useMapAudio();

  // Toggle coordinate finder mode with Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+C for coordinate finder
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
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
      
      // Ctrl+Shift+H for hotspot visibility
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
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

  // Calculate bounds based on current scale
  const getBounds = (currentScale: number) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const { width, height } = containerRef.current.getBoundingClientRect()
    // Max offset is half the overflow width/height
    const x = (width * currentScale - width) / 2
    const y = (height * currentScale - height) / 2
    return { x, y }
  }

  // Effect to clamp position when scale changes (e.g. zooming out)
  useEffect(() => {
    const bounds = getBounds(scale)
    setPosition(prev => ({
      x: Math.max(-bounds.x, Math.min(bounds.x, prev.x)),
      y: Math.max(-bounds.y, Math.min(bounds.y, prev.y))
    }))
  }, [scale])

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
      const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE)
      
      if (newScale !== scale) {
        const rect = container.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        
        const scaleRatio = newScale / scale
        const newX = mouseX - (mouseX - position.x) * scaleRatio
        const newY = mouseY - (mouseY - position.y) * scaleRatio
        
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

  // Zoom controls
  const zoomIn = () => {
    setScale(Math.min(scale + ZOOM_STEP, MAX_SCALE))
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
    if (scale >= MAX_SCALE * 0.9) { // 90% threshold to account for floating point
      setScale(1)
      setPosition({ x: 0, y: 0 })
      return
    }
    
    // Otherwise, zoom to max at clicked position
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    // Calculate offset to center on double-click point at max zoom
    const centerOffsetX = (rect.width / 2 - mouseX) * (MAX_SCALE - 1)
    const centerOffsetY = (rect.height / 2 - mouseY) * (MAX_SCALE - 1)
    
    setScale(MAX_SCALE)
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
    
    console.log(`%c📍 Clicked!`, 'color: yellow; font-weight: bold');
    console.log(`%c{ "x": ${x}, "y": ${y} }`, 'color: lime; font-size: 14px; font-weight: bold; background: #000; padding: 8px');
    console.log(`%c↑ Copy this!`, 'color: cyan');
    console.log('');
    
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

  const handleJourneyProgress = (progress: number, location: Location | null, headPosition: {x:number, y:number} | null) => {
    setJourneyProgress(progress)
    setCurrentJourneyLocation(location)
    
    // Camera Follow Logic
    if (isCameraLocked && headPosition && containerRef.current && isJourneyPlaying) {
       const { width, height } = containerRef.current.getBoundingClientRect();
       const mapWidth = 10798;
       const mapHeight = 5429;
       
       const mapRatio = mapWidth / mapHeight;
       const containerRatio = width / height;
       
       // Calculate how many pixels 1 SVG unit takes up at Scale 1
       let scaleFactor = 1;
       if (containerRatio > mapRatio) {
          scaleFactor = height / mapHeight;
       } else {
          scaleFactor = width / mapWidth;
       }
       
       const centerX = mapWidth / 2;
       const centerY = mapHeight / 2;
       
       // Calculate offset of head from center in unscaled pixels
       const offsetX = (headPosition.x - centerX) * scaleFactor;
       const offsetY = (headPosition.y - centerY) * scaleFactor;
       
       const targetScale = JOURNEY_ZOOM_LEVEL;
       
       // Calculate position with zoom
       // We shift the map so that the head point moves to center
       const newX = -offsetX * targetScale;
       const newY = -offsetY * targetScale;
       
       const bounds = getBounds(targetScale);
       const clampedX = Math.max(-bounds.x, Math.min(bounds.x, newX));
       const clampedY = Math.max(-bounds.y, Math.min(bounds.y, newY));
       
       setPosition({ x: clampedX, y: clampedY });
       
       if (scale !== targetScale) setScale(targetScale);
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{ 
        cursor: coordinateFinderMode ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
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
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
          transformOrigin: 'center',
          transition: (isDragging || (isJourneyPlaying && isCameraLocked)) ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Map Image - Pixel Art */}
        <img
          src="/Ohara_World_Map_Pixel.png"
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
                />
              </g>
            ));
          })}
        </svg>
      </div>

      {/* Journey Controls */}
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

      {/* Header */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
          One Piece World Map
        </h1>
        <p className="text-white/80 mt-1 text-sm drop-shadow">
          Scroll to zoom • Double-click to toggle zoom • Drag to pan • Hover over locations
        </p>
      </div>

      {/* Zoom Controls */}
      <div 
        className="fixed bottom-6 left-6 flex flex-col gap-2 z-50"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <button
          onClick={resetView}
          disabled={scale === MIN_SCALE && position.x === 0 && position.y === 0}
          className="p-3 bg-black/80 hover:bg-black/90 text-white rounded-lg backdrop-blur border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        
        {/* Zoom Level Indicator */}
        <div className="px-3 py-2 bg-black/80 text-white text-sm rounded-lg backdrop-blur border border-white/10 text-center">
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


