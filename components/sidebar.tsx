"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, AlertCircle, Home, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  isDarkMode?: boolean
  setIsDarkMode?: (value: boolean) => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/alerts", label: "Alerts", icon: AlertCircle },
]

export default function Sidebar({ open, onToggle, isDarkMode = false, setIsDarkMode }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={`${open ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden md:flex flex-col min-h-screen`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!open && "justify-center w-full"}`}>
            {open && <BarChart3 className="w-6 h-6 text-sidebar-primary" />}
            {open && <span className="font-bold text-lg">SentiTrack</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  } ${!open && "justify-center"}`}
                >
                  <Icon className="w-5 h-5" />
                  {open && <span>{item.label}</span>}
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          {setIsDarkMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full bg-transparent flex items-center gap-2 justify-center"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {open && (isDarkMode ? "Light Mode" : "Dark Mode")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onToggle} className="w-full bg-transparent">
            {open ? "Collapse" : "Expand"}
          </Button>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={onToggle}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </>
  )
}
