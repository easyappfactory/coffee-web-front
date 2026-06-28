"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Upload, Search, Clock } from "lucide-react"
import type {
  AdminOrderTab,
  SlotPhase,
  AdminSlotSummary,
} from "@/types/adminOrder"
import { POC_USERS } from "@/lib/api"
import {
  useAdminSlots,
  useAdminSlotSummary,
  useAdminSlotOrders,
  useSlotFundingStatus,
  useSlotPhaseTransition,
  useShipOrder,
  useCouriers,
} from "@/hooks/useAdminOrders"
import { SlotSelect } from "@/components/manager/SlotSelect"
import { SlotStatStrip } from "@/components/manager/SlotStatStrip"
import { OrdersTable } from "@/components/manager/OrdersTable"
import { StartFundingAlert } from "@/components/manager/StartFundingAlert"
import { FundingPendingModal } from "@/components/manager/FundingPendingModal"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import styles from "./orders.module.css"

const PER_PAGE = 8

const ALL_TABS: { key: AdminOrderTab; label: string; alert?: boolean }[] = [
  { key: "all", label: "전체" },
  { key: "funding", label: "펀딩 중" },
  { key: "pre", label: "송장 등록 전", alert: true },
  { key: "post", label: "송장 등록 완료" },
  { key: "cancel", label: "취소·환불" },
  { key: "exchange", label: "교환" },
]

const PHASE_TABS: Record<SlotPhase, AdminOrderTab[]> = {
  PRE: [],
  FUNDING: ["all", "funding", "cancel"],
  PENDING: ["all", "funding", "cancel"],
  OPERATING: ["all", "pre", "post", "cancel", "exchange"],
  CLOSED: ["all", "post", "cancel", "exchange"],
  FAILED: ["all", "cancel"],
}

const PHASE_BADGE_CLASS: Record<SlotPhase, string> = {
  PRE: styles.phPRE,
  FUNDING: styles.phFUNDING,
  PENDING: styles.phPENDING,
  OPERATING: styles.phOPERATING,
  CLOSED: styles.phCLOSED,
  FAILED: styles.phFAILED,
}

// 탭 배지 건수 — 통계(summary)에서 도출 (목록 응답엔 탭별 건수가 없음)
function tabCount(tab: AdminOrderTab, s?: AdminSlotSummary): number {
  if (!s) return 0
  switch (tab) {
    case "all":
      return s.totalCount
    case "funding":
      return s.fundingCount
    case "pre":
      return s.preCount
    case "post":
      return s.postCount
    case "cancel":
      return s.cancelCount
    case "exchange":
      return s.exchangeCount
    default:
      return 0
  }
}

export default function ManageOrdersPage() {
  // 매니저 POC 사용자 지정 (admin 엔드포인트 X-User-Id 헤더)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pocUserId", POC_USERS.MANAGER)
    }
  }, [])

  const slotsQuery = useAdminSlots()
  const slots = useMemo(() => slotsQuery.data ?? [], [slotsQuery.data])

  const [slotId, setSlotId] = useState<string | undefined>(undefined)
  const [tab, setTab] = useState<AdminOrderTab>("all")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1) // 1-base (UI)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // 슬롯 로드되면 기본 선택 — 펀딩(FUNDING) 슬롯 우선, 없으면 첫 슬롯
  useEffect(() => {
    if (!slotId && slots.length > 0) {
      const funding = slots.find((s) => s.phase === "FUNDING")
      setSlotId((funding ?? slots[0]).slotId)
    }
  }, [slots, slotId])

  const slot = slots.find((s) => s.slotId === slotId)
  const summaryQuery = useAdminSlotSummary(slotId)
  const summary = summaryQuery.data
  const ordersQuery = useAdminSlotOrders(
    slotId,
    tab,
    query.trim() || undefined,
    page - 1
  )
  const ordersPage = ordersQuery.data

  // 펀딩 상태 (FUNDING/PENDING 시 isTerminatable 등 확인용)
  const fundingStatusQuery = useSlotFundingStatus(slotId)
  const fundingStatus = fundingStatusQuery.data

  // 상태 전이 뮤테이션
  const phaseTransition = useSlotPhaseTransition(slotId ?? "")
  const shipOrder = useShipOrder(slotId ?? "")
  const couriersQuery = useCouriers()

  // 모달 open 상태
  const [startAlertOpen, setStartAlertOpen] = useState(false)
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false)

  // PENDING 축하 모달: 슬롯별 1회성 억제
  const [pendingModalDismissed, setPendingModalDismissed] = useState<
    Set<string>
  >(new Set())
  const pendingModalOpen =
    !!slot &&
    slot.phase === "PENDING" &&
    !pendingModalDismissed.has(slot.slotId)

  function handlePendingModalClose() {
    if (slotId)
      setPendingModalDismissed(
        (prev) => new Set(Array.from(prev).concat(slotId))
      )
  }

  const visibleTabs = slot
    ? ALL_TABS.filter((t) => PHASE_TABS[slot.phase].includes(t.key))
    : []

  function handleSlotChange(id: string) {
    setSlotId(id)
    setTab("all")
    setQuery("")
    setPage(1)
    setSelected(new Set())
  }

  function handleTabChange(key: AdminOrderTab) {
    setTab(key)
    setPage(1)
    setSelected(new Set())
  }

  if (slotsQuery.isLoading) {
    return <div className={styles.loading}>슬롯을 불러오는 중…</div>
  }
  if (slotsQuery.isError) {
    return <div className={styles.loading}>슬롯을 불러오지 못했습니다.</div>
  }
  if (!slot) {
    return <div className={styles.loading}>표시할 슬롯이 없습니다.</div>
  }

  const isPre = slot.phase === "PRE"

  return (
    <>
      {/* Page head */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>주문 및 배송 관리</h1>
          <p className={styles.pageSub}>
            슬롯을 선택해 주문 내역을 확인하고, 엑셀 다운로드·송장 일괄등록으로
            배송을 처리하세요.
          </p>
        </div>
        <div className={styles.headBtns}>
          {/* 기능은 다음 슬라이스에서 구현 — disabled */}
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            disabled
          >
            <Download size={18} />
            엑셀 다운로드
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled
            title="송장 등록은 펀딩 완료 후 배송·운영 단계에서 가능합니다"
          >
            <Upload size={18} />
            송장번호 일괄등록
          </button>
        </div>
      </div>

      {/* Slot selector + phase badge + 상태 전이 버튼 */}
      <div className={styles.slotbar}>
        <SlotSelect
          slots={slots}
          value={slot.slotId}
          onChange={handleSlotChange}
        />
        <span
          className={`${styles.phaseBadge} ${PHASE_BADGE_CLASS[slot.phase]}`}
        >
          {slot.phaseLabel}
        </span>

        <div className={styles.slotbarActions}>
          {/* PRE → 펀딩 바로 시작 */}
          {slot.phase === "PRE" && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setStartAlertOpen(true)}
            >
              펀딩 바로 시작
            </button>
          )}

          {/* FUNDING → 임의 마감 (isTerminatable일 때만) */}
          {slot.phase === "FUNDING" && fundingStatus?.isTerminatable && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => setStopConfirmOpen(true)}
            >
              임의 마감
            </button>
          )}

          {/* PENDING → 펀딩 확정 + 실패 처리 */}
          {slot.phase === "PENDING" && (
            <>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={phaseTransition.confirmFunding.isPending}
                onClick={() => phaseTransition.confirmFunding.mutate()}
              >
                {phaseTransition.confirmFunding.isPending
                  ? "처리 중…"
                  : "펀딩 확정"}
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                disabled={phaseTransition.failFunding.isPending}
                onClick={() => phaseTransition.failFunding.mutate()}
              >
                {phaseTransition.failFunding.isPending
                  ? "처리 중…"
                  : "실패 처리"}
              </button>
            </>
          )}

          {/* OPERATING → 출고 시작 (FUNDING_SUCCESS 주문 일괄 배송 준비 전환) */}
          {slot.phase === "OPERATING" && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={phaseTransition.startShipping.isPending}
              onClick={() =>
                phaseTransition.startShipping.mutate(undefined, {
                  onSuccess: (count) =>
                    alert(`${count}건 출고를 시작했습니다. (배송 준비 전환)`),
                })
              }
            >
              {phaseTransition.startShipping.isPending
                ? "처리 중…"
                : "출고 시작"}
            </button>
          )}
        </div>
      </div>

      {/* Stat strip — phase-aware (summary 로드 후) */}
      {summary && <SlotStatStrip slot={slot} summary={summary} />}

      {/* PRE → empty state card */}
      {isPre ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIc}>
              <Clock size={26} />
            </div>
            <h4>아직 펀딩이 시작되지 않았습니다</h4>
            <p>
              {slot.deadline} 펀딩이 오픈되면 주문 내역이 이곳에 표시됩니다.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Toolbar: tabs + search */}
          <div className={styles.toolbar}>
            <div className={styles.tabs}>
              {visibleTabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={[
                    styles.tab,
                    tab === t.key ? styles.tabActive : "",
                    t.alert ? styles.tabAlert : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleTabChange(t.key)}
                >
                  {t.label}{" "}
                  <span className={styles.cnt}>{tabCount(t.key, summary)}</span>
                </button>
              ))}
            </div>

            <div className={styles.search}>
              <Search size={17} className={styles.searchIco} />
              <input
                type="search"
                placeholder="주문번호 · 주문자 · 전화 · 송장번호 검색"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>

          {/* Orders table — 서버 페이징 (단건/일괄/배송조회 팝업은 다음 슬라이스) */}
          {ordersQuery.isError ? (
            <div className={styles.loading}>주문을 불러오지 못했습니다.</div>
          ) : (
            <OrdersTable
              orders={ordersPage?.orders ?? []}
              selected={selected}
              setSelected={setSelected}
              page={page}
              setPage={setPage}
              perPage={PER_PAGE}
              totalCount={ordersPage?.totalCount ?? 0}
              totalPages={ordersPage?.totalPages ?? 1}
              shippingOrderId={shipOrder.isPending ? shipOrder.variables?.orderId ?? null : null}
              couriers={couriersQuery.data ?? []}
              onShip={(orderId, trackingNumber, carrierCode) =>
                shipOrder.mutate(
                  { orderId, trackingNumber, carrierCode },
                  {
                    onError: () =>
                      alert("송장 등록에 실패했습니다. 다시 시도해주세요."),
                  },
                )
              }
            />
          )}
        </>
      )}

      {/* Toast container — 추후 액션 피드백용 */}
      <div className={styles.toastWrap} aria-live="polite" />

      {/* ── 모달 ─────────────────────────────────────────────────────────────── */}

      {/* PRE: 펀딩 시작 경고 모달 */}
      <StartFundingAlert
        open={startAlertOpen}
        onClose={() => setStartAlertOpen(false)}
        mutation={phaseTransition.startFunding}
      />

      {/* FUNDING: 임의 마감 확인 모달 */}
      <ConfirmDialog
        open={stopConfirmOpen}
        message={
          <>
            모집을 중단하고 <b>확정 대기</b> 단계로 넘어갑니다.
          </>
        }
        desc="마감하면 더 이상 새로운 주문을 받지 않으며, 목표 달성 여부에 따라 확정 또는 실패로 처리됩니다."
        cancelLabel="취소"
        confirmLabel="임의 마감"
        pending={phaseTransition.stopFunding.isPending}
        pendingLabel="처리 중…"
        onCancel={() => setStopConfirmOpen(false)}
        onConfirm={() =>
          phaseTransition.stopFunding.mutate(undefined, {
            onSuccess: () => setStopConfirmOpen(false),
          })
        }
      />

      {/* PENDING: 축하 모달 (1회성, 바깥 클릭으로 닫힘) */}
      <FundingPendingModal
        open={pendingModalOpen}
        onClose={handlePendingModalClose}
      />
    </>
  )
}
