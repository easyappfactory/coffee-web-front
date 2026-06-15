import type { AdminSlot, AdminSlotSummary } from "@/types/adminOrder"
import { won } from "@/lib/format"
import styles from "./SlotStatStrip.module.css"

interface SlotStatStripProps {
  slot: AdminSlot
  summary: AdminSlotSummary
}

export function SlotStatStrip({ slot, summary }: SlotStatStripProps) {
  const { phase } = slot

  /* PRE — no orders yet, show simple placeholder */
  if (phase === "PRE") {
    return (
      <div className={styles.prePanel}>
        <span className={styles.preDot} />
        펀딩이 시작되면 주문 통계가 이곳에 표시됩니다.
      </div>
    )
  }

  /* FUNDING — actively implemented */
  if (phase === "FUNDING") {
    return (
      <div className={styles.statstrip}>
        {/* Metric 1: 펀딩 주문 수 */}
        <div className={styles.metric}>
          <div className={styles.mLabel}>
            <span className={styles.dot} style={{ background: "#C2683C" }} />
            펀딩 주문
          </div>
          {/* TODO(api): 달성률·목표금액·D-day 막대 미제공 → 주문 건수만 표시 */}
          <div className={styles.mValue}>
            {summary.fundingCount}
            <span className={styles.u}>건</span>
          </div>
          <div className={styles.mSub}>펀딩 참여 주문</div>
        </div>

        {/* Metric 2: 펀딩 금액 */}
        <div className={styles.metric}>
          <div className={styles.mLabel}>펀딩 금액</div>
          <div className={`${styles.mValue} ${styles.mValueAmount}`}>
            {won(summary.revenue)}
          </div>
          <div className={styles.mSub}>취소 건 제외</div>
        </div>

        {/* Metric 3: 마감일 */}
        <div className={styles.metric}>
          <div className={styles.mLabel}>마감일</div>
          <div className={`${styles.mValue} ${styles.mValueMuted}`}>
            {summary.deadline}
          </div>
          <div className={styles.mSub}>펀딩 마감 예정</div>
        </div>
      </div>
    )
  }

  /* OPERATING / CLOSED / FAILED — skeleton placeholder (다음 슬라이스에서 완성) */
  return (
    <div className={styles.skelWrap}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={styles.skelMetric}>
          <div className={`${styles.skelLine} ${styles.skelLineNarrow}`} />
          <div className={`${styles.skelLine} ${styles.skelLineWide}`} />
          <div className={`${styles.skelLine} ${styles.skelLineNarrow}`} />
        </div>
      ))}
    </div>
  )
}
