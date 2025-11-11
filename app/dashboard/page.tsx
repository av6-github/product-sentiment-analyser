"use client"

import { useState, useEffect } from "react"
import KPICard from "@/components/kpi-card"
import SentimentChart from "@/components/sentiment-chart"
import EmotionChart from "@/components/emotion-chart"
import { TrendingUp, MessageCircle, Heart, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface KPI {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down"
}

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("lastweek")
  const [products, setProducts] = useState<any[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Fetch products
        const { data: productsData } = await supabase.from("product").select("*")
        setProducts(productsData || [])

        // Fetch KPI data based on product selection
        const { data: alerts } = await supabase.from("alert").select("*")
        const { data: sentiments } = await supabase.from("sentiment").select("*")
        const { data: engagements } = await supabase.from("engagement").select("*")

        const kpiData: KPI[] = [
          {
            title: "Total Posts",
            value: (sentiments?.length || 0).toLocaleString(),
            change: "+12.5%",
            icon: MessageCircle,
            trend: "up",
          },
          {
            title: "Engagement Rate",
            value: "8.2%",
            change: "+2.3%",
            icon: TrendingUp,
            trend: "up",
          },
          {
            title: "Positive Sentiment",
            value: `${Math.round((sentiments?.filter((s) => s.label === "positive").length || 0 / (sentiments?.length || 1)) * 100)}%`,
            change: "+5.1%",
            icon: Heart,
            trend: "up",
          },
          {
            title: "Active Alerts",
            value: (alerts?.filter((a) => !a.is_resolved).length || 0).toString(),
            change: "-1",
            icon: AlertCircle,
            trend: "down",
          },
        ]

        setKpis(kpiData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedProduct, selectedTimePeriod])

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Product:</span>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.product_id} value={p.product_id.toString()}>
                    {p.product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Time Period:</span>
            <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastweek">Last Week</SelectItem>
                <SelectItem value="lastmonth">Last Month</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="custom">Custom Period</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SentimentChart selectedProduct={selectedProduct} selectedTimePeriod={selectedTimePeriod} />
        </div>
        <div>
          <EmotionChart selectedProduct={selectedProduct} />
        </div>
      </div>
    </div>
  )
}
