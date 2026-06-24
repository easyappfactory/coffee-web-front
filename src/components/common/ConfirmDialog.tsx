"use client"

import { useEffect } from "react"
import styles from "./ConfirmDialog.module.css"

export interface ConfirmDialogProps {
  open: boolean
  /** 가운데 정렬 메시지. <b>로 핵심 단어 강조 가능. */
  message: React.ReactNode
  /** 메시지 아래 부연 설명(선택). */
  desc?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** 'default'(브라운 확정) | 'danger'(레드 확정 — 삭제/취소 등 파괴적 작업) */
  tone?: "default" | "danger"
  /** 처리 중 — 두 버튼 비활성화 + 확정 라벨을 pendingLabel로 교체, ESC·바깥클릭 무시 */
  pending?: boolean
  pendingLabel?: string
  /** 바깥 클릭으로 닫기 허용 여부 (기본 true) */
  closeOnOverlay?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ConfirmDialog — 되돌릴 수 없는 작업을 확정받는 간결한 확인 다이얼로그.
 * 가운데 정렬 메시지 + 취소/확정 두 버튼. (송장 일괄등록 같은 폼은 Modal/Dialog를 쓴다.)
 *
 * 디자인 시스템: 원두 슬롯 주문관리 · components/feedback/ConfirmDialog
 */
export function ConfirmDialog({
  open,
  message,
  desc,
  confirmLabel = "확인",
  cancelLabel = "취소",
  tone = "default",
  pending = false,
  pendingLabel,
  closeOnOverlay = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // ESC = 취소 (처리 중에는 무시)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, pending, onCancel])

  // body 스크롤 락
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const confirmClass = `${styles.btn} ${tone === "danger" ? styles.btnDanger : styles.btnPrimary}`

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (closeOnOverlay && !pending && e.target === e.currentTarget)
          onCancel()
      }}
    >
      <div className={styles.modal} role="alertdialog" aria-modal="true">
        <div className={styles.body}>
          <p className={styles.msg}>{message}</p>
          {desc && <p className={styles.desc}>{desc}</p>}
        </div>
        <div className={styles.foot}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={onCancel}
            disabled={pending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClass}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending && pendingLabel ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
