"use client"

import { useState } from "react"
import AlertsFeed from "@/components/alerts-feed"
import AIModal from "@/components/ai-mitigation-modal"
import Sidebar from "@/components/sidebar"
import { useDarkMode } from "@/app/client-layout"
import { AlertCircle } from "lucide-react"

interface Alert {
  id: string
  product: string
  sentiment: string
  volume: number
  status: "active" | "resolved"
  timestamp: string
}

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDarkMode, setIsDarkMode } = useDarkMode()
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      product: "EcoPhone X",
      sentiment: "Battery life concerns growing",
      volume: 523,
      status: "active",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      product: "SmartWatch Pro",
      sentiment: "Users love the new interface",
      volume: 1203,
      status: "active",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      product: "CloudSync",
      sentiment: "Pricing concerns addressed",
      volume: 324,
      status: "resolved",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleSuggestMitigation = (alert: Alert) => {
    setSelectedAlert(alert)
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <div className="flex-1 p-8 space-y-8">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Sentiment Alerts</h1>
        </div>

        <AlertsFeed alerts={alerts} onSuggestMitigation={handleSuggestMitigation} />

        <AIModal alert={selectedAlert} open={showModal} onOpenChange={setShowModal} />
      </div>
    </div>
  )
}
