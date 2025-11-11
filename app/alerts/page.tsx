"use client"

import { useState, useEffect } from "react"
import AlertsFeed from "@/components/alerts-feed"
import AIModal from "@/components/ai-mitigation-modal"
import Sidebar from "@/components/sidebar"
import { useDarkMode } from "@/app/client-layout"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Alert {
  id: string
  product: string
  sentiment: string
  volume: number
  status: "active" | "resolved"
  timestamp: string
  resolved?: boolean
  resolutionComment?: string
  severity?: number
  message?: string
}

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isDarkMode, setIsDarkMode } = useDarkMode()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const supabase = createClient()

        const { data: alertsData, error } = await supabase
          .from("ALERT")
          .select(
            `
            alert_id,
            alert_type,
            post_id,
            triggered_at,
            is_resolved,
            alert_severity,
            alert_message,
            resolve_message,
            POST:post_id (
              POST_PRODUCTS (
                PRODUCT:product_id (
                  product_name
                )
              )
            )
          `,
          )
          .order("triggered_at", { ascending: false })

        if (error) throw error

        const formattedAlerts: Alert[] = (alertsData || []).map((alert: any) => {
          const productName = alert.POST?.POST_PRODUCTS?.[0]?.PRODUCT?.product_name || "Unknown Product"
          return {
            id: alert.alert_id.toString(),
            product: productName,
            sentiment: alert.alert_type,
            volume: 0,
            status: alert.is_resolved ? "resolved" : "active",
            timestamp: alert.triggered_at,
            resolved: alert.is_resolved,
            resolutionComment: alert.resolve_message,
            severity: alert.alert_severity / 100,
            message: alert.alert_message,
          }
        })

        setAlerts(formattedAlerts)
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const handleSuggestMitigation = (alert: Alert) => {
    setSelectedAlert(alert)
    setShowModal(true)
  }

  const handleMarkResolved = async (alertId: string, comment: string) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("ALERT")
        .update({
          is_resolved: true,
          resolve_message: comment,
        })
        .eq("alert_id", Number.parseInt(alertId))

      if (error) throw error

      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId
            ? { ...alert, resolved: true, resolutionComment: comment, status: "resolved" as const }
            : alert,
        ),
      )
      setSelectedAlert(null)
    } catch (error) {
      console.error("Error updating alert:", error)
    }
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

        <AIModal
          alert={selectedAlert}
          open={showModal}
          onOpenChange={setShowModal}
          onMarkResolved={handleMarkResolved}
        />
      </div>
    </div>
  )
}
