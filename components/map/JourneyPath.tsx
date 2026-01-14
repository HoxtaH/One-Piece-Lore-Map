'use client';

import { useMemo, useEffect, useState } from 'react';
import { Location } from '@/lib/types/location';

interface JourneyPathProps {
  locations: Location[];
  isPlaying: boolean;
  onProgressChange?: (progress: number, currentLocation: Location | null, headPosition: { x: number; y: number } | null) => void;
}

export function JourneyPath({ locations, isPlaying, onProgressChange }: JourneyPathProps) {
  const [progress, setProgress] = useState(0); // 0-100
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  // Sort locations by journey order
  const journeyLocations = useMemo(() => {
    return locations
      .filter((loc) => loc.journeyOrder !== undefined && loc.journeyOrder > 0)
      .sort((a, b) => (a.journeyOrder || 0) - (b.journeyOrder || 0));
  }, [locations]);

  // Helper to calculate point on segment
  const getPointOnSegment = (segment: any, t: number) => {
    const { startCoords, endCoords, path } = segment;
    const isCurve = path.includes('Q');
    
    if (isCurve) {
       const match = path.match(/Q\s+(-?\d+\.?\d*),(-?\d+\.?\d*)/);
       if (match) {
         const cx = parseFloat(match[1]);
         const cy = parseFloat(match[2]);
         const x = Math.pow(1-t, 2) * startCoords.x + 2 * (1-t) * t * cx + Math.pow(t, 2) * endCoords.x;
         const y = Math.pow(1-t, 2) * startCoords.y + 2 * (1-t) * t * cy + Math.pow(t, 2) * endCoords.y;
         return { x, y };
       }
    }
    
    const x = startCoords.x + (endCoords.x - startCoords.x) * t;
    const y = startCoords.y + (endCoords.y - startCoords.y) * t;
    return { x, y };
  };

  // Generate path segments and detect timeskip
  const pathSegments = useMemo(() => {
    if (journeyLocations.length < 2) return [];

    const segments: Array<{
      path: string;
      isTimeskip: boolean;
      startIndex: number;
      endIndex: number;
      startCoords: { x: number; y: number };
      endCoords: { x: number; y: number };
    }> = [];

    for (let i = 0; i < journeyLocations.length - 1; i++) {
      const current = journeyLocations[i];
      const next = journeyLocations[i + 1];

      // Get all coordinates for current location (could be array for multi-point locations)
      const currentCoordsArray = Array.isArray(current.coordinates)
        ? current.coordinates
        : [current.coordinates];
      
      // Get the LAST coordinate of current location (exit point)
      const currentCoords = currentCoordsArray[currentCoordsArray.length - 1];
      
      // Get all coordinates for next location
      const nextCoordsArray = Array.isArray(next.coordinates)
        ? next.coordinates
        : [next.coordinates];
      
      // Get the FIRST coordinate of next location (entry point)
      const nextCoords = nextCoordsArray[0];

      // If next location has multiple coordinates, create a path through all of them
      if (nextCoordsArray.length > 1) {
        // First segment: current location's exit -> next location's first point
        const firstSegmentDistance = Math.sqrt(
          Math.pow(nextCoords.x - currentCoords.x, 2) +
            Math.pow(nextCoords.y - currentCoords.y, 2)
        );
        const isFirstTimeskip = firstSegmentDistance > 8000;

        let firstPathData: string;
        if (next.pathControl) {
          firstPathData = `M ${currentCoords.x},${currentCoords.y} Q ${next.pathControl.x},${next.pathControl.y} ${nextCoords.x},${nextCoords.y}`;
        } else {
          firstPathData = `M ${currentCoords.x},${currentCoords.y} L ${nextCoords.x},${nextCoords.y}`;
        }

        segments.push({
          path: firstPathData,
          isTimeskip: isFirstTimeskip,
          startIndex: i,
          endIndex: i + 1,
          startCoords: currentCoords,
          endCoords: nextCoords,
        });

        // Additional segments: connect all internal points of the multi-point location
        for (let j = 0; j < nextCoordsArray.length - 1; j++) {
          const pointA = nextCoordsArray[j];
          const pointB = nextCoordsArray[j + 1];
          
          segments.push({
            path: `M ${pointA.x},${pointA.y} L ${pointB.x},${pointB.y}`,
            isTimeskip: false,
            startIndex: i,
            endIndex: i + 1,
            startCoords: pointA,
            endCoords: pointB,
          });
        }
      } else {
        // Single coordinate location - standard behavior
        const distance = Math.sqrt(
          Math.pow(nextCoords.x - currentCoords.x, 2) +
            Math.pow(nextCoords.y - currentCoords.y, 2)
        );

        const isTimeskip = distance > 8000;

        let pathData: string;
        if (next.pathControl) {
          pathData = `M ${currentCoords.x},${currentCoords.y} Q ${next.pathControl.x},${next.pathControl.y} ${nextCoords.x},${nextCoords.y}`;
        } else {
          pathData = `M ${currentCoords.x},${currentCoords.y} L ${nextCoords.x},${nextCoords.y}`;
        }

        segments.push({
          path: pathData,
          isTimeskip,
          startIndex: i,
          endIndex: i + 1,
          startCoords: currentCoords,
          endCoords: nextCoords,
        });
      }
    }

    return segments;
  }, [journeyLocations]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      // Reset when stopped
      setProgress(0);
      setCurrentLocationIndex(0);
      return;
    }

    const fps = 60;
    const durationMs = 120000; // 2 minutes for full journey
    const increment = (100 / durationMs) * (1000 / fps);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update current location based on progress
  useEffect(() => {
    if (journeyLocations.length === 0 || pathSegments.length === 0) return;
    
    // Calculate which segment we're currently on based on progress
    const totalSegments = pathSegments.length;
    const keyframe = (progress / 100) * totalSegments;
    // Ensure index doesn't exceed array bounds (when progress is 100)
    const currentSegmentIndex = Math.min(Math.floor(keyframe), totalSegments - 1);
    const currentSegment = pathSegments[currentSegmentIndex];
    
    // Calculate t (0-1) within the current segment
    // If progress is 100, t should be 1
    const t = (progress === 100) ? 1 : (keyframe - Math.floor(keyframe));
    
    // Calculate head position
    const headPosition = currentSegment ? getPointOnSegment(currentSegment, t) : null;

    // Get the location index from the segment's endIndex (the destination location)
    const index = currentSegment ? currentSegment.endIndex : 0;
    
    setCurrentLocationIndex(index);
    
    if (onProgressChange) {
      onProgressChange(progress, journeyLocations[index] || null, headPosition);
    }
  }, [progress, journeyLocations, pathSegments, onProgressChange]);

  if (journeyLocations.length < 2) return null;

  // Calculate total path length for strokeDasharray
  const totalPathLength = 20000; // Approximate total length

  return (
    <g className="journey-path-layer">
      {/* Draw individual path segments */}
      {pathSegments.map((segment, index) => {
        // Calculate if this segment should be visible based on progress
        const segmentProgress = (progress / 100) * pathSegments.length;
        const isVisible = index < segmentProgress;
        const isPartial = index < segmentProgress && index + 1 > segmentProgress;
        const segmentOpacity = isVisible ? (isPartial ? (segmentProgress - index) : 1) : 0;

        // Hide the timeskip line completely
        if (segment.isTimeskip) return null;

        return (
          <path
            key={`segment-${index}`}
            d={segment.path}
            stroke="#8B4513" // Brown vintage color
            strokeWidth="10"
            fill="none"
            opacity={segmentOpacity}
            style={{
              shapeRendering: 'crispEdges', // Pixelated look
              filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))',
              transition: 'opacity 0.2s linear',
            }}
          />
        );
      })}

      {/* Timeskip label */}
      {pathSegments.map((segment, index) => {
        if (!segment.isTimeskip) return null;

        const segmentProgress = (progress / 100) * pathSegments.length;
        if (index >= segmentProgress) return null;

        const midX = (segment.startCoords.x + segment.endCoords.x) / 2;
        const midY = (segment.startCoords.y + segment.endCoords.y) / 2;

        return (
          <g key={`timeskip-label-${index}`}>
            {/* Background */}
            <rect
              x={midX - 200}
              y={midY - 50}
              width="400"
              height="100"
              fill="#E8DCC4"
              stroke="#654321"
              strokeWidth="6"
              rx="12"
              opacity={0.95}
              style={{ shapeRendering: 'crispEdges' }}
            />
            {/* Text */}
            <text
              x={midX}
              y={midY + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2D1810"
              fontSize="48"
              fontWeight="bold"
              style={{ fontFamily: 'Pirata One', pointerEvents: 'none' }}
            >
              ⏱️ 2-Year Timeskip
            </text>
          </g>
        );
      })}

      {/* Location markers (Hollow Rings) */}
      {journeyLocations.map((loc, index) => {
        const coords = Array.isArray(loc.coordinates) ? loc.coordinates[0] : loc.coordinates;
        const isReached = index <= currentLocationIndex;
        const isCurrent = index === currentLocationIndex;

        return (
          <g key={loc.slug}>
            {/* Marker Ring */}
            <circle
              cx={coords.x}
              cy={coords.y}
              r={isCurrent ? 50 : 30}
              fill="rgba(212, 175, 55, 0.1)" // Very subtle tint
              stroke={isReached ? '#D4AF37' : '#8B7355'}
              strokeWidth={isCurrent ? 6 : 4}
              strokeDasharray={isReached ? 'none' : '5,5'}
              opacity={isReached ? 1 : 0.6}
              style={{
                filter: isCurrent
                  ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))'
                  : 'none',
                transition: 'all 0.5s ease',
                shapeRendering: 'geometricPrecision', // Smoother circles
              }}
            />
          </g>
        );
      })}

      {/* Ship Icon following the path */}
      {(() => {
        // Recalculate head position for rendering
        if (progress <= 0 || journeyLocations.length === 0 || pathSegments.length === 0) return null;
        
        // Use same logic as useEffect
        const totalSegments = pathSegments.length;
        const keyframe = (progress / 100) * totalSegments;
        const currentSegmentIndex = Math.min(Math.floor(keyframe), totalSegments - 1);
        const currentSegment = pathSegments[currentSegmentIndex];
        const t = (progress === 100) ? 1 : (keyframe - Math.floor(keyframe));
        
        const pos = currentSegment ? getPointOnSegment(currentSegment, t) : null;
        
        if (!pos) return null;

        return (
          <g transform={`translate(${pos.x}, ${pos.y})`} style={{ pointerEvents: 'none' }}>
             {/* Glow behind ship */}
             <circle r="40" fill="white" opacity="0.4" filter="blur(15px)" />
             {/* Going Merry GIF */}
             <image
               href="/images/onePieceMerryGoSticker.gif"
               width="150"
               height="150"
               x="-75"
               y="-75"
               style={{
                 filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.6))',
               }}
             />
          </g>
        )
      })()}
    </g>
  );
}
