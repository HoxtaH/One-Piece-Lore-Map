'use client';

import { useMemo, useEffect, useState, useRef } from 'react';
import { Location } from '@/lib/types/location';
import { getAssetUrl } from '@/lib/utils/assets';

interface JourneyPathProps {
  locations: Location[];
  isPlaying: boolean;
  onProgressChange?: (progress: number, currentLocation: Location | null, headPosition: { x: number; y: number } | null) => void;
}

export function JourneyPath({ locations, isPlaying, onProgressChange }: JourneyPathProps) {
  const [progress, setProgress] = useState(0); // 0-100
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  
  // Refs for animation and optimization
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const headPositionRef = useRef<{ x: number; y: number } | null>(null);

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

  // Animation loop using requestAnimationFrame for better performance
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      setCurrentLocationIndex(0);
      previousTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const durationMs = 120000; // 2 minutes for full journey

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        const increment = (100 / durationMs) * deltaTime;
        
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            return 100;
          }
          return next;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
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
    const headPos = currentSegment ? getPointOnSegment(currentSegment, t) : null;
    headPositionRef.current = headPos;

    // Get the location index from the segment's endIndex (the destination location)
    const index = currentSegment ? currentSegment.endIndex : 0;
    
    setCurrentLocationIndex(index);
    
    if (onProgressChange) {
      onProgressChange(progress, journeyLocations[index] || null, headPos);
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
                transition: 'all 0.5s ease',
                shapeRendering: 'geometricPrecision', // Smoother circles
              }}
            />
          </g>
        );
      })}

      {/* Ship Icon following the path */}
      {(() => {
        const pos = headPositionRef.current;
        
        if (!pos) return null;

        return (
          <g transform={`translate(${pos.x}, ${pos.y})`} style={{ pointerEvents: 'none' }}>
             {/* Glow behind ship - Simplified for mobile performance */}
             <circle r="40" fill="white" opacity="0.4" />
             {/* Going Merry GIF */}
             <image
               href={getAssetUrl("/images/onePieceMerryGoSticker.gif")}
               width="250"
               height="250"
               x="-125"
               y="-125"
               style={{
                 opacity: 0.9,
               }}
             />
          </g>
        )
      })()}
    </g>
  );
}
