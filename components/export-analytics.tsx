"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileText, FileIcon as FilePdf, FileSpreadsheet } from "lucide-react"

export function ExportAnalytics() {
  const [format, setFormat] = useState("pdf")
  const [isExporting, setIsExporting] = useState(false)

  const [sections, setSections] = useState({
    engagement: true,
    performance: true,
    content: true,
    insights: true,
  })

  const handleExport = async () => {
    setIsExporting(true)

    // In a real app, this would call an API endpoint to generate the report
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `teacher-analytics-report.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsExporting(false)
  }

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Analytics Report</DialogTitle>
          <DialogDescription>Create a report with your selected analytics data.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Report Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FilePdf className="mr-2 h-4 w-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="xlsx">
                  <div className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel Spreadsheet
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    CSV File
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Include Sections</Label>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="engagement"
                  checked={sections.engagement}
                  onCheckedChange={() => toggleSection("engagement")}
                />
                <Label htmlFor="engagement">Student Engagement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performance"
                  checked={sections.performance}
                  onCheckedChange={() => toggleSection("performance")}
                />
                <Label htmlFor="performance">Student Performance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="content" checked={sections.content} onCheckedChange={() => toggleSection("content")} />
                <Label htmlFor="content">Content Analytics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="insights" checked={sections.insights} onCheckedChange={() => toggleSection("insights")} />
                <Label htmlFor="insights">Key Insights</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>Generating Report...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
