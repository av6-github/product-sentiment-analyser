"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Lightbulb, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GoogleGenerativeAI } from "@google/generative-ai"

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

interface AIModalProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarkResolved?: (alertId: string, comment: string) => void
}

// 🔹 Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export default function AIModal({ alert, open, onOpenChange, onMarkResolved }: AIModalProps) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isMarking, setIsMarking] = useState(false)
  const [resolutionComment, setResolutionComment] = useState("")

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!alert) return
      setLoading(true)
      setRecommendations([])

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
        const prompt = `
          You are a social media brand reputation assistant.
          A brand has received a sentiment alert.

          Product: ${alert.product}
          Sentiment type: ${alert.sentiment}
          Alert message: ${alert.message || "No additional message"}
          Mentions detected: ${alert.volume}

          Suggest 3–4 short, actionable recommendations
          to mitigate this issue or improve public sentiment.
          Output only bullet points or short actionable lines.
        `
        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        // Split Gemini's text output into actionable lines
        const recs = responseText
          .split(/\n+/)
          .map((r) => r.replace(/^[-*•\d.]\s*/, "").trim())
          .filter((r) => r.length > 0)

        setRecommendations(recs.slice(0, 4)) // Limit to top 4
      } catch (err) {
        console.error("Gemini Error:", err)
        setRecommendations([
          "Acknowledge customer feedback with an empathetic social media post.",
          "Engage key influencers to share positive experiences.",
          "Address customer concerns directly in replies.",
          "Publish an update or fix announcement to rebuild trust.",
        ])
      } finally {
        setLoading(false)
      }
    }

    if (open && alert && !alert.resolved) {
      fetchRecommendations()
    }
  }, [open, alert])

  const handleMarkAsResolved = () => {
    if (alert && resolutionComment.trim()) {
      setIsMarking(true)
      setTimeout(() => {
        onMarkResolved?.(alert.id, resolutionComment)
        setIsMarking(false)
        onOpenChange(false)
      }, 1000)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return "bg-red-100 text-red-700"
    if (severity >= 0.6) return "bg-orange-100 text-orange-700"
    if (severity >= 0.4) return "bg-yellow-100 text-yellow-700"
    return "bg-blue-100 text-blue-700"
  }

  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle>AI-Powered Alert Management</DialogTitle>
            <DialogDescription>
              {alert.status === "active"
                ? "View Gemini-generated recommendations or mark as resolved"
                : "View resolved alert details"}
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                {alert.status === "active" || !alert.resolved ? (
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">!</span>
                  </div>
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{alert.sentiment}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alert.volume.toLocaleString()} mentions detected
                  </p>
                </div>
              </div>

              {alert.severity !== undefined && (
                <div className="mb-3">
                  <Badge className={getSeverityColor(alert.severity)}>
                    Severity: {(alert.severity * 100).toFixed(0)}%
                  </Badge>
                </div>
              )}

              {alert.message && (
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              )}
            </CardContent>
          </Card>

          {!alert.resolved && loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Asking Gemini for recommendations...
              </span>
            </div>
          )}

          {!alert.resolved && !loading && recommendations.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">AI Recommended Actions</h3>
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

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-sm">Mark as Resolved</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    How was this alert resolved?
                  </label>
                  <Textarea
                    placeholder="Describe how you resolved this sentiment issue..."
                    value={resolutionComment}
                    onChange={(e) => setResolutionComment(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <Button
                  onClick={handleMarkAsResolved}
                  disabled={!resolutionComment.trim() || isMarking}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isMarking ? "Marking..." : "Mark as Resolved"}
                </Button>
              </div>
            </>
          )}

          {alert.resolved && alert.resolutionComment && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">Resolved</p>
                    <p className="text-sm text-green-800 mt-2">
                      {alert.resolutionComment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
