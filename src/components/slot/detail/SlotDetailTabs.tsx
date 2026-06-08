"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RadarChart } from "./RadarChart"
import { FlavorBars } from "./FlavorBars"
import { RoastingLevel } from "./RoastingLevel"
import { useFunding } from "@/hooks/useFunding"
import { useComments } from "@/hooks/useComments"
import { toggleLike, votePoll, reservePayment } from "@/lib/api"
import { useCheckoutStore } from "@/store/checkoutStore"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Heart, Share2, BarChart2, Loader2 } from "lucide-react"
import type { SlotDetail } from "@/types/slot"

const TABS = ["스토리", "플레이버", "펀딩", "커뮤니티"] as const

function formatKRW(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}천만원`
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}백만원`
  return `${(n / 10000).toFixed(0)}만원`
}

interface SlotDetailTabsProps {
  slot: SlotDetail
  slotId: string
}

export function SlotDetailTabs({ slot, slotId }: SlotDetailTabsProps) {
  const router = useRouter()
  const {
    setOrderId,
    setSelectedReward: setStoreReward,
    setAmount,
    setOrderName,
    setSlotId,
    setSlotTitle,
    setSlotThumbnail,
    setMasterName,
    quantity,
  } = useCheckoutStore()

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("스토리")
  const [liked, setLiked] = useState(slot.isLiked ?? false)
  const [likeCount, setLikeCount] = useState(slot.likes)
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const [pollVoted, setPollVoted] = useState<string | null>(slot.poll?.myVote ?? null)
  const [pollOptions, setPollOptions] = useState(slot.poll?.options ?? [])
  const [isOrdering, setIsOrdering] = useState(false)

  const { data: fundingData } = useFunding(slotId)
  const { comments, postComment, isPending } = useComments(slotId)
  const [commentText, setCommentText] = useState("")

  const funding = fundingData?.funding
  const rewards = fundingData?.rewards ?? []
  const activeRewardId = selectedReward ?? rewards[0]?.id
  const activeReward = rewards.find((r) => r.id === activeRewardId)
  const accent = slot.accentColor ?? "#75584d"
  const totalPollVotes = pollOptions.reduce((s, o) => s + o.votes, 0)

  async function handleLike() {
    setLiked((p) => !p)
    setLikeCount((p) => (liked ? p - 1 : p + 1))
    try {
      await toggleLike(slotId)
    } catch {
      setLiked((p) => !p)
      setLikeCount((p) => (liked ? p + 1 : p - 1))
    }
  }

  async function handleVote(optionId: string) {
    if (pollVoted) return
    setPollVoted(optionId)
    setPollOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    )
    try {
      await votePoll(slotId, optionId)
    } catch {
      // optimistic — leave as-is on mock
    }
  }

  async function handleCommentSubmit() {
    if (!commentText.trim()) return
    await postComment(commentText.trim())
    setCommentText("")
  }

  const SERVICE_ID = "1"

  async function handleFunding() {
    if (!activeReward) return
    setIsOrdering(true)
    try {
      const { orderId } = await reservePayment(SERVICE_ID, activeReward.variantId, quantity)
      setOrderId(orderId)
      setStoreReward(activeReward)
      setAmount(activeReward.price)
      setOrderName(`${slot.title} - ${activeReward.label}`)
      setSlotId(slotId)
      setSlotTitle(slot.title)
      setSlotThumbnail(slot.thumbnailUrl ?? "")
      setMasterName(slot.master.name)
      router.push("/checkout")
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <div>
      <div className="flex border-b border-border bg-surface pt-0.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "border-b-2 px-6 py-3 font-display text-[13px] font-semibold transition-all",
              activeTab === tab
                ? "border-brand text-brand"
                : "border-transparent text-ink-muted hover:text-ink-2"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {/* ── 스토리 ── */}
        {activeTab === "스토리" && (
          <div>
            <p className="mb-7 text-base leading-[1.85] text-ink-2">{slot.excerpt}</p>

            <div className="mb-6 rounded-card border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-sm font-bold tracking-[0.02em] text-ink-1">
                이 원두의 이야기
              </h3>
              <p className="text-sm leading-[1.8] text-ink-2">{slot.description}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {slot.hashtags.map((h) => (
                <span
                  key={h}
                  className="rounded-pill bg-brand/[0.07] px-3.5 py-[5px] text-[13px] font-medium text-brand"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 플레이버 ── */}
        {activeTab === "플레이버" && (
          <div>
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center rounded-card border border-border bg-card p-6">
                <h3 className="mb-4 font-display text-[12px] font-bold tracking-[0.1em] text-ink-2">
                  FLAVOR PROFILE
                </h3>
                <RadarChart
                  data={Object.fromEntries(slot.flavor.radar.map((r) => [r.axis, r.value]))}
                  size={200}
                  color={accent}
                />
              </div>
              <div className="rounded-card border border-border bg-card p-6">
                <h3 className="mb-5 font-display text-[12px] font-bold tracking-[0.1em] text-ink-2">
                  CUPPING SCORE
                </h3>
                <FlavorBars
                  bars={slot.flavor.bars.map((b) => ({ name: b.name, value: b.value }))}
                  color={accent}
                />
              </div>
            </div>

            <div className="rounded-card border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-[12px] font-bold tracking-[0.1em] text-ink-2">
                ROASTING LEVEL
              </h3>
              <RoastingLevel level={slot.flavor.roastingLevel} color={accent} />
            </div>
          </div>
        )}

        {/* ── 펀딩 ── */}
        {activeTab === "펀딩" && (
          <div>
            {funding ? (
              <>
                {/* stats grid */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "달성률",
                      val: `${funding.percent}%`,
                      color: funding.percent >= 100 ? "#4a8a5a" : "#75584d",
                    },
                    {
                      label: "서포터",
                      val: `${funding.supporters.toLocaleString()}명`,
                      color: "var(--ink-1, #1a1c1e)",
                    },
                    {
                      label: "남은 기간",
                      val: funding.daysLeft === 0 ? "완료" : `D-${funding.daysLeft}`,
                      color: funding.daysLeft <= 3 ? "#c04040" : "var(--ink-1, #1a1c1e)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-card border border-border bg-card p-5 text-center"
                    >
                      <div
                        className="mb-1 font-display text-[22px] font-extrabold"
                        style={{ color: s.color }}
                      >
                        {s.val}
                      </div>
                      <div className="text-[11px] font-medium text-ink-muted">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* progress */}
                <div className="mb-6 rounded-card border border-border bg-card p-6">
                  <div className="mb-2.5 flex justify-between">
                    <span className="text-[13px] font-medium text-ink-2">현재 달성</span>
                    <span className="font-display text-[13px] font-bold text-ink-1">
                      {formatKRW(funding.currentAmount)} / {formatKRW(funding.targetAmount)}
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-pill bg-border"
                    style={{ width: "100%" }}
                  >
                    <div
                      className="h-full rounded-pill transition-all duration-700"
                      style={{
                        width: `${Math.min(funding.percent, 100)}%`,
                        background: `linear-gradient(90deg, ${accent}, #75584d)`,
                      }}
                    />
                  </div>
                </div>

                {/* rewards */}
                <h3 className="mb-3.5 font-display text-[15px] font-bold text-ink-1">
                  리워드 선택
                </h3>
                <div className="mb-6 flex flex-col gap-2.5">
                  {rewards.map((r) => {
                    const selected = r.id === activeRewardId
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReward(r.id)}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-card border px-5 py-4 transition-all",
                          selected
                            ? "border-brand bg-brand/5"
                            : "border-border bg-card hover:border-brand/40"
                        )}
                      >
                        <div className="flex-1">
                          <div className="mb-[5px] flex items-center gap-2">
                            <span className="font-display text-sm font-bold text-ink-1">
                              {r.label}
                            </span>
                            {r.remaining != null && (
                              <span className="rounded-pill bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                                잔여 {r.remaining}개
                              </span>
                            )}
                          </div>
                          {r.optionValues.length > 0 && (
                            <div className="mb-[3px] flex flex-wrap gap-1">
                              {r.optionValues.map((ov) => (
                                <span
                                  key={`${ov.optionType}-${ov.value}`}
                                  className="rounded-pill bg-brand/[0.07] px-2 py-0.5 text-[10px] font-medium text-brand"
                                >
                                  {ov.optionType}: {ov.value}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-[12px] text-ink-muted">{r.description}</p>
                        </div>
                        <span className="font-display text-base font-extrabold text-brand">
                          {r.price.toLocaleString()}원
                        </span>
                        <div
                          className={cn(
                            "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                            selected ? "border-brand" : "border-border"
                          )}
                        >
                          {selected && (
                            <div className="h-2 w-2 rounded-full bg-brand" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* CTA */}
                {funding.daysLeft > 0 ? (
                  <Button
                    onClick={handleFunding}
                    disabled={isOrdering || !activeReward}
                    className="w-full rounded-card py-4 font-display text-[15px] font-bold tracking-[0.02em] bg-brand text-white hover:bg-brand-dark"
                  >
                    {isOrdering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {activeReward?.price.toLocaleString()}원으로 펀딩 참여하기
                  </Button>
                ) : (
                  <div className="rounded-card border border-green-200 bg-green-50 p-4 text-center font-display font-bold text-green-700">
                    펀딩이 성공적으로 완료되었습니다 🎉
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center text-ink-muted">로딩 중...</div>
            )}
          </div>
        )}

        {/* ── 커뮤니티 ── */}
        {activeTab === "커뮤니티" && (
          <div>
            {/* like + share */}
            <div className="mb-7 flex gap-2.5">
              <Button
                variant="outline"
                onClick={handleLike}
                className={cn(
                  "rounded-pill font-display font-semibold transition-all",
                  liked && "border-red-400 bg-red-50 text-red-500 hover:bg-red-50 hover:text-red-500"
                )}
              >
                <Heart className={cn("mr-1.5 h-4 w-4", liked && "fill-red-500 text-red-500")} />
                {likeCount.toLocaleString()}
              </Button>
              <Button variant="outline" className="rounded-pill font-display font-semibold">
                <Share2 className="mr-1.5 h-4 w-4" />
                공유하기
              </Button>
            </div>

            {/* poll */}
            {slot.poll && (
              <div className="mb-7 rounded-card border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart2 className="h-3.5 w-3.5 text-brand" />
                  <h3 className="font-display text-sm font-bold text-ink-1">
                    {slot.poll.question}
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {pollOptions.map((opt) => {
                    const pct =
                      totalPollVotes > 0
                        ? Math.round((opt.votes / totalPollVotes) * 100)
                        : 0
                    const voted = pollVoted === opt.id
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        className={cn(
                          "relative overflow-hidden rounded-inner border px-3.5 py-3 transition-colors",
                          voted ? "border-brand" : "border-border",
                          !pollVoted && "cursor-pointer hover:border-brand/40"
                        )}
                      >
                        {/* fill bar */}
                        {pollVoted && (
                          <div
                            className={cn(
                              "absolute inset-0 rounded-inner transition-[width] duration-700",
                              voted ? "bg-brand/12" : "bg-border/50"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between">
                          <span
                            className={cn(
                              "text-[13px]",
                              voted ? "font-bold text-brand" : "font-medium text-ink-2"
                            )}
                          >
                            {opt.label}
                          </span>
                          {pollVoted && (
                            <span
                              className={cn(
                                "font-display text-[12px] font-bold",
                                voted ? "text-brand" : "text-ink-muted"
                              )}
                            >
                              {pct}%
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="mt-2.5 text-[11px] text-ink-muted">
                  총 {totalPollVotes.toLocaleString()}명 참여
                </p>
              </div>
            )}

            {/* comment input */}
            <div className="mb-5 rounded-card border border-border bg-card p-4">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="이 원두에 대한 이야기를 나눠보세요..."
                className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm leading-[1.7] text-ink-1 placeholder:text-ink-muted focus-visible:ring-0"
              />
              <div className="mt-2.5 flex justify-end">
                <Button
                  size="sm"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || isPending}
                  className="rounded-pill font-display text-[12px] font-semibold"
                  variant={commentText.trim() ? "default" : "secondary"}
                >
                  등록
                </Button>
              </div>
            </div>

            {/* comments */}
            <div className="flex flex-col gap-3">
              {comments.length === 0 && (
                <p className="py-10 text-center text-sm text-ink-muted">
                  첫 번째 댓글을 남겨보세요
                </p>
              )}
              {comments.map((c) => {
                const avatarColor = c.userColor ?? "#75584d"
                const displayName = c.author.name
                const relativeTime =
                  c.time ?? new Date(c.createdAt).toLocaleDateString("ko-KR")
                return (
                  <div
                    key={c.id}
                    className="rounded-card border border-border bg-card p-4"
                  >
                    <div className="mb-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full font-display text-[11px] font-bold text-white"
                          style={{ background: avatarColor }}
                        >
                          {displayName[0]?.toUpperCase()}
                        </div>
                        <span className="text-[13px] font-semibold text-ink-1">
                          {displayName}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-muted">{relativeTime}</span>
                    </div>
                    <p className="text-sm leading-[1.7] text-ink-2">{c.content}</p>
                    <div className="mt-2.5">
                      <button className="flex items-center gap-1 text-[12px] font-medium text-ink-muted hover:text-ink-2">
                        <Heart className="h-3 w-3" />
                        {c.likes ?? 0}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
