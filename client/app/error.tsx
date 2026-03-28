"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DotMatrix } from "@/components/ui/dot-matrix"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <DotMatrix />
      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
