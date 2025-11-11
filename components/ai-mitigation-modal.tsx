"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  product: string
  sentiment: string
  volume: number
  status: "active" | "resolved"
  timestamp: string
}

interface AIModalProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AIModal({ alert, open, onOpenChange }: AIModalProps) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    if (open && alert) {
      setLoading(true)
      setRecommendations([])
      // Simulate AI generation with delay
      setTimeout(() => {
        setRecommendations([
          `Launch a social media campaign addressing "${alert.sentiment}" with customer testimonials`,
          `Create a FAQ post addressing the top ${alert.volume} mentions from recent discussions`,
          "Email existing customers with troubleshooting guide or product update announcement",
          "Engage directly with top influencers discussing this topic to shape narrative",
        ])
        setLoading(false)
      }, 2000)
    }
  }, [open, alert])

  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle>AI Mitigation Strategy</DialogTitle>
            <DialogDescription>Recommended actions for {alert.product}</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0 flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-4">
          <Card>
            <CardContent className="pt-6">
              <p className="font-semibold">{alert.sentiment}</p>
              <p className="text-sm text-muted-foreground mt-1">{alert.volume.toLocaleString()} mentions detected</p>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Generating recommendations...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      <p>{rec}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
