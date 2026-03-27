"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { useAppearance } from "@/components/appearance-provider"

export default function Home() {
  const { toast } = useToast()
  const { appearance, setAccentColor, setDensityMode, setGlassEffects } = useAppearance()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <main className="flex flex-col items-center gap-8 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to BuildBase
          </h1>
          <p className="text-lg text-muted-foreground">
            Your starter template with theme, appearance customization, and toast notifications
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="p-6 rounded-lg border bg-card text-card-foreground space-y-4">
            <h2 className="text-xl font-semibold">Features Included</h2>
            <ul className="space-y-2 text-sm">
              <li>✓ Theme Provider (Light/Dark mode support)</li>
              <li>✓ Appearance Provider (Customizable colors, fonts, density)</li>
              <li>✓ Toast Notifications</li>
              <li>✓ Professional color system with OKLCH</li>
              <li>✓ Glass effects and animations</li>
              <li>✓ Responsive design utilities</li>
            </ul>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground space-y-4">
            <h2 className="text-xl font-semibold">Quick Demo</h2>
            <div className="space-y-2">
              <Button
                onClick={() => toast("Success! The template is working.", "success")}
                className="w-full"
              >
                Show Success Toast
              </Button>
              <Button
                onClick={() => toast("This is an info message", "info")}
                variant="outline"
                className="w-full"
              >
                Show Info Toast
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground space-y-4">
            <h2 className="text-xl font-semibold">Appearance Settings</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Accent Colors</p>
                <div className="flex gap-2 flex-wrap">
                  {(['ocean', 'graphite', 'sage', 'violet', 'rose', 'amber', 'teal', 'coral'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        appearance.accentColor === color
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Density Mode</p>
                <div className="flex gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDensityMode(mode)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        appearance.densityMode === mode
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Glass Effects</p>
                <button
                  onClick={() => setGlassEffects(!appearance.glassEffects)}
                  className="px-3 py-1 text-xs rounded-full border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {appearance.glassEffects ? 'Disable' : 'Enable'} Glass Effects
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Start building by editing <code className="px-2 py-1 bg-muted rounded">app/page.tsx</code></p>
          </div>
        </div>
      </main>
    </div>
  );
}
