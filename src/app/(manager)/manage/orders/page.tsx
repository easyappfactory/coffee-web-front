"use client"

import { useState, useMemo } from "react"
import { Download, Upload, Search, Clock } from "lucide-react"
import type { AdminOrder, AdminOrderTab, SlotPhase } from "@/types/adminOrder"
import {
  MOCK_ADMIN_SLOTS,
  MOCK_ADMIN_ORDERS,
  MOCK_ADMIN_SUMMARIES,
} from "@/lib/mock/adminOrders"
import { SlotSelect } from "@/components/manager/SlotSelect"
import { SlotStatStrip } from "@/components/manager/SlotStatStrip"
import { OrdersTable } from "@/components/manager/OrdersTable"
import styles from "./orders.module.css"

const PER_PAGE = 8

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------
const ALL_TABS: {
  key: AdminOrderTab
  label: string
  alert?: boolean
}[] = [
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
  OPERATING: ["all", "pre", "post", "cancel", "exchange"],
  CLOSED: ["all", "post", "cancel", "exchange"],
  FAILED: ["all", "cancel"],
}

// ---------------------------------------------------------------------------
// Tab matching logic — mirrors design's matchTab
// ---------------------------------------------------------------------------
function matchTab(order: AdminOrder, tab: AdminOrderTab): boolean {
  switch (tab) {
    case "all":
      return true
    case "funding":
      return order.deliveryStatus === "funding"
    case "cancel":
      return order.deliveryStatus === "cancel"
    case "exchange":
      return order.deliveryStatus === "exchange"
    case "pre":
      return (
        order.deliveryStatus !== "funding" &&
        !order.trackingNumber &&
        order.deliveryStatus !== "cancel" &&
        order.deliveryStatus !== "exchange"
      )
    case "post":
      return (
        !!order.trackingNumber &&
        order.deliveryStatus !== "cancel" &&
        order.deliveryStatus !== "exchange"
      )
    default:
      return true
  }
}

// ---------------------------------------------------------------------------
// Phase badge class map
// ---------------------------------------------------------------------------
const PHASE_BADGE_CLASS: Record<SlotPhase, string> = {
  PRE: styles.phPRE,
  FUNDING: styles.phFUNDING,
  OPERATING: styles.phOPERATING,
  CLOSED: styles.phCLOSED,
  FAILED: styles.phFAILED,
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ManageOrdersPage() {
  // Start on the FUNDING slot so main content is visible immediately
  const [slotId, setSlotId] = useState(MOCK_ADMIN_SLOTS[0].slotId)
  const [tab, setTab] = useState<AdminOrderTab>("all")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const slot = MOCK_ADMIN_SLOTS.find((s) => s.slotId === slotId)!
  const orders = MOCK_ADMIN_ORDERS[slotId] ?? []
  const summary = MOCK_ADMIN_SUMMARIES[slotId]!

  const visibleTabs = ALL_TABS.filter((t) =>
    PHASE_TABS[slot.phase].includes(t.key),
  )

  // Per-tab counts
  const counts = useMemo(() => {
    const c: Partial<Record<AdminOrderTab, number>> = {}
    ALL_TABS.forEach((t) => {
      c[t.key] = orders.filter((o) => matchTab(o, t.key)).length
    })
    return c
  }, [orders])

  // Filtered + searched rows
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (!matchTab(o, tab)) return false
      if (!q) return true
      return [
        o.orderNo,
        o.receiverName,
        o.receiverPhone,
        o.trackingNumber,
        o.address,
        o.addressDetail,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
  }, [orders, tab, query])

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

      {/* Slot selector + phase badge */}
      <div className={styles.slotbar}>
        <SlotSelect
          slots={MOCK_ADMIN_SLOTS}
          value={slotId}
          onChange={handleSlotChange}
        />
        <span
          className={`${styles.phaseBadge} ${PHASE_BADGE_CLASS[slot.phase]}`}
        >
          {slot.phaseLabel}
        </span>
      </div>

      {/* Stat strip — phase-aware */}
      <SlotStatStrip slot={slot} summary={summary} />

      {/* PRE → empty state card */}
      {isPre ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIc}>
              <Clock size={26} />
            </div>
            <h4>아직 펀딩이 시작되지 않았습니다</h4>
            <p>
              {slot.deadline} 펀딩이 오픈되면 주문 내역이 이곳에
              표시됩니다.
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
                  <span className={styles.cnt}>{counts[t.key] ?? 0}</span>
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

          {/* Orders table
              단건 등록/수정·일괄선택바·배송조회팝업·송장모달은 다음 슬라이스 */}
          <OrdersTable
            orders={filtered}
            selected={selected}
            setSelected={setSelected}
            page={page}
            setPage={setPage}
            perPage={PER_PAGE}
          />
        </>
      )}

      {/* Toast container — 추후 액션 피드백용 */}
      <div className={styles.toastWrap} aria-live="polite" />
    </>
  )
}
