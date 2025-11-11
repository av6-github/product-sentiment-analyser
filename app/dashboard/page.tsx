"use client"

import { useState } from "react"
import KPICard from "@/components/kpi-card"
import SentimentChart from "@/components/sentiment-chart"
import EmotionChart from "@/components/emotion-chart"
import { TrendingUp, MessageCircle, Heart, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("lastweek")

  const productKPIs: Record<string, any[]> = {
    all: [
      {
        title: "Total Posts",
        value: "12,584",
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
        value: "73%",
        change: "+5.1%",
        icon: Heart,
        trend: "up",
      },
      {
        title: "Active Alerts",
        value: "3",
        change: "-1",
        icon: AlertCircle,
        trend: "down",
      },
    ],
    ecophone: [
      {
        title: "Total Posts",
        value: "4,230",
        change: "+8.2%",
        icon: MessageCircle,
        trend: "up",
      },
      {
        title: "Engagement Rate",
        value: "9.1%",
        change: "+3.2%",
        icon: TrendingUp,
        trend: "up",
      },
      {
        title: "Positive Sentiment",
        value: "68%",
        change: "-2.1%",
        icon: Heart,
        trend: "down",
      },
      {
        title: "Active Alerts",
        value: "2",
        change: "+1",
        icon: AlertCircle,
        trend: "up",
      },
    ],
    smartwatch: [
      {
        title: "Total Posts",
        value: "5,892",
        change: "+15.3%",
        icon: MessageCircle,
        trend: "up",
      },
      {
        title: "Engagement Rate",
        value: "10.5%",
        change: "+4.1%",
        icon: TrendingUp,
        trend: "up",
      },
      {
        title: "Positive Sentiment",
        value: "81%",
        change: "+8.2%",
        icon: Heart,
        trend: "up",
      },
      {
        title: "Active Alerts",
        value: "1",
        change: "-2",
        icon: AlertCircle,
        trend: "down",
      },
    ],
    cloudsync: [
      {
        title: "Total Posts",
        value: "2,462",
        change: "+5.7%",
        icon: MessageCircle,
        trend: "up",
      },
      {
        title: "Engagement Rate",
        value: "6.8%",
        change: "+1.2%",
        icon: TrendingUp,
        trend: "up",
      },
      {
        title: "Positive Sentiment",
        value: "72%",
        change: "+3.5%",
        icon: Heart,
        trend: "up",
      },
      {
        title: "Active Alerts",
        value: "0",
        change: "0",
        icon: AlertCircle,
        trend: "down",
      },
    ],
  }

  const getAdjustedKPIs = () => {
    const kpis = productKPIs[selectedProduct] || productKPIs.all

    // Adjust values based on time period
    if (selectedTimePeriod === "lastmonth") {
      return kpis.map((kpi) => ({
        ...kpi,
        value:
          typeof kpi.value === "string" && kpi.value.includes("%") ? Number.parseInt(kpi.value) + 3 + "%" : kpi.value,
      }))
    } else if (selectedTimePeriod === "last3months") {
      return kpis.map((kpi) => ({
        ...kpi,
        value:
          typeof kpi.value === "string" && kpi.value.includes("%") ? Number.parseInt(kpi.value) + 6 + "%" : kpi.value,
      }))
    }

    return kpis
  }

  const kpis = getAdjustedKPIs()

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
                <SelectItem value="ecophone">EcoPhone X</SelectItem>
                <SelectItem value="smartwatch">SmartWatch Pro</SelectItem>
                <SelectItem value="cloudsync">CloudSync</SelectItem>
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
