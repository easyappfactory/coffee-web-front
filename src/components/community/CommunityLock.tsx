"use client"

import { Lock } from "lucide-react"

export function CommunityLock() {
  return (
    <div className="flex h-[320px] flex-col items-center justify-center rounded-card border border-border bg-card">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
        <Lock className="h-10 w-10 text-brand" />
      </div>
      <p className="mt-5 font-display text-lg font-bold text-ink-1">
        잠긴 커뮤니티
      </p>
      <p className="mt-2 text-center text-sm leading-relaxed text-ink-muted">
        슬롯 결제 후 참여할 수 있습니다
      </p>
    </div>
  )
}
