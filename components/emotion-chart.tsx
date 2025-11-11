"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface EmotionChartProps {
  selectedProduct?: string
}

export default function EmotionChart({ selectedProduct = "all" }: EmotionChartProps) {
  const emotionData: Record<string, any[]> = {
    all: [
      { name: "Happy", value: 35 },
      { name: "Excited", value: 25 },
      { name: "Neutral", value: 22 },
      { name: "Frustrated", value: 12 },
      { name: "Angry", value: 6 },
    ],
    ecophone: [
      { name: "Happy", value: 28 },
      { name: "Excited", value: 18 },
      { name: "Neutral", value: 22 },
      { name: "Frustrated", value: 22 },
      { name: "Angry", value: 10 },
    ],
    smartwatch: [
      { name: "Happy", value: 45 },
      { name: "Excited", value: 30 },
      { name: "Neutral", value: 15 },
      { name: "Frustrated", value: 7 },
      { name: "Angry", value: 3 },
    ],
    cloudsync: [
      { name: "Happy", value: 38 },
      { name: "Excited", value: 28 },
      { name: "Neutral", value: 20 },
      { name: "Frustrated", value: 10 },
      { name: "Angry", value: 4 },
    ],
  }

  const data = emotionData[selectedProduct] || emotionData.all

  return (
    <Card className="shadow-md border-0 bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Emotion Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ name, value }) => `${name} ${value}%`}
              outerRadius={85}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Happy"
                      ? "#3b82f6"
                      : entry.name === "Excited"
                        ? "#a855f7"
                        : entry.name === "Frustrated"
                          ? "#f59e0b"
                          : entry.name === "Neutral"
                            ? "#6366f1"
                            : entry.name === "Angry"
                              ? "#dc2626"
                              : "#8884d8"
                  }
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
