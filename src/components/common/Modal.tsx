"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import styles from "./Modal.module.css"

export interface ModalProps {
  open: boolean
  title?: React.ReactNode
  desc?: React.ReactNode
  /** 'md'(720px, 폼/마법사 기본) | 'sm'(480px, 조회/확인) */
  size?: "md" | "sm"
  /** 하단 바. 보통 좌측 note + 우측 버튼들. 없으면 푸터가 사라진다. */
  footer?: React.ReactNode
  /** 주어지면 X버튼·ESC·오버레이 클릭으로 닫힌다. */
  onClose?: () => void
  closeOnOverlay?: boolean
  children?: React.ReactNode
}

/**
 * Modal — Barista Masters 다이얼로그.
 * 오버레이(블러+딤) + 떠오르는 카드. 헤더(제목/설명/닫기) · 본문 · 푸터 구조.
 *
 * 디자인 시스템: 원두 슬롯 주문관리 · components/feedback/Modal
 */
export function Modal({
  open,
  title,
  desc,
  size = "md",
  footer = null,
  onClose,
  closeOnOverlay = true,
  children,
}: ModalProps) {
  // ESC = 닫기
  useEffect(() => {
    if (!open || !onClose) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // body 스크롤 락
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (closeOnOverlay && onClose && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`${styles.modal} ${size === "sm" ? styles.sizeSm : ""}`}
        role="dialog"
        aria-modal="true"
      >
        {(title || onClose) && (
          <div className={styles.head}>
            <div>
              {title && <h3 className={styles.title}>{title}</h3>}
              {desc && <p className={styles.desc}>{desc}</p>}
            </div>
            {onClose && (
              <button
                type="button"
                className={styles.xBtn}
                onClick={onClose}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  )
}
