"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/slot/feed/VideoPlayer"
import { useSlotDetail } from "@/hooks/useSlotDetail"
import { useFunding } from "@/hooks/useFunding"
import { useCommunityPosts } from "@/hooks/useCommunityPosts"
import { MasterProfileSidebar } from "@/components/slot/detail/MasterProfileSidebar"
import { SlotDetailTabs } from "@/components/slot/detail/SlotDetailTabs"

interface PageProps {
  params: { id: string }
}

export default function SlotDetailPage({ params }: PageProps) {
  const { id } = params
  const { data: slot, isLoading } = useSlotDetail(id)
  const { data: fundingData } = useFunding(id)

  // TODO: 실제 slot API 연결 후, slot 로드 완료 뒤 순차 호출하도록 enabled 조건 추가
  // 현재는 페이지 진입 시 바로 호출 (mock 환경)
  const communityQuery = useCommunityPosts(id)

  if (isLoading || !slot) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 text-center text-ink-muted">
          로딩 중...
        </div>
      </main>
    )
  }

  const fundingPercent: number = fundingData?.funding.percent ?? 0
  const daysLeft: number = fundingData?.funding.daysLeft ?? 0

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 pb-20">
        {/* back */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 pb-1 pt-5 font-display text-[13px] font-medium text-ink-muted transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-4 w-4" />
          슬롯 목록으로
        </Link>

        {/* 2-column layout */}
        <div className="mt-6 flex items-start gap-8">
          {/* left sidebar */}
          <MasterProfileSidebar master={slot.master} />


          {/* right main */}
          <div className="min-w-0 flex-1">
            {/* video */}
            <div className="relative overflow-hidden rounded-card">
              <VideoPlayer
                slotId={slot.id}
                thumbnailUrl={slot.thumbnailUrl}
                videoUrl={slot.videoUrl}
              />
              <Badge className="absolute left-4 top-4 border-0 bg-white/90 text-ink-1 backdrop-blur-[6px] hover:bg-white/90">
                {slot.category}
              </Badge>
            </div>

            {/* title info card */}
            <div className="mt-3 rounded-card border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  {slot.series}
                </p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className="rounded-pill px-2.5 py-1 font-display text-[11px] font-bold"
                    style={{
                      background: fundingPercent >= 100 ? "rgba(74,138,90,0.1)" : "rgba(117,88,77,0.08)",
                      color: fundingPercent >= 100 ? "#4a8a5a" : "#75584d",
                    }}
                  >
                    {fundingPercent}% 달성
                  </span>
                  <span
                    className="rounded-pill px-2.5 py-1 font-display text-[11px] font-bold"
                    style={{
                      background: daysLeft <= 3 ? "rgba(192,64,64,0.08)" : "rgba(68,71,72,0.06)",
                      color: daysLeft <= 3 ? "#c04040" : "#444748",
                    }}
                  >
                    {daysLeft === 0 ? "펀딩 완료" : `D-${daysLeft}`}
                  </span>
                </div>
              </div>
              <h1 className="mt-3 font-display text-[28px] font-bold leading-snug text-ink-1">
                {slot.title}
              </h1>
            </div>

            {/* tabs + content */}
            <SlotDetailTabs slot={slot} slotId={id} communityQuery={communityQuery} />
          </div>
        </div>
      </div>
    </main>
  )
}
