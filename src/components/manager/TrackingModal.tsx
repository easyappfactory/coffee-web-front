"use client"

import { useState } from "react"
import { Modal } from "@/components/common/Modal"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { useOrderTracking, useUpdateOrderTracking } from "@/hooks/useAdminOrders"
import type { AdminOrder, Courier } from "@/types/adminOrder"
import styles from "./TrackingModal.module.css"

interface TrackingModalProps {
  order: AdminOrder
  slotId: string
  couriers: Courier[]
  onClose: () => void
  onSuccess?: () => void
}

export default function TrackingModal({ order, slotId, couriers, onClose, onSuccess }: TrackingModalProps) {
  const hasTracking = !!order.trackingNumber
  const { data: tracking, isLoading, isError, refetch } = useOrderTracking(order.orderId, hasTracking)
  const updateMut = useUpdateOrderTracking(slotId)

  const [carrierCode, setCarrierCode] = useState<string>(
    couriers.find((c) => c.name === order.courier)?.code ?? "",
  )
  const [trackingNumber, setTrackingNumber] = useState<string>(order.trackingNumber ?? "")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const dirty =
    trackingNumber.trim() !== (order.trackingNumber ?? "") ||
    carrierCode !== (couriers.find((c) => c.name === order.courier)?.code ?? "")

  const resetEdit = () => {
    setTrackingNumber(order.trackingNumber ?? "")
    setCarrierCode(couriers.find((c) => c.name === order.courier)?.code ?? "")
  }

  const doUpdate = () => {
    updateMut.mutate(
      { orderId: order.orderId, trackingNumber: trackingNumber.trim(), carrierCode },
      {
        onSuccess: () => {
          setConfirmOpen(false)
          onSuccess?.()
          onClose()
        },
      },
    )
  }

  return (
    <>
      <Modal open title="배송 조회" size="md" onClose={onClose}>
        {/* ① 조회 영역 */}
        <section className={styles.section}>
          {!hasTracking ? (
            <p className={styles.notice}>아직 발송 전입니다. (운송장 미등록)</p>
          ) : isLoading ? (
            <p className={styles.notice}>배송 정보를 불러오는 중…</p>
          ) : isError || !tracking ? (
            <div className={styles.errorState}>
              <p className={styles.notice}>배송 조회에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
              <button type="button" className={styles.ghostBtn} onClick={() => refetch()}>
                다시 시도
              </button>
            </div>
          ) : (
            <>
              <div className={styles.summary}>
                <span className={styles.carrier}>{tracking.carrierName}</span>
                <span className={styles.invNo}>{tracking.trackingNumber}</span>
                <span className={styles.status}>{tracking.status}</span>
              </div>
              <ul className={styles.timeline}>
                {tracking.tracks.length === 0 ? (
                  <li className={styles.notice}>등록된 배송 이력이 없습니다.</li>
                ) : (
                  [...tracking.tracks].reverse().map((t, i) => (
                    <li key={i} className={styles.event}>
                      <span className={styles.time}>{t.time}</span>
                      <span className={styles.location}>{t.location}</span>
                      <span className={styles.desc}>{t.description}</span>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </section>

        {/* ② 수정 영역 */}
        {hasTracking && (
          <section className={styles.editSection}>
            <h4 className={styles.editTitle}>운송장 수정</h4>
            <div className={styles.editRow}>
              <select
                className={styles.select}
                value={carrierCode}
                onChange={(e) => setCarrierCode(e.target.value)}
              >
                {couriers.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                className={styles.input}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="운송장 번호"
              />
            </div>
            <div className={styles.editButtons}>
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!dirty || !trackingNumber.trim() || !carrierCode}
                onClick={() => setConfirmOpen(true)}
              >
                수정완료
              </button>
              <button type="button" className={styles.ghostBtn} onClick={resetEdit}>
                취소
              </button>
            </div>
          </section>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        message="정말로 운송장을 변경하시겠습니까?"
        desc="변경 시 고객에게 노출되는 운송장 정보가 즉시 갱신됩니다."
        confirmLabel="변경"
        cancelLabel="취소"
        pending={updateMut.isPending}
        pendingLabel="변경 중…"
        onConfirm={doUpdate}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
