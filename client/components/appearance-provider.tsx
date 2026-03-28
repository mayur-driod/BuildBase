"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from "react"

// Appearance settings types
export type AccentColor = "ocean" | "graphite" | "sage" | "violet" | "rose" | "amber" | "teal" | "coral"
export type FontFamily = "geist" | "inter" | "system"
export type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "full"
export type DensityMode = "compact" | "comfortable" | "spacious"

export interface AppearanceSettings {
  fontSize: number
  accentColor: AccentColor
  fontFamily: FontFamily
  borderRadius: BorderRadius
  densityMode: DensityMode
  glassEffects: boolean
  reduceTransparency: boolean
  animationsEnabled: boolean
}

interface AppearanceContextType {
  appearance: AppearanceSettings
  setFontSize: (size: number) => void
  setAccentColor: (color: AccentColor) => void
  setFontFamily: (family: FontFamily) => void
  setBorderRadius: (radius: BorderRadius) => void
  setDensityMode: (mode: DensityMode) => void
  setGlassEffects: (enabled: boolean) => void
  setReduceTransparency: (enabled: boolean) => void
  setAnimationsEnabled: (enabled: boolean) => void
  resetToDefaults: () => void
}

const defaultAppearance: AppearanceSettings = {
  fontSize: 16,
  accentColor: "ocean",
  fontFamily: "geist",
  borderRadius: "md",
  densityMode: "comfortable",
  glassEffects: true,
  reduceTransparency: false,
  animationsEnabled: true,
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined)

// Default values for when the hook is used outside the provider (SSR, pre-rendering)
const defaultContextValue: AppearanceContextType = {
  appearance: defaultAppearance,
  setFontSize: () => {},
  setAccentColor: () => {},
  setFontFamily: () => {},
  setBorderRadius: () => {},
  setDensityMode: () => {},
  setGlassEffects: () => {},
  setReduceTransparency: () => {},
  setAnimationsEnabled: () => {},
  resetToDefaults: () => {},
}

// Accent color CSS variable mappings - Apple-inspired sophisticated palette
// Light mode uses deeper, more muted tones; dark mode uses slightly brighter variants
const accentColorMap: Record<AccentColor, {
  light: { primary: string; primaryForeground: string; ring: string };
  dark: { primary: string; primaryForeground: string; ring: string };
}> = {
  ocean: {
    // Deep professional blue - like Apple's system blue
    light: {
      primary: "oklch(0.45 0.18 250)",
      primaryForeground: "oklch(0.99 0.005 250)",
      ring: "oklch(0.45 0.18 250)",
    },
    dark: {
      primary: "oklch(0.65 0.19 250)",
      primaryForeground: "oklch(0.15 0.02 250)",
      ring: "oklch(0.65 0.19 250)",
    },
  },
  graphite: {
    // Sophisticated slate gray - elegant and neutral
    light: {
      primary: "oklch(0.40 0.02 260)",
      primaryForeground: "oklch(0.99 0.005 260)",
      ring: "oklch(0.40 0.02 260)",
    },
    dark: {
      primary: "oklch(0.65 0.025 260)",
      primaryForeground: "oklch(0.15 0.01 260)",
      ring: "oklch(0.65 0.025 260)",
    },
  },
  sage: {
    // Muted green - calming and natural
    light: {
      primary: "oklch(0.48 0.10 155)",
      primaryForeground: "oklch(0.99 0.005 155)",
      ring: "oklch(0.48 0.10 155)",
    },
    dark: {
      primary: "oklch(0.68 0.12 155)",
      primaryForeground: "oklch(0.15 0.02 155)",
      ring: "oklch(0.68 0.12 155)",
    },
  },
  violet: {
    // Soft purple - elegant and modern
    light: {
      primary: "oklch(0.50 0.16 290)",
      primaryForeground: "oklch(0.99 0.005 290)",
      ring: "oklch(0.50 0.16 290)",
    },
    dark: {
      primary: "oklch(0.70 0.17 290)",
      primaryForeground: "oklch(0.15 0.02 290)",
      ring: "oklch(0.70 0.17 290)",
    },
  },
  rose: {
    // Dusty rose - subtle and sophisticated
    light: {
      primary: "oklch(0.55 0.14 10)",
      primaryForeground: "oklch(0.99 0.005 10)",
      ring: "oklch(0.55 0.14 10)",
    },
    dark: {
      primary: "oklch(0.72 0.15 10)",
      primaryForeground: "oklch(0.15 0.02 10)",
      ring: "oklch(0.72 0.15 10)",
    },
  },
  amber: {
    // Warm gold - inviting and premium
    light: {
      primary: "oklch(0.55 0.14 65)",
      primaryForeground: "oklch(0.15 0.02 65)",
      ring: "oklch(0.55 0.14 65)",
    },
    dark: {
      primary: "oklch(0.75 0.15 75)",
      primaryForeground: "oklch(0.15 0.02 75)",
      ring: "oklch(0.75 0.15 75)",
    },
  },
  teal: {
    // Fresh teal - perfect for water/flood context
    light: {
      primary: "oklch(0.48 0.12 195)",
      primaryForeground: "oklch(0.99 0.005 195)",
      ring: "oklch(0.48 0.12 195)",
    },
    dark: {
      primary: "oklch(0.68 0.13 195)",
      primaryForeground: "oklch(0.15 0.02 195)",
      ring: "oklch(0.68 0.13 195)",
    },
  },
  coral: {
    // Warm coral - energetic but refined
    light: {
      primary: "oklch(0.58 0.16 30)",
      primaryForeground: "oklch(0.99 0.005 30)",
      ring: "oklch(0.58 0.16 30)",
    },
    dark: {
      primary: "oklch(0.72 0.16 30)",
      primaryForeground: "oklch(0.15 0.02 30)",
      ring: "oklch(0.72 0.16 30)",
    },
  },
}

// Border radius mappings
const borderRadiusMap: Record<BorderRadius, string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
}

// Density mode spacing multipliers
const densitySpacingMap: Record<DensityMode, { padding: string; gap: string }> = {
  compact: { padding: "0.75", gap: "0.5" },
  comfortable: { padding: "1", gap: "1" },
  spacious: { padding: "1.25", gap: "1.5" },
}

// Valid accent colors for migration from old values
const validAccentColors: AccentColor[] = ["ocean", "graphite", "sage", "violet", "rose", "amber", "teal", "coral"]

// Helper to load and migrate settings from localStorage
function loadAppearanceSettings(): AppearanceSettings {
  if (typeof window === 'undefined') return defaultAppearance

  const stored = localStorage.getItem("appearance-settings")
  if (!stored) return defaultAppearance

  try {
    const parsed = JSON.parse(stored) as Partial<AppearanceSettings>
    // Migrate old accent colors to new palette
    if (parsed.accentColor && !validAccentColors.includes(parsed.accentColor as AccentColor)) {
      parsed.accentColor = "ocean"
    }
    return { ...defaultAppearance, ...parsed }
  } catch {
    return defaultAppearance
  }
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  // Use useSyncExternalStore for hydration-safe mounted detection
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [appearance, setAppearance] = useState<AppearanceSettings>(loadAppearanceSettings)

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("appearance-settings", JSON.stringify(appearance))
    }
  }, [appearance, mounted])

  // Apply CSS variables to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Font size
    root.style.setProperty("--base-font-size", `${appearance.fontSize}px`)
    root.style.fontSize = `${appearance.fontSize}px`

    // Accent color - detect current theme and apply appropriate variant
    const applyAccentColor = () => {
      const isDark = document.documentElement.classList.contains("dark")
      // Fallback to "ocean" if the stored color doesn't exist (e.g., old localStorage values)
      const accent = accentColorMap[appearance.accentColor] || accentColorMap.ocean
      const colorSet = isDark ? accent.dark : accent.light

      root.style.setProperty("--primary-accent", colorSet.primary)
      root.style.setProperty("--primary-accent-foreground", colorSet.primaryForeground)
      root.style.setProperty("--ring-accent", colorSet.ring)
    }

    applyAccentColor()

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          applyAccentColor()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Border radius
    root.style.setProperty("--radius", borderRadiusMap[appearance.borderRadius])

    // Density mode
    const density = densitySpacingMap[appearance.densityMode]
    root.style.setProperty("--density-padding", density.padding)
    root.style.setProperty("--density-gap", density.gap)

    // Toggle classes on body
    const body = document.body

    // Glass effects
    body.classList.toggle("glass-effects", appearance.glassEffects)
    body.classList.toggle("no-glass", !appearance.glassEffects)

    // Reduce transparency
    body.classList.toggle("reduce-transparency", appearance.reduceTransparency)

    // Animations
    body.classList.toggle("reduce-motion", !appearance.animationsEnabled)

    // Density classes
    body.classList.remove("density-compact", "density-comfortable", "density-spacious")
    body.classList.add(`density-${appearance.densityMode}`)

    // Font family classes
    body.classList.remove("font-geist", "font-inter", "font-system")
    body.classList.add(`font-${appearance.fontFamily}`)

    // Cleanup observer on unmount or when effect re-runs
    return () => {
      if (typeof observer !== 'undefined') {
        observer.disconnect()
      }
    }
  }, [appearance, mounted])

  const setFontSize = useCallback((size: number) => {
    setAppearance((prev) => ({ ...prev, fontSize: Math.min(24, Math.max(12, size)) }))
  }, [])

  const setAccentColor = useCallback((color: AccentColor) => {
    setAppearance((prev) => ({ ...prev, accentColor: color }))
  }, [])

  const setFontFamily = useCallback((family: FontFamily) => {
    setAppearance((prev) => ({ ...prev, fontFamily: family }))
  }, [])

  const setBorderRadius = useCallback((radius: BorderRadius) => {
    setAppearance((prev) => ({ ...prev, borderRadius: radius }))
  }, [])

  const setDensityMode = useCallback((mode: DensityMode) => {
    setAppearance((prev) => ({ ...prev, densityMode: mode }))
  }, [])

  const setGlassEffects = useCallback((enabled: boolean) => {
    setAppearance((prev) => ({ ...prev, glassEffects: enabled }))
  }, [])

  const setReduceTransparency = useCallback((enabled: boolean) => {
    setAppearance((prev) => ({ ...prev, reduceTransparency: enabled }))
  }, [])

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAppearance((prev) => ({ ...prev, animationsEnabled: enabled }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setAppearance(defaultAppearance)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AppearanceContext.Provider
      value={{
        appearance,
        setFontSize,
        setAccentColor,
        setFontFamily,
        setBorderRadius,
        setDensityMode,
        setGlassEffects,
        setReduceTransparency,
        setAnimationsEnabled,
        resetToDefaults,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  // Return default values if used outside provider (e.g., during SSR/pre-rendering)
  if (context === undefined) {
    return defaultContextValue
  }
  return context
}

// Hook to check if appearance is ready (for SSR)
export function useAppearanceMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
