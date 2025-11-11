"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

const COLORS = ["#f87171", "#34d399", "#60a5fa", "#818cf8", "#e5e7eb"]

export default function EmotionChart({ selectedProduct }: any) {
  const [data, setData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const brandInfo = JSON.parse(localStorage.getItem("brandInfo") || "{}")
        if (!brandInfo?.brandId) return

        const { data: emotions, error } = await supabase
          .from("emotion")
          .select(
            `
            emotion_id,
            emotion_type,
            score,
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

        if (error) throw error

        const filtered = emotions?.filter(
          (e: any) =>
            e.post?.post_products?.[0]?.product?.brand_id === brandInfo.brandId &&
            (selectedProduct === "all" ||
              e.post?.post_products?.[0]?.product?.product_id === Number(selectedProduct))
        )

        // Group emotion types
        const counts: Record<string, number> = {}
        filtered.forEach((e: any) => {
          const type = e.emotion_type?.toLowerCase() || "neutral"
          counts[type] = (counts[type] || 0) + 1
        })

        const total = Object.values(counts).reduce((a, b) => a + b, 0)
        const chartData = Object.entries(counts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          percent: ((value / total) * 100).toFixed(1),
        }))

        setData(chartData)
      } catch (err) {
        console.error("Error fetching emotion chart:", err)
      }
    }

    fetchEmotions()
  }, [selectedProduct])

  return (
    <div className="p-4 bg-card rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Emotion Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value}`, `${name}`]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
