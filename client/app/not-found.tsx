import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { DotMatrix } from "@/components/ui/dot-matrix"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <DotMatrix />
      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </button>
          </Button>
        </div>
      </div>
    </div>
  )
}
