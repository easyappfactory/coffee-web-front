import { Construction } from "lucide-react"

interface ComingSoonProps {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-light">
        <Construction className="h-7 w-7 text-ink-muted" />
      </div>
      <h2 className="mb-2 font-display text-xl font-bold text-ink-1">
        {title}
      </h2>
      <p className="text-sm text-ink-muted">
        이 기능은 곧 제공될 예정입니다.
      </p>
    </div>
  )
}
