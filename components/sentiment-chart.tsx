"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

export default function SentimentChart({ selectedProduct, selectedTimePeriod }: any) {
  const [data, setData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const now = new Date()
        let fromDate = new Date()
        if (selectedTimePeriod === "lastmonth") fromDate.setMonth(now.getMonth() - 1)
        else if (selectedTimePeriod === "last3months") fromDate.setMonth(now.getMonth() - 3)
        else fromDate.setDate(now.getDate() - 7)

        // get brand info from local storage
        const brandInfo = JSON.parse(localStorage.getItem("brandInfo") || "{}")
        if (!brandInfo?.brandId) return

        // Fetch sentiments for posts belonging to this brand + product
        const { data: sentiments, error } = await supabase
          .from("sentiment")
          .select(
            `
            sentiment_id,
            label,
            analysis_timestamp,
            post:post_id (
              post_products!inner (
                product!inner (
                  brand_id,
                  product_id
                )
              )
            )
          `
          )
          .gte("analysis_timestamp", fromDate.toISOString())
          .lte("analysis_timestamp", now.toISOString())

        if (error) throw error

        const filtered = sentiments?.filter(
          (s: any) =>
            s.post?.post_products?.[0]?.product?.brand_id === brandInfo.brandId &&
            (selectedProduct === "all" ||
              s.post?.post_products?.[0]?.product?.product_id === Number(selectedProduct))
        )

        // Group by day + sentiment label
        const grouped: Record<string, Record<string, number>> = {}
        filtered.forEach((s: any) => {
          const day = new Date(s.analysis_timestamp).toLocaleDateString("en-US", {
            weekday: "short",
          })
          const label = s.label?.toLowerCase() || "neutral"
          grouped[day] = grouped[day] || { positive: 0, neutral: 0, negative: 0 }
          grouped[day][label] = (grouped[day][label] || 0) + 1
        })

        const chartData = Object.keys(grouped).map((day) => ({
          day,
          Positive: grouped[day].positive || 0,
          Neutral: grouped[day].neutral || 0,
          Negative: grouped[day].negative || 0,
        }))

        setData(chartData)
      } catch (err) {
        console.error("Error fetching sentiment chart:", err)
      }
    }

    fetchSentiments()
  }, [selectedProduct, selectedTimePeriod])

  return (
    <div className="p-4 bg-card rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Sentiment Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Positive" stroke="#4ade80" />
          <Line type="monotone" dataKey="Neutral" stroke="#60a5fa" />
          <Line type="monotone" dataKey="Negative" stroke="#f87171" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
