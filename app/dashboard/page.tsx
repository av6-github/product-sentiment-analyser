"use client"

import { useState, useEffect } from "react"
import KPICard from "@/components/kpi-card"
import SentimentChart from "@/components/sentiment-chart"
import EmotionChart from "@/components/emotion-chart"
import { TrendingUp, MessageCircle, Heart, AlertCircle, Building2, LogOut } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface KPI {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down"
}

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("lastmonth")
  const [products, setProducts] = useState<any[]>([])
  const [kpis, setKpis] = useState<KPI[]>([])
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getDateThreshold = (period: string) => {
    const now = new Date()
    const d = new Date(now)
    switch (period) {
      case "lastweek":
        d.setDate(now.getDate() - 7)
        break
      case "lastmonth":
        d.setMonth(now.getMonth() - 1)
        break
      case "last3months":
        d.setMonth(now.getMonth() - 3)
        break
      default:
        d.setFullYear(2000)
    }
    return d.toISOString()
  }

  useEffect(() => {
    if (!isClient) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
          router.push("/auth")
          return
        }

        const userId = userData.user.id

        const { data: brandData, error: brandError } = await supabase
          .from('brand')
          .select("*")
          .eq("user_id", userId)
          .single()

        if (brandError || !brandData) throw new Error("Brand not found")
        setBrand(brandData)

        const { data: productsData } = await supabase
          .from('product')
          .select("product_id, product_name")
          .eq("brand_id", brandData.brand_id)

        setProducts(productsData || [])

        await computeKpis(brandData.brand_id, selectedProduct, selectedTimePeriod)
      } catch (err: any) {
        console.error("Dashboard error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isClient, selectedProduct, selectedTimePeriod])

  // ===========================
  //     KPI COMPUTATION
  // ===========================
  const computeKpis = async (brandId: string, productId: string, period: string) => {
    const fromDate = getDateThreshold(period)

    // Step 1: Get products of this brand
    const { data: productData, error: productError } = await supabase
      .from('product')
      .select("product_id")
      .eq("brand_id", brandId)

    if (productError) throw productError

    const allProductIds = productData?.map((p) => p.product_id) || []
    const selectedIds = productId === "all" ? allProductIds : [Number(productId)]

    // Step 2: Get posts linked via POST_PRODUCTS
    const { data: postLinks, error: postLinkError } = await supabase
      .from('post_products')
      .select("post_id, product_id")
      .in("product_id", selectedIds)

    if (postLinkError) throw postLinkError

    const postIds = postLinks?.map((p) => p.post_id) || []
    const totalPosts = postIds.length

    if (totalPosts === 0) {
      setKpis([
        { title: "Total Posts", value: "0", change: "0%", icon: MessageCircle, trend: "down" },
        { title: "Engagement Rate", value: "0%", change: "0%", icon: TrendingUp, trend: "down" },
        { title: "Positive Sentiment", value: "0%", change: "0%", icon: Heart, trend: "down" },
        { title: "Active Alerts", value: "0", change: "0", icon: AlertCircle, trend: "down" },
      ])
      return
    }

    // Step 3: Sentiments
    const { data: sentiments } = await supabase
      .from('sentiment')
      .select("label, post_id")
      .in("post_id", postIds)
      .gte("analysis_timestamp", fromDate)

    const positiveCount = sentiments?.filter((s) => s.label === "positive").length || 0
    const positiveRate = Math.round((positiveCount / totalPosts) * 100)

    // Step 4: Engagement
    const { data: engagements } = await supabase
      .from('engagement')
      .select("likes_count, shares_count, comments_count, post_id")
      .in("post_id", postIds)
      .gte("retrieved_at", fromDate)

    const totalEngagement =
      engagements?.reduce(
        (acc, e) => acc + (e.likes_count || 0) + (e.shares_count || 0) + (e.comments_count || 0),
        0
      ) || 0

    const engagementRate = ((totalEngagement / totalPosts) * 0.01).toFixed(1) + "%"

    // Step 5: Alerts
    const { data: alerts } = await supabase
      .from('alert')
      .select("alert_id, is_resolved, triggered_at, post_id")
      .in("post_id", postIds)
      .gte("triggered_at", fromDate)

    const activeAlerts = alerts?.filter((a) => !a.is_resolved).length || 0

    // Step 6: Assemble KPIs
    const kpiData: KPI[] = [
      {
        title: "Total Posts",
        value: totalPosts.toLocaleString(),
        change: "+5%",
        icon: MessageCircle,
        trend: "up",
      },
      {
        title: "Engagement Rate",
        value: engagementRate,
        change: "+2%",
        icon: TrendingUp,
        trend: "up",
      },
      {
        title: "Positive Sentiment",
        value: `${positiveRate}%`,
        change: "+4%",
        icon: Heart,
        trend: "up",
      },
      {
        title: "Active Alerts",
        value: activeAlerts.toString(),
        change: "-1",
        icon: AlertCircle,
        trend: activeAlerts === 0 ? "up" : "down",
      },
    ]

    setKpis(kpiData)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{brand?.brand_name || "Loading..."}</h1>
            {brand?.website && (
              <a
                href={brand.website.startsWith("http") ? brand.website : `https://${brand.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {brand.website}
              </a>
            )}
          </div>
        </div>

        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Filters */}
      {isClient && (
        <div className="flex items-center gap-4 flex-wrap mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Product:</span>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Product" />
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
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
