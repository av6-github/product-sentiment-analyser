"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SentimentChartProps {
  selectedProduct: string
  selectedTimePeriod: string
}

const chartData: Record<string, Record<string, any[]>> = {
  all: {
    lastweek: [
      { day: "Mon", positive: 65, neutral: 28, negative: 7 },
      { day: "Tue", positive: 70, neutral: 22, negative: 8 },
      { day: "Wed", positive: 68, neutral: 25, negative: 7 },
      { day: "Thu", positive: 75, neutral: 18, negative: 7 },
      { day: "Fri", positive: 78, neutral: 15, negative: 7 },
      { day: "Sat", positive: 72, neutral: 20, negative: 8 },
      { day: "Sun", positive: 73, neutral: 19, negative: 8 },
    ],
    lastmonth: [
      { day: "Week 1", positive: 62, neutral: 30, negative: 8 },
      { day: "Week 2", positive: 68, neutral: 24, negative: 8 },
      { day: "Week 3", positive: 71, neutral: 21, negative: 8 },
      { day: "Week 4", positive: 75, neutral: 18, negative: 7 },
    ],
    last3months: [
      { day: "Month 1", positive: 60, neutral: 32, negative: 8 },
      { day: "Month 2", positive: 68, neutral: 24, negative: 8 },
      { day: "Month 3", positive: 75, neutral: 18, negative: 7 },
    ],
    custom: [
      { day: "Mon", positive: 65, neutral: 28, negative: 7 },
      { day: "Tue", positive: 70, neutral: 22, negative: 8 },
      { day: "Wed", positive: 68, neutral: 25, negative: 7 },
    ],
  },
  ecophone: {
    lastweek: [
      { day: "Mon", positive: 58, neutral: 30, negative: 12 },
      { day: "Tue", positive: 62, neutral: 26, negative: 12 },
      { day: "Wed", positive: 60, neutral: 28, negative: 12 },
      { day: "Thu", positive: 64, neutral: 24, negative: 12 },
      { day: "Fri", positive: 66, neutral: 22, negative: 12 },
      { day: "Sat", positive: 62, neutral: 26, negative: 12 },
      { day: "Sun", positive: 63, neutral: 25, negative: 12 },
    ],
    lastmonth: [
      { day: "Week 1", positive: 55, neutral: 33, negative: 12 },
      { day: "Week 2", positive: 60, neutral: 28, negative: 12 },
      { day: "Week 3", positive: 64, neutral: 24, negative: 12 },
      { day: "Week 4", positive: 66, neutral: 22, negative: 12 },
    ],
    last3months: [
      { day: "Month 1", positive: 52, neutral: 36, negative: 12 },
      { day: "Month 2", positive: 60, neutral: 28, negative: 12 },
      { day: "Month 3", positive: 66, neutral: 22, negative: 12 },
    ],
    custom: [
      { day: "Mon", positive: 58, neutral: 30, negative: 12 },
      { day: "Tue", positive: 62, neutral: 26, negative: 12 },
      { day: "Wed", positive: 60, neutral: 28, negative: 12 },
    ],
  },
  smartwatch: {
    lastweek: [
      { day: "Mon", positive: 80, neutral: 15, negative: 5 },
      { day: "Tue", positive: 82, neutral: 13, negative: 5 },
      { day: "Wed", positive: 81, neutral: 14, negative: 5 },
      { day: "Thu", positive: 85, neutral: 10, negative: 5 },
      { day: "Fri", positive: 87, neutral: 8, negative: 5 },
      { day: "Sat", positive: 84, neutral: 11, negative: 5 },
      { day: "Sun", positive: 85, neutral: 10, negative: 5 },
    ],
    lastmonth: [
      { day: "Week 1", positive: 78, neutral: 17, negative: 5 },
      { day: "Week 2", positive: 81, neutral: 14, negative: 5 },
      { day: "Week 3", positive: 84, neutral: 11, negative: 5 },
      { day: "Week 4", positive: 87, neutral: 8, negative: 5 },
    ],
    last3months: [
      { day: "Month 1", positive: 75, neutral: 20, negative: 5 },
      { day: "Month 2", positive: 81, neutral: 14, negative: 5 },
      { day: "Month 3", positive: 87, neutral: 8, negative: 5 },
    ],
    custom: [
      { day: "Mon", positive: 80, neutral: 15, negative: 5 },
      { day: "Tue", positive: 82, neutral: 13, negative: 5 },
      { day: "Wed", positive: 81, neutral: 14, negative: 5 },
    ],
  },
  cloudsync: {
    lastweek: [
      { day: "Mon", positive: 70, neutral: 24, negative: 6 },
      { day: "Tue", positive: 72, neutral: 22, negative: 6 },
      { day: "Wed", positive: 71, neutral: 23, negative: 6 },
      { day: "Thu", positive: 74, neutral: 20, negative: 6 },
      { day: "Fri", positive: 76, neutral: 18, negative: 6 },
      { day: "Sat", positive: 72, neutral: 22, negative: 6 },
      { day: "Sun", positive: 73, neutral: 21, negative: 6 },
    ],
    lastmonth: [
      { day: "Week 1", positive: 68, neutral: 26, negative: 6 },
      { day: "Week 2", positive: 71, neutral: 23, negative: 6 },
      { day: "Week 3", positive: 74, neutral: 20, negative: 6 },
      { day: "Week 4", positive: 76, neutral: 18, negative: 6 },
    ],
    last3months: [
      { day: "Month 1", positive: 65, neutral: 29, negative: 6 },
      { day: "Month 2", positive: 71, neutral: 23, negative: 6 },
      { day: "Month 3", positive: 76, neutral: 18, negative: 6 },
    ],
    custom: [
      { day: "Mon", positive: 70, neutral: 24, negative: 6 },
      { day: "Tue", positive: 72, neutral: 22, negative: 6 },
      { day: "Wed", positive: 71, neutral: 23, negative: 6 },
    ],
  },
}

export default function SentimentChart({ selectedProduct, selectedTimePeriod }: SentimentChartProps) {
  const data = chartData[selectedProduct]?.[selectedTimePeriod] || chartData.all.lastweek

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="positive" stroke="#40798c" strokeWidth={2} name="Positive" />
            <Line type="monotone" dataKey="neutral" stroke="#70a9a1" strokeWidth={2} name="Neutral" />
            <Line type="monotone" dataKey="negative" stroke="#0b2027" strokeWidth={2} name="Negative" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
