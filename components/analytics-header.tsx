"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { AnalyticsPeriodSelector } from "./analytics-period-selector"
import { ExportAnalytics } from "./export-analytics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function AnalyticsHeader() {
  const [classFilter, setClassFilter] = useState("all")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search analytics..." className="w-full pl-8 sm:w-[200px]" />
        </div>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="math101">Math 101</SelectItem>
            <SelectItem value="science202">Science 202</SelectItem>
            <SelectItem value="history303">History 303</SelectItem>
          </SelectContent>
        </Select>

        <AnalyticsPeriodSelector />
        <ExportAnalytics />
      </div>
    </div>
  )
}
