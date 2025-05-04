"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

const ChartContext = React.createContext<{
  config?: Record<string, { label: string; color: string }>
}>({})

const ChartContainer = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, children, config, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn("recharts-wrapper", className)}
          {...props}
          style={{
            "--color-primary": "hsl(var(--primary))",
            "--color-secondary": "hsl(var(--secondary))",
            "--color-muted": "hsl(var(--muted))",
            "--color-muted-foreground": "hsl(var(--muted-foreground))",
            "--color-border": "hsl(var(--border))",
            "--color-background": "hsl(var(--background))",
            "--color-foreground": "hsl(var(--foreground))",
            "--color-card": "hsl(var(--card))",
            "--color-card-foreground": "hsl(var(--card-foreground))",
            "--color-destructive": "hsl(var(--destructive))",
            "--color-destructive-foreground": "hsl(var(--destructive-foreground))",
            "--color-ring": "hsl(var(--ring))",
            "--color-chart-1": "hsl(var(--chart-1, 222, 80%, 60%))",
            "--color-chart-2": "hsl(var(--chart-2, 358, 80%, 60%))",
            "--color-chart-3": "hsl(var(--chart-3, 130, 60%, 50%))",
            "--color-chart-4": "hsl(var(--chart-4, 45, 80%, 60%))",
            "--color-chart-5": "hsl(var(--chart-5, 280, 80%, 60%))",
            "--color-chart-6": "hsl(var(--chart-6, 180, 80%, 60%))",
            "--color-chart-7": "hsl(var(--chart-7, 310, 80%, 60%))",
            "--color-chart-8": "hsl(var(--chart-8, 90, 80%, 60%))",
            ...Object.entries(config || {}).reduce(
              (acc, [key, { color }]) => ({
                ...acc,
                [`--color-${key}`]: color,
              }),
              {},
            ),
            ...props.style,
          }}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("recharts-tooltip border border-border bg-background p-2 shadow-sm", className)}
        {...props}
      />
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("recharts-tooltip-label mb-1 font-medium", className)} {...props} />
  },
)
ChartTooltipLabel.displayName = "ChartTooltipLabel"

const ChartTooltipItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: string
    name?: string
    value?: string | number
  }
>(({ className, color, name, value, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("recharts-tooltip-item flex items-center text-sm", className)} {...props}>
      {color && (
        <div
          className="mr-1 h-2 w-2 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />
      )}
      {name && <span className="recharts-tooltip-item-name mr-1">{name}</span>}
      {value !== undefined && <span className="recharts-tooltip-item-value ml-auto font-medium">{value}</span>}
    </div>
  )
})
ChartTooltipItem.displayName = "ChartTooltipItem"

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: string | number
    dataKey: string
    color: string
  }>
  label?: string
}) {
  const { config } = React.useContext(ChartContext)

  if (!active || !payload?.length || !config) {
    return null
  }

  return (
    <ChartTooltip>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map(({ name, value, dataKey, color }) => {
        const itemConfig = config[dataKey]
        return (
          <ChartTooltipItem
            key={name}
            color={itemConfig?.color || color}
            name={itemConfig?.label || name}
            value={value}
          />
        )
      })}
    </ChartTooltip>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipLabel, ChartTooltipItem, ChartTooltipContent }
