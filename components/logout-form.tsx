import { logout } from "@/app/actions/logout-actions"

interface LogoutFormProps {
  redirectTo?: string
  className?: string
}

export function LogoutForm({ redirectTo = "/", className }: LogoutFormProps) {
  return (
    <form action={logout} className={className}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
        Log out
      </button>
    </form>
  )
}
