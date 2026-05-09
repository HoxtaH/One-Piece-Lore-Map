"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Location, Saga } from "@/lib/types/location";

export type SegmentPhase = "idle" | "playing" | "done";

interface SegmentPathProps {
  id: string;
  locations: Location[];
  isPlaying: boolean;
  durationMs: number;
  colorMap: Record<Saga, string>;
  onProgress?: (segmentProgress: number, currentLocation: Location | null, phase: SegmentPhase) => void;
}

export function SegmentPath({
  id,
  locations,
  isPlaying,
  durationMs,
  colorMap,
  onProgress,
}: SegmentPathProps) {
  const [progress, setProgress] = useState(0); // 0-100 for this segment
  const [phase, setPhase] = useState<SegmentPhase>("idle");
  const prevIsPlayingRef = useRef(isPlaying);

  // Reset only when transitioning from NOT playing to playing
  useEffect(() => {
    const wasPlaying = prevIsPlayingRef.current;
    const nowPlaying = isPlaying;
    
    // Only reset if we're starting fresh (was false, now true)
    if (!wasPlaying && nowPlaying && (phase === "idle" || phase === "done")) {
      setProgress(0);
      setPhase("idle");
    }
    
    prevIsPlayingRef.current = nowPlaying;
  }, [isPlaying, phase]);

  const getCoords = (loc: Location) => {
    const coords = loc.coordinates;
    if (Array.isArray(coords)) {
      return coords[0] || { x: 0, y: 0 };
    }
    return coords;
  };

  const pathD = useMemo(() => {
    if (!locations.length) return "";
    if (locations.length === 1) {
      const { x, y } = getCoords(locations[0]);
      return `M ${x} ${y}`;
    }

    const start = getCoords(locations[0]);
    let d = `M ${start.x} ${start.y}`;
    for (let i = 1; i < locations.length; i++) {
      const point = getCoords(locations[i]);
      d += ` L ${point.x} ${point.y}`;
    }
    return d;
  }, [locations]);

  // Start/stop animation based on isPlaying
  useEffect(() => {
    if (!isPlaying || locations.length < 2) {
      return;
    }

    setPhase("playing");

    const fps = 60;
    const increment = (100 / durationMs) * (1000 / fps);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return next;
      });
    }, 1000 / fps);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, durationMs, locations.length]);

  // Notify parent about local progress + current location
  // Only when this segment is actually active (not idle)
  useEffect(() => {
    if (!onProgress || !locations.length) return;
    if (phase === "idle") {
      return;
    }
    if (!isPlaying) {
      return;
    }

    const index = Math.min(
      Math.floor((progress / 100) * locations.length),
      locations.length - 1
    );

    onProgress(progress, locations[index] || null, phase);
  }, [progress, locations, phase, onProgress, isPlaying]);

  if (!locations.length || !pathD) return null;

  const dashLength = 1000;

  const gradientStops = locations.map((loc, index) => {
    const offset = (index / (locations.length - 1 || 1)) * 100;
    const color = loc.saga ? colorMap[loc.saga] : "#64748b";
    return (
      <stop key={`${id}-stop-${index}`} offset={`${offset}%`} stopColor={color} />
    );
  });

  return (
    <>
      <defs>
        <linearGradient id={`${id}-gradient`} gradientUnits="userSpaceOnUse">
          {gradientStops}
        </linearGradient>
      </defs>

      <path
        d={pathD}
        stroke={`url(#${id}-gradient)`}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashLength}
        strokeDashoffset={dashLength * (1 - progress / 100)}
        style={{
          transition: "stroke-dashoffset 0.05s linear",
          filter: "drop-shadow(0 0 3px rgba(255,255,255,0.5))",
        }}
      />
    </>
  );
}
