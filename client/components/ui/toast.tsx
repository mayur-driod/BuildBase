"use client"

import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const typeConfig: Record<ToastType, { icon: React.ElementType; color: string }> = {
  success: { icon: CheckCircle, color: "text-green-500" },
  error: { icon: XCircle, color: "text-red-500" },
  warning: { icon: AlertTriangle, color: "text-yellow-500" },
  info: { icon: Info, color: "text-blue-500" },
}

function ToastItem({ message, type, onDismiss }: { message: string; type: ToastType; onDismiss: () => void }) {
  const { icon: Icon, color } = typeConfig[type]

  return (
    <div className="animate-in slide-in-from-top-full fade-in duration-300 flex items-center gap-2 rounded-full border border-border bg-card pl-3 pr-2.5 py-2 text-card-foreground shadow-lg backdrop-blur-sm">
      <Icon className={`h-4 w-4 ${color}`} />
      <p className="text-xs font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  )
}
