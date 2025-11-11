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
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1️⃣ Get current logged-in user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
          setError("Please log in to view alerts.")
          return
        }
        const userId = userData.user.id

        // 2️⃣ Find this user's brand
        const { data: brandData, error: brandError } = await supabase
          .from("brand")
          .select("brand_id")
          .eq("user_id", userId)
          .single()

        if (brandError || !brandData) {
          setError("No brand linked to this account.")
          return
        }

        const brandId = brandData.brand_id

        // 3️⃣ Fetch all product IDs for this brand
        const { data: productData, error: productError } = await supabase
          .from("product")
          .select("product_id")
          .eq("brand_id", brandId)

        if (productError || !productData) {
          setError("No products found for this brand.")
          return
        }

        const productIds = productData.map((p) => p.product_id)
        if (productIds.length === 0) {
          setAlerts([])
          return
        }

        // 4️⃣ Fetch alerts for posts linked to those products
        const { data: alertsData, error: alertsError } = await supabase
          .from("alert")
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
            post:post_id (
              post_products (
                product:product_id (
                  product_id,
                  product_name
                )
              )
            )
          `
          )
          .order("triggered_at", { ascending: false })

        if (alertsError) throw alertsError

        // 5️⃣ Filter alerts by brand’s product IDs
        const filteredAlerts = (alertsData || []).filter((alert: any) => {
          const prodId = alert.post?.post_products?.[0]?.product?.product_id
          return productIds.includes(prodId)
        })

        // 6️⃣ Format alerts for UI
        const formattedAlerts: Alert[] = filteredAlerts.map((alert: any) => {
          const productName = alert.post?.post_products?.[0]?.product?.product_name || "Unknown Product"
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
        setError("Error loading alerts.")
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
      const { error } = await supabase
        .from("alert")
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
            : alert
        )
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

        {loading ? (
          <p>Loading alerts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="text-muted-foreground">No alerts found for your brand.</p>
        ) : (
          <AlertsFeed alerts={alerts} onSuggestMitigation={handleSuggestMitigation} />
        )}

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
