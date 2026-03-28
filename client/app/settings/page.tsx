"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { DotMatrix } from "@/components/ui/dot-matrix"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  useAppearance,
  type AccentColor,
  type FontFamily,
  type BorderRadius,
  type DensityMode,
} from "@/components/appearance-provider"
import {
  Palette,
  Bell,
  Shield,
  MapPin,
  Accessibility,
  Database,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Loader2,
  Download,
  Trash2,
  ExternalLink,
  Mail,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  FileText,
  MessageSquare,
  Languages,
  Type,
  Sparkles,
  RotateCcw,
  Layers,
  Maximize2,
  Minimize2,
  Move,
} from "lucide-react"

type SettingsSection =
  | "appearance"
  | "language"
  | "notifications"
  | "privacy"
  | "location"
  | "accessibility"
  | "data"
  | "help"

const settingsNavItems = [
  { id: "appearance" as const, label: "Appearance", icon: Palette },
  { id: "language" as const, label: "Language & Region", icon: Languages },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "privacy" as const, label: "Privacy & Security", icon: Shield },
  { id: "location" as const, label: "Location & Maps", icon: MapPin },
  { id: "accessibility" as const, label: "Accessibility", icon: Accessibility },
  { id: "data" as const, label: "Data & Storage", icon: Database },
  { id: "help" as const, label: "Help & Support", icon: HelpCircle },
]

const accentColors: { id: AccentColor; lightColor: string; darkColor: string; label: string }[] = [
  { id: "ocean", lightColor: "#2563eb", darkColor: "#60a5fa", label: "Ocean" },
  { id: "graphite", lightColor: "#4b5563", darkColor: "#9ca3af", label: "Graphite" },
  { id: "sage", lightColor: "#059669", darkColor: "#34d399", label: "Sage" },
  { id: "violet", lightColor: "#7c3aed", darkColor: "#a78bfa", label: "Violet" },
  { id: "rose", lightColor: "#db2777", darkColor: "#f472b6", label: "Rose" },
  { id: "amber", lightColor: "#b45309", darkColor: "#fbbf24", label: "Amber" },
  { id: "teal", lightColor: "#0d9488", darkColor: "#2dd4bf", label: "Teal" },
  { id: "coral", lightColor: "#ea580c", darkColor: "#fb923c", label: "Coral" },
]

const fontFamilies: { id: FontFamily; label: string; preview: string }[] = [
  { id: "geist", label: "Geist Sans", preview: "Modern & Clean" },
  { id: "inter", label: "Inter", preview: "Professional" },
  { id: "system", label: "System Default", preview: "Native Look" },
]

const borderRadiusOptions: { id: BorderRadius; label: string }[] = [
  { id: "none", label: "Sharp" },
  { id: "sm", label: "Subtle" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Rounded" },
  { id: "xl", label: "Extra" },
  { id: "full", label: "Pill" },
]

const densityModes: { id: DensityMode; label: string; description: string; icon: React.ElementType }[] = [
  { id: "compact", label: "Compact", description: "Dense UI, more content", icon: Minimize2 },
  { id: "comfortable", label: "Comfortable", description: "Balanced spacing", icon: Move },
  { id: "spacious", label: "Spacious", description: "Relaxed layout", icon: Maximize2 },
]

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const {
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
  } = useAppearance()

  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance")
  const [isLoading, setIsLoading] = useState(false)

  // Language settings
  const [language, setLanguage] = useState("en")
  const [region, setRegion] = useState("us")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [units, setUnits] = useState("imperial")

  // Notification settings
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    sound: true,
    floodAlerts: true,
    weatherUpdates: true,
    communityReports: true,
    weeklyDigest: false,
    marketing: false,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showLocation: false,
    showActivity: true,
    allowAnalytics: true,
    personalizedAds: false,
  })

  // Location settings
  const [locationState, setLocationState] = useState({
    autoDetect: true,
    defaultCity: "",
    mapStyle: "standard",
    showFloodZones: true,
    showSatellite: false,
  })

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/settings")
    }
  }, [status, router])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast("Settings saved successfully", "success")
    } catch {
      toast("Failed to save settings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast("Your data export has been initiated. You'll receive an email when it's ready.", "success")
    } catch {
      toast("Failed to export data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast("Cache cleared successfully", "success")
    } catch {
      toast("Failed to clear cache", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetAppearance = () => {
    resetToDefaults()
    setTheme("system")
    toast("Appearance reset to defaults", "success")
  }

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotMatrix />
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "appearance":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how FloodWatch looks on your device
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAppearance}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>

            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>Select your preferred color theme</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={theme}
                  onValueChange={setTheme}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Monitor className="mb-3 h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Accent Color */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Accent Color</CardTitle>
                <CardDescription>Choose your preferred accent color for buttons and highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`group relative h-10 w-10 rounded-full transition-all hover:scale-110 ${
                        appearance.accentColor === c.id 
                          ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" 
                          : ""
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${c.lightColor} 0%, ${c.darkColor} 100%)`
                      }}
                      title={c.label}
                    >
                      {appearance.accentColor === c.id && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Current: <span className="font-medium capitalize">{appearance.accentColor}</span>
                </p>
              </CardContent>
            </Card>

            {/* Font Size */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Font Size</CardTitle>
                <CardDescription>Adjust the base font size for better readability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Type className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Slider
                    value={[appearance.fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={12}
                    max={24}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{appearance.fontSize}px</span>
                </div>
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-muted-foreground" style={{ fontSize: `${appearance.fontSize}px` }}>
                    Preview: This is how text will appear throughout the application.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Font Family */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Font Family</CardTitle>
                <CardDescription>Choose your preferred font style</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={appearance.fontFamily}
                  onValueChange={(value) => setFontFamily(value as FontFamily)}
                  className="grid gap-3"
                >
                  {fontFamilies.map((font) => (
                    <div key={font.id}>
                      <RadioGroupItem value={font.id} id={`font-${font.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`font-${font.id}`}
                        className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <div>
                          <span className="font-medium">{font.label}</span>
                          <p className="text-xs text-muted-foreground">{font.preview}</p>
                        </div>
                        {appearance.fontFamily === font.id && (
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Border Radius */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Border Radius</CardTitle>
                <CardDescription>Adjust the roundness of UI elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {borderRadiusOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setBorderRadius(option.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        appearance.borderRadius === option.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30 hover:bg-accent"
                      }`}
                    >
                      <div 
                        className="h-8 w-8 bg-foreground/80 transition-all"
                        style={{
                          borderRadius: option.id === "none" ? "0" :
                                        option.id === "sm" ? "4px" :
                                        option.id === "md" ? "8px" :
                                        option.id === "lg" ? "12px" :
                                        option.id === "xl" ? "16px" : "9999px"
                        }}
                      />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Density Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interface Density</CardTitle>
                <CardDescription>Adjust spacing and padding throughout the interface</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={appearance.densityMode}
                  onValueChange={(value) => setDensityMode(value as DensityMode)}
                  className="grid gap-3"
                >
                  {densityModes.map((mode) => (
                    <div key={mode.id}>
                      <RadioGroupItem value={mode.id} id={`density-${mode.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`density-${mode.id}`}
                        className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <mode.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <span className="font-medium">{mode.label}</span>
                          <p className="text-xs text-muted-foreground">{mode.description}</p>
                        </div>
                        {appearance.densityMode === mode.id && (
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Visual Effects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visual Effects</CardTitle>
                <CardDescription>Control transparency and animation effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      Glass Effects
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable frosted glass blur effects on backgrounds
                    </p>
                  </div>
                  <Switch
                    checked={appearance.glassEffects}
                    onCheckedChange={setGlassEffects}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      Reduce Transparency
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Use solid backgrounds instead of transparent ones
                    </p>
                  </div>
                  <Switch
                    checked={appearance.reduceTransparency}
                    onCheckedChange={setReduceTransparency}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-muted-foreground" />
                      Animations
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch
                    checked={appearance.animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
                <CardDescription>See how your settings will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`rounded-lg border p-4 space-y-4 ${
                  appearance.glassEffects && !appearance.reduceTransparency 
                    ? "glass-card" 
                    : "bg-muted/30"
                }`}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: `var(--primary-accent)` }}
                    >
                      FW
                    </div>
                    <div>
                      <p className="font-medium" style={{ fontSize: `${appearance.fontSize}px` }}>FloodWatch User</p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">
                      Primary Button
                    </Button>
                    <Button size="sm" variant="outline">
                      Secondary
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "language":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Language & Region</h2>
              <p className="text-sm text-muted-foreground">
                Set your language and regional preferences
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Language</CardTitle>
                <CardDescription>Select your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Region</CardTitle>
                <CardDescription>Set your regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Country/Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                        <SelectItem value="24h">24-hour (13:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Measurement Units</Label>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (ft, mi, °F)</SelectItem>
                        <SelectItem value="metric">Metric (m, km, °C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Manage how you receive notifications
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Channels</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      Push Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      SMS Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive text message alerts</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                  </div>
                  <Switch
                    checked={notifications.sound}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sound: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Types</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Flood Alerts</Label>
                  <Switch
                    checked={notifications.floodAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, floodAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Weather Updates</Label>
                  <Switch
                    checked={notifications.weatherUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weatherUpdates: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Community Reports</Label>
                  <Switch
                    checked={notifications.communityReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, communityReports: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Weekly Digest</Label>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Marketing & Promotions</Label>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Privacy & Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your privacy settings and account security
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Privacy</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-xs text-muted-foreground">Allow others to see your profile</p>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, profilePublic: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Location</Label>
                    <p className="text-xs text-muted-foreground">Display your location on your profile</p>
                  </div>
                  <Switch
                    checked={privacy.showLocation}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showLocation: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Activity</Label>
                    <p className="text-xs text-muted-foreground">Display your recent activity</p>
                  </div>
                  <Switch
                    checked={privacy.showActivity}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showActivity: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data & Analytics</CardTitle>
                <CardDescription>Control how your data is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Allow Analytics</Label>
                  <Switch
                    checked={privacy.allowAnalytics}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowAnalytics: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Personalized Ads</Label>
                  <Switch
                    checked={privacy.personalizedAds}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, personalizedAds: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/profile?tab=security"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Change Password</p>
                      <p className="text-xs text-muted-foreground">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/profile?tab=security"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case "location":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Location & Maps</h2>
              <p className="text-sm text-muted-foreground">Configure location and map preferences</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location Settings</CardTitle>
                <CardDescription>Manage how your location is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-detect Location</Label>
                  <Switch
                    checked={locationState.autoDetect}
                    onCheckedChange={(checked) => setLocationState({ ...locationState, autoDetect: checked })}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Default City</Label>
                  <input
                    type="text"
                    value={locationState.defaultCity}
                    onChange={(e) => setLocationState({ ...locationState, defaultCity: e.target.value })}
                    placeholder="Enter your city"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Map Preferences</CardTitle>
                <CardDescription>Customize your map experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Map Style</Label>
                  <Select value={locationState.mapStyle} onValueChange={(value) => setLocationState({ ...locationState, mapStyle: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Show Flood Zones</Label>
                  <Switch
                    checked={locationState.showFloodZones}
                    onCheckedChange={(checked) => setLocationState({ ...locationState, showFloodZones: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Satellite Overlay</Label>
                  <Switch
                    checked={locationState.showSatellite}
                    onCheckedChange={(checked) => setLocationState({ ...locationState, showSatellite: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "accessibility":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Accessibility</h2>
              <p className="text-sm text-muted-foreground">Make FloodWatch easier to use</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visual Accessibility</CardTitle>
                <CardDescription>Settings are synced with Appearance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduce Motion</Label>
                    <p className="text-xs text-muted-foreground">Minimize animations and motion effects</p>
                  </div>
                  <Switch
                    checked={!appearance.animationsEnabled}
                    onCheckedChange={(checked) => setAnimationsEnabled(!checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduce Transparency</Label>
                    <p className="text-xs text-muted-foreground">Use solid backgrounds for better visibility</p>
                  </div>
                  <Switch
                    checked={appearance.reduceTransparency}
                    onCheckedChange={setReduceTransparency}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Larger Text</Label>
                    <p className="text-xs text-muted-foreground">Use larger font sizes (adjust in Appearance)</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveSection("appearance")}>
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Navigation</CardTitle>
                <CardDescription>Keyboard and screen reader support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Keyboard Navigation</Label>
                    <p className="text-xs text-muted-foreground">Enhanced keyboard controls</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Screen Reader Support</Label>
                    <p className="text-xs text-muted-foreground">Optimized for screen readers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Data & Storage</h2>
              <p className="text-sm text-muted-foreground">Manage your data and storage preferences</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Data</CardTitle>
                <CardDescription>Download or manage your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={handleExportData}
                  disabled={isLoading}
                  className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Export Data</p>
                      <p className="text-xs text-muted-foreground">Download all your data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={handleClearCache}
                  disabled={isLoading}
                  className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Clear Cache</p>
                      <p className="text-xs text-muted-foreground">Free up storage space</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/profile?tab=privacy"
                  className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently delete your account</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-destructive" />
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case "help":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Help & Support</h2>
              <p className="text-sm text-muted-foreground">Get help and learn more about FloodWatch</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Support</CardTitle>
                <CardDescription>Get help when you need it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://help.floodwatch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Help Center</p>
                      <p className="text-xs text-muted-foreground">Browse FAQs and guides</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="mailto:support@floodwatch.com"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contact Support</p>
                      <p className="text-xs text-muted-foreground">Get in touch with our team</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="https://status.floodwatch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">System Status</p>
                      <p className="text-xs text-muted-foreground">Check service availability</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Legal</CardTitle>
                <CardDescription>Terms, policies, and legal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/terms" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Terms of Service</p>
                      <p className="text-xs text-muted-foreground">Read our terms</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
                <a href="/privacy-policy" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Privacy Policy</p>
                      <p className="text-xs text-muted-foreground">How we handle your data</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About</CardTitle>
                <CardDescription>Information about FloodWatch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">FloodWatch</p>
                    <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                    <p className="text-xs text-muted-foreground">© 2025 FloodWatch Inc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <DotMatrix />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-64 shrink-0">
            <Card>
              <CardContent className="p-2">
                {settingsNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </CardContent>
            </Card>
          </nav>

          <main className="flex-1 min-w-0">
            {renderSection()}

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
