import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyPlaceholderProps {
  icon: LucideIcon
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
}

export function EmptyPlaceholder({ icon: Icon, title, description, buttonText, buttonHref }: EmptyPlaceholderProps) {
  return (
    <div className="flex h-[450px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">{description}</p>
      {buttonText && buttonHref && (
        <Button asChild className="mt-6">
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      )}
    </div>
  )
}
