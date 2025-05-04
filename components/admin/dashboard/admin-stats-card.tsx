import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import type { ReactNode } from "react"

interface AdminStatsCardProps {
  title: string
  value: string
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: ReactNode
  className?: string
}

export function AdminStatsCard({
  title,
  value,
  description,
  trend = "neutral",
  trendValue,
  icon,
  className,
}: AdminStatsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {trend && trendValue && (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                trend === "up" && "bg-green-50 text-green-700",
                trend === "down" && "bg-red-50 text-red-700",
                trend === "neutral" && "bg-gray-50 text-gray-700",
              )}
            >
              {trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
              {trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
              {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
              {trendValue}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
