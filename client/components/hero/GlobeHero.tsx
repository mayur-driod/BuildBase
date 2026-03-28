'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import createGlobe from 'cobe';
import Link from 'next/link';

type BusinessLocation = {
  city: string;
  lat: number;
  lng: number;
  intensity: number;
};

// Key Indian business hubs (lat/lng in degrees)
const BUSINESS_LOCATIONS = [
  { city: 'Mumbai', lat: 19.076, lng: 72.8777, intensity: 1 },
  { city: 'Delhi', lat: 28.6139, lng: 77.209, intensity: 0.95 },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, intensity: 0.9 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, intensity: 0.85 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867, intensity: 0.82 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, intensity: 0.8 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, intensity: 0.76 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, intensity: 0.72 },
] as const satisfies readonly BusinessLocation[];

const INDIA_LONGITUDE_CENTER = 77.2;
const INITIAL_PHI = -(INDIA_LONGITUDE_CENTER * Math.PI) / 180;

// Custom hook to handle hydration
function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return mounted;
}

export default function GlobeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    if (!mounted) return;

    if (canvasRef.current) {
      canvasRef.current.style.opacity = '0';
    }

    let phi = INITIAL_PHI;
    let width = 0;
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    const markers = BUSINESS_LOCATIONS.map((loc) => ({
      // cobe expects [latitude, longitude]
      location: [loc.lat, loc.lng] as [number, number],
      // Smaller markers avoid visual overlap and improve geographic readability
      size: 0.018 + loc.intensity * 0.028,
    }));

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio,
      width: width * devicePixelRatio,
      height: width * devicePixelRatio,
      phi: INITIAL_PHI,
      theta: 0.28,
      dark: isDark ? 1 : 0,
      diffuse: 1.1,
      scale: 1,
      offset: [0, 0] as [number, number],
      // Higher sample count sharpens coastlines and avoids merged-looking landmasses.
      mapSamples: width > 560 ? 36000 : 26000,
      // Push land dots forward while fading ocean/base dots back.
      mapBrightness: isDark ? 7 : 5.2,
      mapBaseBrightness: isDark ? 0.08 : 0.12,
      baseColor: isDark ? [0.24, 0.24, 0.24] as [number, number, number] : [1, 1, 1] as [number, number, number],
      markerColor: [0.1, 0.8, 0.5] as [number, number, number], // Green for BuildBase
      glowColor: isDark ? [0.1, 0.1, 0.1] as [number, number, number] : [0.82, 0.82, 0.82] as [number, number, number],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current / 200;
        state.width = width * devicePixelRatio;
        state.height = width * devicePixelRatio;
      },
    });

    const fadeInTimeout = setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
        setIsLoaded(true);
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
      clearTimeout(fadeInTimeout);
    };
  }, [mounted, isDark]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-white/30 dark:to-black/30 pointer-events-none" />

      {/* Globe Container - centered right */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 size-162.5">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-100 rounded-full bg-green-500/20 blur-[80px]" />
        </div>

        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
              if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
            }}
            onPointerUp={() => {
              pointerInteracting.current = null;
              if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
            }}
            onPointerOut={() => {
              pointerInteracting.current = null;
              if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
            }}
            onMouseMove={(e) => {
              if (pointerInteracting.current !== null) {
                const delta = e.clientX - pointerInteracting.current;
                pointerInteractionMovement.current = delta;
              }
            }}
            onTouchMove={(e) => {
              if (pointerInteracting.current !== null && e.touches[0]) {
                const delta = e.touches[0].clientX - pointerInteracting.current;
                pointerInteractionMovement.current = delta;
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              cursor: 'grab',
              contain: 'layout paint size',
              opacity: 0,
              transition: 'opacity 1s ease',
            }}
          />
        </div>
      </div>

      {/* Content Overlay - left side */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
        <div className={`max-w-2xl ml-8 md:ml-20 space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white leading-[1.1] tracking-tight">
            Build your business
            <br />
            <span className="block mt-1">
              management system
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
            BuildBase helps Indian MSMEs and coaching institutes manage their operations —{' '}
            <span className="font-semibold text-black dark:text-white">no code required</span>.
          </p>

          {/* Tagline */}
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg">
            Modular. Simple. Built for India.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-2 pointer-events-auto">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-xl hover:scale-[1.02]"
            >
              Get started free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold rounded-full transition-all duration-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
            >
              Learn more
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-black dark:text-white">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-black dark:text-white">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Businesses</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">₹299/mo</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Starting at</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
