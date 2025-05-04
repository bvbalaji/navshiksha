import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string | number
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, trendValue, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-2 flex items-center text-xs">
          {trend && (
            <div
              className={cn(
                "mr-1 rounded-md px-1 py-0.5",
                trend === "up" && "bg-green-100 text-green-800",
                trend === "down" && "bg-red-100 text-red-800",
                trend === "neutral" && "bg-gray-100 text-gray-800",
              )}
            >
              <div className="flex items-center">
                {trend === "up" && <ArrowUpIcon className="mr-1 h-3 w-3" />}
                {trend === "down" && <ArrowDownIcon className="mr-1 h-3 w-3" />}
                {trendValue}
              </div>
            </div>
          )}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
