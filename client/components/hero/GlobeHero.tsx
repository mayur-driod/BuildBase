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
  const [refreshKey, setRefreshKey] = useState(0);
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    const refreshGlobe = () => {
      setRefreshKey((prev) => prev + 1);
    };

    const handlePageShow = () => {
      // Always refresh on page show; browser behavior differs across navigation types.
      refreshGlobe();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshGlobe();
      }
    };

    const handleFocus = () => {
      refreshGlobe();
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.opacity = '1';

    let phi = INITIAL_PHI;
    let width = Math.max(canvas.getBoundingClientRect().width || 0, 320);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const onResize = () => {
      const nextWidth = canvasRef.current?.getBoundingClientRect().width || 0;
      width = Math.max(nextWidth, 320);
    };
    window.addEventListener('resize', onResize);
    onResize();

    const markers = BUSINESS_LOCATIONS.map((loc) => ({
      // cobe expects [latitude, longitude]
      location: [loc.lat, loc.lng] as [number, number],
      // Smaller markers avoid visual overlap and improve geographic readability
      size: 0.018 + loc.intensity * 0.028,
    }));

    // Delay initialization by one frame so layout is stable after browser back/forward restores.
    frame = requestAnimationFrame(() => {
      onResize();
    });

    const globe = createGlobe(canvas, {
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

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [mounted, isDark, refreshKey]);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-transparent md:h-screen">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />

      {/* Bottom blend to avoid hard section edge while scrolling */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-transparent" />

      {/* Globe Container - centered right */}
      <div className="absolute right-1/2 top-[34%] h-[320px] w-[320px] translate-x-1/2 -translate-y-1/2 sm:h-[380px] sm:w-[380px] md:right-[8%] md:top-1/2 md:h-[650px] md:w-[650px] md:translate-x-0">
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
            key={refreshKey}
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
              opacity: 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Content Overlay - left side */}
      <div className="absolute inset-0 flex items-end justify-start pb-8 md:items-center md:pb-0 pointer-events-none">
        <div className="mx-6 max-w-xl space-y-5 text-center transition-all duration-700 opacity-100 translate-x-0 sm:mx-8 md:ml-20 md:mr-0 md:max-w-2xl md:space-y-6 md:text-left">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black dark:text-white leading-[1.1] tracking-tight">
            Build your business
            <br />
            <span className="block mt-1">
              management system
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-xl text-base sm:text-lg md:mx-0 md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            BuildBase helps Indian MSMEs and coaching institutes manage their operations —{' '}
            <span className="font-semibold text-black dark:text-white">no code required</span>.
          </p>

          {/* Tagline */}
          <p className="mx-auto max-w-lg text-sm sm:text-base text-gray-600 dark:text-gray-400 md:mx-0">
            Modular. Simple. Built for India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-3 pt-1 pointer-events-auto sm:flex-row sm:justify-center sm:gap-4 md:justify-start md:pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-xl hover:scale-[1.02]"
            >
              Get started free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold rounded-full transition-all duration-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
            >
              Learn more
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 text-center md:flex md:gap-8 md:pt-4 md:text-left">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Businesses</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">₹299/mo</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Starting at</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
