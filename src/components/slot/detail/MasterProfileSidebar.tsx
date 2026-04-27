"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockMasterProfiles } from "@/lib/mock/slots"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, Plus } from "lucide-react"
import type { Slot } from "@/types/slot"
import { cn } from "@/lib/utils"

type SlotMaster = Slot["master"]

interface MasterProfileSidebarProps {
  master: SlotMaster
}

export function MasterProfileSidebar({ master }: MasterProfileSidebarProps) {
  const profile = mockMasterProfiles[master.id] ?? {
    id: master.id,
    name: master.name,
    role: master.role ?? "스페셜티 커피 마스터",
    profileColor: master.profileColor ?? "#75584d",
    profileImage: master.profileImage ?? "",
    bio: "스페셜티 커피 마스터.",
    followers: master.followers,
    slotCount: 0,
    totalFunding: 0,
    isFollowing: false,
    recentSlots: [],
  }

  const [followed, setFollowed] = useState(false)
  const [followerCount, setFollowerCount] = useState(profile.followers)
  const router = useRouter()

  const profileColor: string = profile.profileColor

  function toggleFollow() {
    setFollowed((p) => !p)
    setFollowerCount((p) => (followed ? p - 1 : p + 1))
  }

  function formatFollowers(n: number) {
    if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
    return n.toLocaleString()
  }

  return (
    <aside className="sticky top-[81px] flex w-[260px] shrink-0 flex-col gap-4 self-start">
      {/* profile card */}
      <div className="overflow-hidden rounded-card border border-border bg-card">
        {/* color header band */}
        <div
          className="relative h-[72px]"
          style={{ background: profileColor, opacity: 0.85 }}
        >
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 260 72"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="220" cy="10" r="60" fill="white" />
            <circle cx="20" cy="60" r="40" fill="white" />
          </svg>
        </div>

        {/* content */}
        <div className="-mt-[30px] px-5 pb-5">
          {/* avatar */}
          <Avatar className="mb-3 h-[60px] w-[60px] border-[3px] border-card shadow-md">
            <AvatarImage src={profile.profileImage} alt={profile.name} />
            <AvatarFallback
              className="font-display text-[22px] font-extrabold text-white"
              style={{ background: profileColor }}
            >
              {profile.name[0]}
            </AvatarFallback>
          </Avatar>

          <p className="font-display text-base font-extrabold text-ink-1">{profile.name}</p>
          <p className="mb-3 text-[11px] leading-[1.5] text-ink-muted">{profile.role}</p>
          <p className="mb-4 text-[12px] leading-[1.7] text-ink-2">{profile.bio}</p>

          {/* stats */}
          <div className="mb-4 flex overflow-hidden rounded-inner border border-border">
            {[
              { label: "팔로워", val: formatFollowers(followerCount) },
              { label: "슬롯", val: `${profile.slotCount}개` },
            ].map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex-1 py-2.5 text-center",
                  i > 0 && "border-l border-border"
                )}
              >
                <div className="font-display text-base font-extrabold text-ink-1">{s.val}</div>
                <div className="mt-0.5 text-[10px] text-ink-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* follow button */}
          <Button
            onClick={toggleFollow}
            variant={followed ? "outline" : "default"}
            className="w-full rounded-pill font-display font-bold"
            style={
              followed
                ? undefined
                : { background: profileColor, borderColor: profileColor }
            }
          >
            {followed ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                팔로잉
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                팔로우
              </>
            )}
          </Button>
        </div>
      </div>

      {/* recent slots */}
      {profile.recentSlots.length > 0 && (
        <div className="rounded-card border border-border bg-card p-4">
          <p className="mb-3 font-display text-[11px] font-bold tracking-[0.1em] text-ink-muted">
            최근 슬롯
          </p>
          <div className="flex flex-col gap-2">
            {profile.recentSlots.map((rs) => (
              <div
                key={rs.id}
                onClick={() => router.push(`/slot/${rs.id}`)}
                className="flex cursor-pointer items-center gap-2.5 rounded-inner p-2 transition-colors hover:bg-gray-light"
              >
                {/* mini thumbnail */}
                <div
                  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[6px]"
                  style={{ background: rs.thumbnailColor }}
                >
                  <svg
                    className="absolute inset-0 h-full w-full opacity-20"
                    viewBox="0 0 44 44"
                  >
                    <circle cx="38" cy="8" r="24" fill={rs.accentColor} />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold leading-[1.35] text-ink-1">
                    {rs.title}
                  </p>
                  <p
                    className="font-display text-[11px] font-bold"
                    style={{ color: rs.percent >= 100 ? "#4a8a5a" : "#75584d" }}
                  >
                    {rs.percent}% 달성
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
