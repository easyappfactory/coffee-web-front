import { MessageCircle, BarChart3, Heart } from "lucide-react"

interface CommunityBadgeProps {
  newComments: number
  newVotes: number
  newLikes: number
}

export function CommunityBadge({
  newComments,
  newVotes,
  newLikes,
}: CommunityBadgeProps) {
  const items = [
    { icon: MessageCircle, count: newComments, label: "댓글" },
    { icon: BarChart3, count: newVotes, label: "투표" },
    { icon: Heart, count: newLikes, label: "좋아요" },
  ].filter((item) => item.count > 0)

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map(({ icon: Icon, count, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted"
        >
          <Icon className="h-3 w-3" />
          +{count}
        </span>
      ))}
    </div>
  )
}
