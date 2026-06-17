import type {
  AdminSlot,
  AdminOrder,
  AdminSlotSummary,
} from "@/types/adminOrder"

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------
export const MOCK_ADMIN_SLOTS: AdminSlot[] = [
  {
    slotId: "slot-funding-1",
    productId: "prod-001",
    name: "에티오피아 예가체프 G1 워시드",
    phase: "FUNDING",
    phaseLabel: "펀딩 중",
    deadline: "2026-07-10",
  },
  {
    slotId: "slot-operating-1",
    productId: "prod-002",
    name: "케냐 AA 나이로비 풀워시드",
    phase: "OPERATING",
    phaseLabel: "운영 중",
    deadline: "2026-07-31",
  },
  {
    slotId: "slot-operating-2",
    productId: "prod-003",
    name: "콜롬비아 수프리모 나리뇨",
    phase: "OPERATING",
    phaseLabel: "운영 중",
    deadline: "2026-08-15",
  },
  {
    slotId: "slot-pre-1",
    productId: "prod-004",
    name: "브라질 세하도 내추럴",
    phase: "PRE",
    phaseLabel: "펀딩 전",
    deadline: "2026-08-01",
  },
  {
    slotId: "slot-closed-1",
    productId: "prod-005",
    name: "과테말라 안티구아 허니",
    phase: "CLOSED",
    phaseLabel: "종료",
    deadline: "2026-05-20",
  },
]

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function o(
  orderId: string,
  orderNo: string,
  orderedAt: string,
  receiverName: string,
  receiverPhone: string,
  zipcode: string,
  address: string,
  addressDetail: string,
  productName: string,
  optionSummary: string,
  quantity: number,
  payAmount: number,
  deliveryStatus: string,
  memo: string | null = null,
  courier: string | null = null,
  trackingNumber: string | null = null,
): AdminOrder {
  return {
    orderId,
    orderNo,
    orderedAt,
    receiverName,
    receiverPhone,
    zipcode,
    address,
    addressDetail,
    productName,
    optionSummary,
    quantity,
    payAmount,
    memo,
    courier,
    trackingNumber,
    hasTracking: !!trackingNumber,
    deliveryStatus,
    sellerDisplay: productName,
  }
}

// ---------------------------------------------------------------------------
// Orders — FUNDING slot (12 funding + 2 cancel = 14)
// ---------------------------------------------------------------------------
const FUNDING_PRODUCT = "에티오피아 예가체프 G1 워시드"

const fundingOrders: AdminOrder[] = [
  o("ord-f-01", "BM-2026-010001", "2026-06-10T10:02:33", "김지수", "010-3842-5510", "04523", "서울 중구 명동길 14", "명동아파트 201호", FUNDING_PRODUCT, "200g · 원두", 2, 56000, "funding", "문앞에 놔주세요"),
  o("ord-f-02", "BM-2026-010002", "2026-06-10T11:17:08", "이민준", "010-7651-2244", "06234", "서울 강남구 테헤란로 152", "강남빌딩 1002호", FUNDING_PRODUCT, "200g · 분쇄 중간", 1, 28000, "funding", null),
  o("ord-f-03", "BM-2026-010003", "2026-06-10T13:44:51", "박서연", "010-9023-6677", "16513", "경기 수원시 팔달구 효원로 307", "수원타워 B동 505호", FUNDING_PRODUCT, "500g · 원두", 1, 68000, "funding", "부재시 경비실 맡겨주세요"),
  o("ord-f-04", "BM-2026-010004", "2026-06-11T08:55:20", "최윤아", "010-2234-8899", "48058", "부산 해운대구 센텀중앙로 79", "센텀파크 303동 1501호", FUNDING_PRODUCT, "200g · 분쇄 가늘게", 1, 28000, "funding", null),
  o("ord-f-05", "BM-2026-010005", "2026-06-11T14:30:00", "정하준", "010-5566-7788", "34128", "대전 유성구 대학로 99", "KAIST 기숙사 A동 301호", FUNDING_PRODUCT, "200g · 원두", 3, 84000, "funding", "빠른 배송 부탁드립니다"),
  o("ord-f-06", "BM-2026-010006", "2026-06-11T16:21:09", "강다은", "010-8899-1122", "61473", "광주 북구 첨단과기로 208", "광주테크노파크 오피스텔 702호", FUNDING_PRODUCT, "500g · 분쇄 중간", 1, 68000, "funding", null),
  o("ord-f-07", "BM-2026-010007", "2026-06-12T09:05:44", "윤성민", "010-3344-5566", "22345", "인천 연수구 컨벤시아대로 204", "인천 스마트시티 아파트 12동 802호", FUNDING_PRODUCT, "200g · 원두", 2, 56000, "funding", null),
  o("ord-f-08", "BM-2026-010008", "2026-06-12T11:48:32", "임지현", "010-7788-9900", "41566", "대구 북구 칠곡중앙대로 594", "칠곡푸르지오 203동 1104호", FUNDING_PRODUCT, "500g · 원두", 2, 136000, "funding", "경비실 맡겨 주세요"),
  o("ord-f-09", "BM-2026-010009", "2026-06-12T15:02:18", "오현우", "010-1122-3344", "06292", "서울 강남구 언주로 211", "역삼역 메트로시티 1601호", FUNDING_PRODUCT, "200g · 분쇄 굵게", 1, 28000, "funding", null),
  o("ord-f-10", "BM-2026-010010", "2026-06-13T08:30:05", "한소희", "010-6677-8899", "03082", "서울 종로구 경희궁길 35", "경희궁 아파트 4동 202호", FUNDING_PRODUCT, "200g · 원두", 1, 28000, "funding", "직접 수령 예정"),
  o("ord-f-11", "BM-2026-010011", "2026-06-13T12:14:59", "송재현", "010-4455-6677", "30128", "세종 한솔동 한솔로 104", "세종 파크빌 804호", FUNDING_PRODUCT, "500g · 분쇄 중간", 1, 68000, "funding", null),
  o("ord-f-12", "BM-2026-010012", "2026-06-14T10:00:00", "류채원", "010-9900-1122", "05040", "서울 광진구 능동로 120", "건국대학교 푸르지오 시티 A동 1201호", FUNDING_PRODUCT, "200g · 원두", 2, 56000, "funding", null),
  // 취소 주문 2건
  o("ord-f-13", "BM-2026-010013", "2026-06-11T09:45:00", "신민서", "010-2211-3300", "13561", "경기 성남시 분당구 판교역로 235", "판교 알파돔시티 402호", FUNDING_PRODUCT, "200g · 원두", 1, 28000, "cancel", null),
  o("ord-f-14", "BM-2026-010014", "2026-06-12T17:00:00", "배준호", "010-5544-7766", "07336", "서울 영등포구 여의대로 66", "여의도 파크센터 2103호", FUNDING_PRODUCT, "500g · 원두", 1, 68000, "cancel", null),
]

// ---------------------------------------------------------------------------
// Orders — OPERATING slot 1 (mix of pre/post/cancel/exchange)
// ---------------------------------------------------------------------------
const OP1_PRODUCT = "케냐 AA 나이로비 풀워시드"

const operating1Orders: AdminOrder[] = [
  o("ord-o1-01", "BM-2026-009001", "2026-05-20T10:10:00", "이준혁", "010-1010-2020", "06181", "서울 강남구 삼성로 212", "삼성래미안 1003동 301호", OP1_PRODUCT, "200g · 원두", 1, 32000, "paid", null),
  o("ord-o1-02", "BM-2026-009002", "2026-05-20T11:30:00", "김보라", "010-3030-4040", "04537", "서울 중구 을지로 50", "페럼타워 2205호", OP1_PRODUCT, "200g · 분쇄 중간", 2, 64000, "paid", "부재시 문앞"),
  o("ord-o1-03", "BM-2026-009003", "2026-05-21T09:00:00", "박민서", "010-5050-6060", "14056", "경기 안양시 동안구 관양로 100", "관양 아이파크 504호", OP1_PRODUCT, "500g · 원두", 1, 78000, "shipped", null, "CJ대한통운", "551234567890"),
  o("ord-o1-04", "BM-2026-009004", "2026-05-21T14:45:00", "최재영", "010-7070-8080", "03141", "서울 종로구 새문안로 95", "광화문오피시아 1801호", OP1_PRODUCT, "200g · 원두", 1, 32000, "shipped", null, "롯데택배", "447788001234"),
  o("ord-o1-05", "BM-2026-009005", "2026-05-22T08:20:00", "정유진", "010-9090-1010", "16517", "경기 수원시 팔달구 매산로 14", "수원 더샵 1102호", OP1_PRODUCT, "500g · 분쇄 중간", 1, 78000, "cancel", "변심으로 취소요청"),
  o("ord-o1-06", "BM-2026-009006", "2026-05-22T13:30:00", "한예진", "010-2121-3232", "48730", "부산 강서구 명지오션시티 9로 100", "오션시티 파크 204동 805호", OP1_PRODUCT, "200g · 원두", 2, 64000, "paid", null),
]

// ---------------------------------------------------------------------------
// Orders — OPERATING slot 2
// ---------------------------------------------------------------------------
const OP2_PRODUCT = "콜롬비아 수프리모 나리뇨"

const operating2Orders: AdminOrder[] = [
  o("ord-o2-01", "BM-2026-008001", "2026-05-15T10:00:00", "김태양", "010-1234-5678", "08826", "서울 관악구 신림로 302", "신림 롯데캐슬 501호", OP2_PRODUCT, "200g · 원두", 1, 30000, "shipped", null, "한진택배", "223344556677"),
  o("ord-o2-02", "BM-2026-008002", "2026-05-15T11:20:00", "이수빈", "010-9876-5432", "04148", "서울 마포구 성암로 189", "마포 디지털미디어시티 오피스텔 1501호", OP2_PRODUCT, "500g · 분쇄 중간", 1, 72000, "shipped", null, "CJ대한통운", "998877665544"),
  o("ord-o2-03", "BM-2026-008003", "2026-05-16T09:15:00", "박지훈", "010-4321-8765", "35208", "대전 서구 둔산대로 100", "둔산 갤러리아 1001호", OP2_PRODUCT, "200g · 원두", 2, 60000, "paid", "경비실 맡겨주세요"),
  o("ord-o2-04", "BM-2026-008004", "2026-05-16T15:00:00", "최하은", "010-6543-2109", "34141", "대전 유성구 엑스포로 107", "엑스포 아파트 703호", OP2_PRODUCT, "200g · 분쇄 가늘게", 1, 30000, "exchange", null),
]

// ---------------------------------------------------------------------------
// Orders — PRE slot (none)
// ---------------------------------------------------------------------------
const preOrders: AdminOrder[] = []

// ---------------------------------------------------------------------------
// Orders — CLOSED slot
// ---------------------------------------------------------------------------
const CLOSED_PRODUCT = "과테말라 안티구아 허니"

const closedOrders: AdminOrder[] = [
  o("ord-c-01", "BM-2026-007001", "2026-05-01T09:00:00", "정우진", "010-1111-2222", "03965", "서울 마포구 월드컵북로 400", "월드컵 파크 아파트 5단지 1201호", CLOSED_PRODUCT, "200g · 원두", 1, 26000, "shipped", null, "CJ대한통운", "112233445566"),
  o("ord-c-02", "BM-2026-007002", "2026-05-01T10:30:00", "강민아", "010-3333-4444", "06305", "서울 강남구 남부순환로 2780", "도곡 렉슬 1705호", CLOSED_PRODUCT, "500g · 분쇄 중간", 1, 62000, "shipped", null, "롯데택배", "665544332211"),
  o("ord-c-03", "BM-2026-007003", "2026-05-02T08:00:00", "윤하늘", "010-5555-6666", "47399", "부산 북구 화명대로 40", "화명 롯데캐슬 203동 901호", CLOSED_PRODUCT, "200g · 원두", 2, 52000, "cancel", null),
  o("ord-c-04", "BM-2026-007004", "2026-05-02T13:45:00", "임도윤", "010-7777-8888", "28432", "충청북도 청주시 흥덕구 1순환로 395", "청주 아이파크 1402호", CLOSED_PRODUCT, "200g · 분쇄 굵게", 1, 26000, "shipped", null, "한진택배", "778899001122"),
]

// ---------------------------------------------------------------------------
// Aggregated
// ---------------------------------------------------------------------------
export const MOCK_ADMIN_ORDERS: Record<string, AdminOrder[]> = {
  "slot-funding-1": fundingOrders,
  "slot-operating-1": operating1Orders,
  "slot-operating-2": operating2Orders,
  "slot-pre-1": preOrders,
  "slot-closed-1": closedOrders,
}

// ---------------------------------------------------------------------------
// Summaries
// ---------------------------------------------------------------------------
function summarize(
  slotId: string,
  orders: AdminOrder[],
  slot: AdminSlot,
): AdminSlotSummary {
  const fundingCount = orders.filter((o) => o.deliveryStatus === "funding").length
  const preCount = orders.filter(
    (o) =>
      o.deliveryStatus !== "funding" &&
      !o.trackingNumber &&
      o.deliveryStatus !== "cancel" &&
      o.deliveryStatus !== "exchange",
  ).length
  const postCount = orders.filter(
    (o) =>
      !!o.trackingNumber &&
      o.deliveryStatus !== "cancel" &&
      o.deliveryStatus !== "exchange",
  ).length
  const cancelCount = orders.filter((o) => o.deliveryStatus === "cancel").length
  const exchangeCount = orders.filter((o) => o.deliveryStatus === "exchange").length
  const revenue = orders
    .filter((o) => o.deliveryStatus !== "cancel")
    .reduce((s, o) => s + o.payAmount, 0)

  return {
    slotId,
    phase: slot.phase,
    phaseLabel: slot.phaseLabel,
    totalCount: orders.length,
    fundingCount,
    preCount,
    postCount,
    cancelCount,
    exchangeCount,
    revenue,
    deadline: slot.deadline,
  }
}

export const MOCK_ADMIN_SUMMARIES: Record<string, AdminSlotSummary> =
  Object.fromEntries(
    MOCK_ADMIN_SLOTS.map((slot) => [
      slot.slotId,
      summarize(slot.slotId, MOCK_ADMIN_ORDERS[slot.slotId] ?? [], slot),
    ]),
  )
