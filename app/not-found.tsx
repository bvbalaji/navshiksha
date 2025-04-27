import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 text-4xl font-bold">404</h2>
      <p className="mb-2 text-xl font-medium">Page Not Found</p>
      <p className="mb-6 text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}
