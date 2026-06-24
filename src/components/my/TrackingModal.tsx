"use client"

import { useState } from "react"
import { Truck, Copy, Check } from "lucide-react"
import { Modal } from "@/components/common/Modal"
import modalStyles from "@/components/common/Modal.module.css"
import { useOrderTracking } from "@/hooks/useOrders"
import { Skeleton } from "@/components/ui/skeleton"
import styles from "./TrackingModal.module.css"

interface TrackingModalProps {
  open: boolean
  onClose: () => void
  orderId: string
  trackingNumber: string
}

export function TrackingModal({ open, onClose, orderId }: TrackingModalProps) {
  const { data: tracking, isLoading, isError } = useOrderTracking(orderId, open)
  const [copied, setCopied] = useState(false)

  function copyNo() {
    if (!tracking?.trackingNumber) return
    navigator.clipboard?.writeText(tracking.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Modal
      open={open}
      size="sm"
      title="배송 조회"
      desc="실시간 배송 현황입니다."
      onClose={onClose}
      footer={
        <>
          <span className={modalStyles.note}>
            배송 정보는 택배사 시스템과 연동되어 자동 갱신됩니다.
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
      {isLoading ? (
        <div className={styles.skel}>
          <Skeleton className="h-[78px] w-full rounded-[15px]" />
          <Skeleton className="h-5 w-40" />
          <div className={styles.skel}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className={styles.stateBox}>배송 정보를 불러올 수 없습니다.</div>
      ) : tracking ? (
        <>
          {/* 택배사 / 송장번호 카드 */}
          <div className={styles.trackCard}>
            <div className={styles.icoTile}>
              <Truck size={22} />
            </div>
            <div className={styles.tcMeta}>
              <div className={styles.tcCourier}>{tracking.carrierName}</div>
              <div className={styles.tcNo}>
                {tracking.trackingNumber}
                <button
                  type="button"
                  className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
                  onClick={copyNo}
                  title="송장번호 복사"
                  aria-label="송장번호 복사"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* 현재 배송상태 */}
          <div className={styles.statusRow}>
            <span className={styles.lab}>현재 배송상태</span>
            <span className={styles.badge}>
              <span className={styles.bdot} />
              {tracking.status}
            </span>
          </div>

          {/* 타임라인 */}
          {tracking.tracks.length > 0 ? (
            <div className={styles.timeline}>
              {tracking.tracks.map((track, index) => {
                if (!track) return null
                const isCurrent = index === 0
                const cls = [
                  styles.tlItem,
                  isCurrent ? styles.current : styles.done,
                ].join(" ")
                return (
                  <div key={index} className={cls}>
                    <div className={styles.tlRail}>
                      <div className={styles.tlNode} />
                      {index < tracking.tracks.length - 1 && (
                        <div className={styles.tlLine} />
                      )}
                    </div>
                    <div className={styles.tlBody}>
                      <div className={styles.tlTop}>
                        <span className={styles.tlLabel}>
                          {track.description}
                          {isCurrent && " · 최신"}
                        </span>
                        <span className={styles.tlTime}>{track.time}</span>
                      </div>
                      {track.location && (
                        <div className={styles.tlDesc}>{track.location}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.stateBox}>
              배송 추적 정보가 아직 없습니다.
            </div>
          )}
        </>
      ) : null}
    </Modal>
  )
}
