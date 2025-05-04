import type { ReactNode } from "react"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StudentStatsCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: ReactNode
  className?: string
}

export function StudentStatsCard({
  title,
  value,
  description,
  trend = "neutral",
  trendValue,
  icon,
  className,
}: StudentStatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline">
          <h3 className="text-3xl font-bold">{value}</h3>
          {trend && trendValue && (
            <div
              className={cn(
                "ml-2 flex items-center text-xs font-medium",
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground",
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : trend === "down" ? (
                <ArrowDown className="mr-1 h-3 w-3" />
              ) : (
                <Minus className="mr-1 h-3 w-3" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
