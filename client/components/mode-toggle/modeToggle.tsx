"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      toast("Theme changed to Dark", "info")
    } else if (theme === "dark") {
      setTheme("system")
      toast("Theme changed to System", "info")
    } else {
      setTheme("light")
      toast("Theme changed to Light", "info")
    }
  }

  // Prevent hydration mismatch by not rendering icons until mounted
  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <span className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      {theme === "light" && (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      {theme === "dark" && (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {theme === "system" && (
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
