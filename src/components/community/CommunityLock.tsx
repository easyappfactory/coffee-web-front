"use client";

import { Lock } from "lucide-react";

export function CommunityLock() {
  return (
    <div className="relative min-h-[480px]">
      {/* 더미 콘텐츠 (blur 처리) */}
      <div className="pointer-events-none select-none blur-[6px] opacity-40">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-card border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-border" />
                <div>
                  <div className="mb-1.5 h-3.5 w-28 rounded bg-border" />
                  <div className="h-2.5 w-16 rounded bg-border" />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="h-3.5 w-full rounded bg-border" />
                <div className="h-3.5 w-5/6 rounded bg-border" />
                <div className="h-3.5 w-3/4 rounded bg-border" />
              </div>
              <div className="mt-4 flex gap-6">
                <div className="h-3 w-14 rounded bg-border" />
                <div className="h-3 w-14 rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-surface/80 px-16 py-12 shadow-sm backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
            <Lock className="h-10 w-10 text-brand" />
          </div>
          <p className="font-display text-lg font-bold text-ink-1">
            잠긴 커뮤니티
          </p>
          <p className="text-center text-sm leading-relaxed text-ink-muted">
            슬롯 결제 후 참여할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
