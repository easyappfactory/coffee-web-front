"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import type { AdminSlot, SlotPhase } from "@/types/adminOrder"
import styles from "./SlotSelect.module.css"

interface SlotSelectProps {
  slots: AdminSlot[]
  value: string
  onChange: (slotId: string) => void
}

const PHASE_ORDER: SlotPhase[] = ["FUNDING", "OPERATING", "PRE", "CLOSED", "FAILED"]

const PHASE_LABELS: Record<SlotPhase, string> = {
  PRE: "펀딩 전",
  FUNDING: "펀딩 중",
  OPERATING: "운영 중",
  CLOSED: "종료",
  FAILED: "펀딩 실패",
}

const PHASE_CLASS: Record<SlotPhase, string> = {
  PRE: styles.phPRE,
  FUNDING: styles.phFUNDING,
  OPERATING: styles.phOPERATING,
  CLOSED: styles.phCLOSED,
  FAILED: styles.phFAILED,
}

export function SlotSelect({ slots, value, onChange }: SlotSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const cur = slots.find((s) => s.slotId === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const groups = PHASE_ORDER.map((ph) => ({
    ph,
    label: PHASE_LABELS[ph],
    items: slots.filter((s) => s.phase === ph),
  })).filter((g) => g.items.length > 0)

  return (
    <div className={styles.slotSelect} ref={ref}>
      {/* Trigger */}
      <button
        className={`${styles.trigger}${open ? ` ${styles.triggerOpen}` : ""}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <div className={styles.tx}>
          <div className={styles.nm}>{cur?.name ?? "슬롯 선택"}</div>
        </div>
        {cur && (
          <span className={`${styles.phaseBadge} ${PHASE_CLASS[cur.phase]}`}>
            {cur.phaseLabel}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`${styles.chev}${open ? ` ${styles.chevOpen}` : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.menu}>
          {groups.map((g) => (
            <div key={g.ph}>
              <div className={styles.groupLabel}>
                {g.label} {g.items.length}
              </div>
              {g.items.map((s) => (
                <button
                  key={s.slotId}
                  type="button"
                  className={`${styles.opt}${s.slotId === value ? ` ${styles.optSel}` : ""}`}
                  onClick={() => {
                    onChange(s.slotId)
                    setOpen(false)
                  }}
                >
                  <span className={styles.optNm}>{s.name}</span>
                  <span className={`${styles.phaseBadge} ${PHASE_CLASS[s.phase]}`}>
                    {s.phaseLabel}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
