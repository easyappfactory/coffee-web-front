"use client"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, addMonths, startOfDay } from "date-fns"
import { Modal } from "@/components/common/Modal"
import modalStyles from "@/components/common/Modal.module.css"
import { Calendar } from "@/components/ui/calendar"
import {
  endDateFor,
  describeFundingDuration,
  type PeriodKey,
} from "@/lib/fundingDuration"
import styles from "./FundingScheduleModal.module.css"

interface FundingScheduleModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (dates: {
    fundingStartDate: string
    fundingEndDate: string
  }) => void
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
  const [selectedCustomStart, setSelectedCustomStart] = useState<
    Date | undefined
  >(undefined)

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

  // step indicator
  const stepIndicator = (
    <div className={styles.steps}>
      <div
        className={`${styles.step} ${step === 1 ? styles.on : styles.doneStep}`}
      >
        <span className={styles.num}>{step === 1 ? "1" : "✓"}</span>
        시작일
      </div>
      <div className={styles.stepLine} />
      <div className={`${styles.step} ${step === 2 ? styles.on : ""}`}>
        <span className={styles.num}>2</span>
        펀딩 기간
      </div>
    </div>
  )

  // step-aware footer
  const footer =
    step === 1 ? (
      <span className={modalStyles.note}>
        시작일을 선택하면 펀딩 기간 단계로 이동합니다.
      </span>
    ) : (
      <>
        <button
          type="button"
          className={`${modalStyles.btn} ${modalStyles.btnGhost}`}
          onClick={() => setStep(1)}
          disabled={submitting}
        >
          이전
        </button>
        <button
          type="button"
          className={`${modalStyles.btn} ${modalStyles.btnPrimary}`}
          onClick={handleConfirm}
          disabled={submitting || !startDate || !endDate}
        >
          {submitting ? "생성 중…" : "생성하기"}
        </button>
      </>
    )

  return (
    <Modal
      open={open}
      title="펀딩 일정"
      desc="펀딩 시작일과 기간을 설정합니다."
      onClose={onClose}
      footer={footer}
    >
      {stepIndicator}

      {/* ── 1단계: 시작일 선택 ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className={styles.choices}>
          {/* 바로 펀딩 시작 */}
          <div>
            <button
              type="button"
              onClick={handleImmediateStart}
              className={styles.choice}
            >
              바로 펀딩 시작
            </button>
            <p className={styles.choiceHint}>오늘부터</p>
          </div>

          {/* 지정일에 시작 */}
          <div>
            <button
              type="button"
              onClick={handleCustomStartClick}
              className={styles.choice}
            >
              지정일에 시작
            </button>
            {selectedCustomStart ? (
              <p className={`${styles.choiceHint} ${styles.accent}`}>
                {format(selectedCustomStart, "yyyy년 M월 d일")}
              </p>
            ) : (
              <p className={`${styles.choiceHint} ${styles.spacer}`}>-</p>
            )}
          </div>

          {/* 날짜 선택 캘린더 */}
          {showDatePicker && (
            <div className={styles.calWrap}>
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
        <div className={styles.stack}>
          <h4 className={styles.sectionTitle}>펀딩 기간</h4>

          {/* 기간 칩 */}
          <div className={styles.chips}>
            {PERIOD_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePeriodChip(key)}
                className={`${styles.chip} ${
                  selectedPeriod === key ? styles.chipActive : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 종료일 캘린더 */}
          <div className={styles.calWrap}>
            <Calendar
              mode="single"
              selected={endDate ?? undefined}
              onSelect={handleEndDateSelect}
              disabled={[
                { before: addDays(startDate, 1) },
                { after: addMonths(startDate, 12) },
              ]}
              startMonth={startDate}
              endMonth={addMonths(startDate, 12)}
            />
          </div>

          {/* 구분선 + 요약 */}
          {startDate && endDate && (
            <>
              <hr className={styles.divider} />
              <div className={styles.summary}>
                <p className={styles.summaryRange}>
                  {format(startDate, "yyyy.MM.dd")} ~{" "}
                  {format(endDate, "yyyy.MM.dd")}
                </p>
                <p className={styles.summaryDur}>
                  {describeFundingDuration(startDate, endDate)}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
