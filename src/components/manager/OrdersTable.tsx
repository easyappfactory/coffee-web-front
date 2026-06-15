"use client"

import { ArrowUpRight, Search } from "lucide-react"
import type { AdminOrder } from "@/types/adminOrder"
import { won } from "@/lib/format"
import styles from "./OrdersTable.module.css"

interface OrdersTableProps {
  orders: AdminOrder[]
  selected: Set<string>
  setSelected: (s: Set<string>) => void
  page: number
  setPage: (p: number) => void
  perPage: number
}

type CbxState = "on" | "off" | "mixed"

function Cbx({
  state,
  onClick,
}: {
  state: CbxState
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`${styles.cbx}${state === "on" ? ` ${styles.cbxOn}` : ""}${state === "mixed" ? ` ${styles.cbxMixed}` : ""}`}
      onClick={onClick}
      aria-checked={state === "on"}
    >
      {state === "on" && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {state === "mixed" && (
        <div
          style={{
            width: 9,
            height: 2.5,
            background: "#fff",
            borderRadius: 2,
          }}
        />
      )}
    </button>
  )
}

export function OrdersTable({
  orders,
  selected,
  setSelected,
  page,
  setPage,
  perPage,
}: OrdersTableProps) {
  const allIds = orders.map((o) => o.orderId)
  const selCount = allIds.filter((id) => selected.has(id)).length
  const headState: CbxState =
    selCount === 0 ? "off" : selCount === allIds.length ? "on" : "mixed"

  const toggleAll = () => {
    const next = new Set(selected)
    if (headState === "on") {
      allIds.forEach((id) => next.delete(id))
    } else {
      allIds.forEach((id) => next.add(id))
    }
    setSelected(next)
  }

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / perPage))
  const start = (page - 1) * perPage
  const rows = orders.slice(start, start + perPage)

  return (
    <div className={styles.tableCard}>
      <div className={styles.tblScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colCheck}>
                <Cbx state={headState} onClick={toggleAll} />
              </th>
              <th>주문번호 / 주문일시</th>
              <th>주문자</th>
              <th>배송지</th>
              <th>주문상품 / 옵션</th>
              <th>배송메모</th>
              <th>송장정보 / 배송조회</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIc}>
                      <Search size={24} />
                    </div>
                    <h4>해당하는 주문이 없습니다</h4>
                    <p>다른 상태 필터나 검색어로 다시 시도해 보세요.</p>
                  </div>
                </td>
              </tr>
            )}
            {rows.map((o) => {
              const on = selected.has(o.orderId)
              return (
                <tr key={o.orderId} className={on ? styles.rowSel : undefined}>
                  <td className={styles.colCheck}>
                    <Cbx
                      state={on ? "on" : "off"}
                      onClick={() => toggle(o.orderId)}
                    />
                  </td>

                  {/* 주문번호 / 주문일시 */}
                  <td>
                    <div className={styles.ono}>{o.orderNo}</div>
                    <div className={styles.odate}>
                      {o.orderedAt.replace("T", " ").slice(0, 16)}
                    </div>
                  </td>

                  {/* 주문자 */}
                  <td>
                    <div className={styles.custNm}>{o.receiverName ?? "—"}</div>
                    <div className={styles.custPh}>{o.receiverPhone ?? "—"}</div>
                  </td>

                  {/* 배송지 */}
                  <td>
                    <div className={styles.addr}>
                      <span className={styles.zip}>[{o.zipcode}]</span>{" "}
                      {o.address}
                      <br />
                      {o.addressDetail}
                    </div>
                  </td>

                  {/* 주문상품 / 옵션 */}
                  <td>
                    <div className={styles.prodNm}>{o.productName}</div>
                    {o.optionSummary && (
                      <div>
                        <span className={styles.prodOpt}>{o.optionSummary}</span>
                      </div>
                    )}
                    <span className={styles.qty}>
                      수량 {o.quantity}개 · {won(o.payAmount)}
                    </span>
                  </td>

                  {/* 배송메모 */}
                  <td>
                    <div
                      className={`${styles.memo}${o.memo ? "" : ` ${styles.memoEmpty}`}`}
                    >
                      {o.memo ?? "—"}
                    </div>
                  </td>

                  {/* 송장정보 / 배송조회 */}
                  <td>
                    {o.trackingNumber ? (
                      <>
                        <div className={styles.invCourier}>{o.courier}</div>
                        {/* 단순 표시만 — 배송조회 팝업은 다음 슬라이스 */}
                        <div className={styles.invNo}>
                          <button className={styles.trackBtn} type="button">
                            {o.trackingNumber}
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.invEmpty}>미등록</div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className={styles.tblFoot}>
        <div>
          전체{" "}
          <strong style={{ color: "var(--d-ink)" }}>{orders.length}</strong>건
          중{" "}
          {orders.length === 0
            ? "0"
            : `${start + 1}–${Math.min(start + perPage, orders.length)}`}
          건 표시
        </div>
        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pagerBtn}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pagerBtn}${p === page ? ` ${styles.pagerBtnOn}` : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={styles.pagerBtn}
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
