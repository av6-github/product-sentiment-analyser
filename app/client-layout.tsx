"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { useState } from "react"
import { useEffect } from "react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <DarkModeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
          {children}
        </DarkModeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import { createContext, useContext } from "react"

const DarkModeContext = createContext<{
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
} | null>(null)

function DarkModeProvider({
  children,
  isDarkMode,
  setIsDarkMode,
}: {
  children: React.ReactNode
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}) {
  return <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>{children}</DarkModeContext.Provider>
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}
