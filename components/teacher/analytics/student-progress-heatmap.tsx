"use client"

import { useState } from "react"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts"

// Sample data - in a real app, this would come from props
const generateData = () => {
  const data = []
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8am to 8pm

  for (let day = 0; day < days.length; day++) {
    for (let hour = 0; hour < hours.length; hour++) {
      // Generate random activity level (0-100)
      const activity = Math.floor(Math.random() * 100)
      data.push({
        x: day,
        y: hour,
        z: activity,
        day: days[day],
        hour: `${hours[hour]}:00`,
      })
    }
  }
  return data
}

const data = generateData()

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { day, hour, z } = payload[0].payload
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{`${day} at ${hour}`}</p>
        <p className="text-sm text-muted-foreground">{`Activity: ${z}%`}</p>
      </div>
    )
  }
  return null
}

export function StudentProgressHeatmap() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const getColor = (value: number) => {
    // Color scale from light to dark based on activity level
    if (value < 20) return "rgba(74, 222, 128, 0.2)"
    if (value < 40) return "rgba(74, 222, 128, 0.4)"
    if (value < 60) return "rgba(74, 222, 128, 0.6)"
    if (value < 80) return "rgba(74, 222, 128, 0.8)"
    return "rgba(74, 222, 128, 1)"
  }

  return (
    <ChartContainer className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis
            type="number"
            dataKey="x"
            name="day"
            domain={[0, 6]}
            tickCount={7}
            tickFormatter={(value) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][value]}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="hour"
            domain={[0, 11]}
            tickCount={6}
            tickFormatter={(value) => `${value + 8}:00`}
          />
          <ZAxis type="number" dataKey="z" range={[0, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Activity" data={data} shape="square">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.z)}
                onMouseOver={() => setActiveIndex(index)}
                onMouseOut={() => setActiveIndex(null)}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
