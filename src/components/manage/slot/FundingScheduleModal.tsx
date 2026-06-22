"use client"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, addMonths, startOfDay } from "date-fns"
import { Dialog } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { endDateFor, describeFundingDuration, type PeriodKey } from "@/lib/fundingDuration"

interface FundingScheduleModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (dates: { fundingStartDate: string; fundingEndDate: string }) => void
  submitting?: boolean
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "2w", label: "2주" },
  { key: "1m", label: "1개월" },
  { key: "2m", label: "2개월" },
  { key: "3m", label: "3개월" },
  { key: "6m", label: "6개월" },
]

export function FundingScheduleModal({
  open,
  onClose,
  onConfirm,
  submitting = false,
}: FundingScheduleModalProps) {
  const today = useMemo(() => startOfDay(new Date()), [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Step 1 state
  const [step, setStep] = useState<1 | 2>(1)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedCustomStart, setSelectedCustomStart] = useState<Date | undefined>(undefined)

  // Step 2 state
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey | null>("1m")
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1)
      setShowDatePicker(false)
      setSelectedCustomStart(undefined)
      setStartDate(null)
      setSelectedPeriod("1m")
      setEndDate(null)
    }
  }, [open])

  // ── Step 1 handlers ──────────────────────────────────────────────────────────

  function handleImmediateStart() {
    const start = today
    setStartDate(start)
    setEndDate(endDateFor(start, "1m"))
    setSelectedPeriod("1m")
    setStep(2)
  }

  function handleCustomStartClick() {
    if (!showDatePicker) {
      setShowDatePicker(true)
      return
    }
    if (selectedCustomStart) {
      setStartDate(selectedCustomStart)
      setEndDate(endDateFor(selectedCustomStart, "1m"))
      setSelectedPeriod("1m")
      setStep(2)
    }
  }

  // ── Step 2 handlers ──────────────────────────────────────────────────────────

  function handlePeriodChip(key: PeriodKey) {
    if (!startDate) return
    setSelectedPeriod(key)
    setEndDate(endDateFor(startDate, key))
  }

  function handleEndDateSelect(day: Date | undefined) {
    if (!day) return
    setEndDate(day)
    setSelectedPeriod(null)
  }

  function handleConfirm() {
    if (!startDate || !endDate) return
    onConfirm({
      fundingStartDate: format(startDate, "yyyy-MM-dd"),
      fundingEndDate: format(endDate, "yyyy-MM-dd"),
    })
  }

  const maxStartDate = addMonths(today, 12)

  return (
    <Dialog open={open} onClose={onClose} title="펀딩 일정">
      <div className="px-5 py-6">
        {/* ── 1단계: 시작일 선택 ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {/* 바로 펀딩 시작 */}
            <div>
              <button
                type="button"
                onClick={handleImmediateStart}
                className="w-full rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-ink-1 transition-colors hover:border-primary hover:text-primary active:scale-[0.98]"
              >
                바로 펀딩 시작
              </button>
              <p className="mt-1 text-center text-xs text-muted-foreground">오늘부터</p>
            </div>

            {/* 지정일에 시작 */}
            <div>
              <button
                type="button"
                onClick={handleCustomStartClick}
                className="w-full rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-ink-1 transition-colors hover:border-primary hover:text-primary active:scale-[0.98]"
              >
                지정일에 시작
              </button>
              {selectedCustomStart ? (
                <p className="mt-1 text-center text-xs text-primary">
                  {format(selectedCustomStart, "yyyy년 M월 d일")}
                </p>
              ) : (
                <p className="mt-1 text-center text-xs text-muted-foreground opacity-0">-</p>
              )}
            </div>

            {/* 날짜 선택 캘린더 */}
            {showDatePicker && (
              <div className="mt-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedCustomStart}
                  onSelect={(day) => setSelectedCustomStart(day)}
                  disabled={[{ before: today }, { after: maxStartDate }]}
                  startMonth={today}
                  endMonth={maxStartDate}
                />
              </div>
            )}
          </div>
        )}

        {/* ── 2단계: 기간/종료일 선택 ────────────────────────────────────────── */}
        {step === 2 && startDate && (
          <div className="flex flex-col gap-5">
            <h3 className="text-center text-sm font-semibold text-ink-1">펀딩 기간</h3>

            {/* 기간 칩 */}
            <div className="flex flex-wrap justify-center gap-2">
              {PERIOD_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePeriodChip(key)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    selectedPeriod === key
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-white text-ink-1 hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 종료일 캘린더 */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={endDate ?? undefined}
                onSelect={handleEndDateSelect}
                disabled={[{ before: addDays(startDate, 1) }, { after: addMonths(startDate, 12) }]}
                startMonth={startDate}
                endMonth={addMonths(startDate, 12)}
              />
            </div>

            {/* 구분선 + 요약 */}
            {startDate && endDate && (
              <>
                <hr className="border-border" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-ink-1">
                    {format(startDate, "yyyy.MM.dd")} ~ {format(endDate, "yyyy.MM.dd")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {describeFundingDuration(startDate, endDate)}
                  </p>
                </div>
              </>
            )}

            {/* 생성하기 버튼 */}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting || !startDate || !endDate}
              className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "생성 중..." : "생성하기"}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  )
}
