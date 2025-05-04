import type React from "react"
import type { LucideIcon } from "lucide-react"
import { BookOpen, FileText, Users, BarChart } from "lucide-react"

type EmptyPlaceholderProps = {
  title: string
  description: string
  icon: "BookOpen" | "FileText" | "Users" | "BarChart"
  children?: React.ReactNode
}

export function EmptyPlaceholder({ title, description, icon, children }: EmptyPlaceholderProps) {
  const Icon = getIcon(icon)

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  )
}

function getIcon(icon: string): LucideIcon {
  switch (icon) {
    case "BookOpen":
      return BookOpen
    case "FileText":
      return FileText
    case "Users":
      return Users
    case "BarChart":
      return BarChart
    default:
      return FileText
  }
}
