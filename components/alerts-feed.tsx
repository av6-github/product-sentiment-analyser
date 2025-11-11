"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Alert {
  id: string
  product: string
  sentiment: string
  volume: number
  status: "active" | "resolved"
  timestamp: string
  severity?: number
  message?: string
}

interface AlertsFeedProps {
  alerts: Alert[]
  onSuggestMitigation: (alert: Alert) => void
}

export default function AlertsFeed({ alerts, onSuggestMitigation }: AlertsFeedProps) {
  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return "bg-red-100 text-red-700"
    if (severity >= 0.6) return "bg-orange-100 text-orange-700"
    if (severity >= 0.4) return "bg-yellow-100 text-yellow-700"
    return "bg-blue-100 text-blue-700"
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {alert.status === "active" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  <h3 className="font-semibold text-lg">{alert.product}</h3>
                  <Badge variant={alert.status === "active" ? "default" : "secondary"}>
                    {alert.status === "active" ? "Active" : "Resolved"}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-2">{alert.sentiment}</p>
                {alert.message && <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>}

                {alert.severity !== undefined && (
                  <div className="mb-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      Severity: {(alert.severity * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{alert.volume.toLocaleString()} mentions</span>
                  <span className="text-muted-foreground">{getTimeAgo(alert.timestamp)}</span>
                </div>
              </div>

              {alert.status === "active" && (
                <Button onClick={() => onSuggestMitigation(alert)} className="whitespace-nowrap">
                  Suggest Mitigation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
