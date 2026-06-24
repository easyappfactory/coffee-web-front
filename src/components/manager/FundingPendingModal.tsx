"use client"

import { Check } from "lucide-react"
import { Modal } from "@/components/common/Modal"
import modalStyles from "@/components/common/Modal.module.css"
import styles from "./FundingPendingModal.module.css"

interface FundingPendingModalProps {
  open: boolean
  onClose: () => void
}

export function FundingPendingModal({
  open,
  onClose,
}: FundingPendingModalProps) {
  return (
    <Modal
      open={open}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <span className={modalStyles.note}>
            확정 대기 단계에서 주문을 확정할 수 있습니다.
          </span>
          <button
            type="button"
            className={`${modalStyles.btn} ${modalStyles.btnPrimary}`}
            onClick={onClose}
          >
            확인
          </button>
        </>
      }
    >
      <div className={styles.doneWrap}>
        <div className={styles.doneIc}>
          <Check size={38} strokeWidth={2.6} />
        </div>
        <h3>펀딩 성공을 축하드립니다!</h3>
        <p>주문 정보를 확인하고 주문 확정을 진행해주세요.</p>
      </div>
    </Modal>
  )
}
