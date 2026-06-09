"use client";

import { Lock } from "lucide-react";

export function CommunityLock() {
  return (
    <div className="relative">
      {/* 더미 콘텐츠 (blur 처리) */}
      <div className="pointer-events-none select-none blur-[6px] opacity-40">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-card border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-border" />
                <div className="h-3 w-24 rounded bg-border" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-border" />
                <div className="h-3 w-3/4 rounded bg-border" />
              </div>
              <div className="mt-3 flex gap-4">
                <div className="h-3 w-12 rounded bg-border" />
                <div className="h-3 w-12 rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface/80 px-10 py-8 backdrop-blur-sm border border-border/50 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
            <Lock className="h-7 w-7 text-brand" />
          </div>
          <p className="font-display text-[15px] font-bold text-ink-1">
            잠긴 커뮤니티
          </p>
          <p className="text-center text-[13px] leading-relaxed text-ink-muted">
            슬롯 결제 후 참여할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
