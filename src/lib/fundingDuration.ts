import { addMonths, addDays, differenceInCalendarDays, isSameDay } from "date-fns"

export type PeriodKey = "2w" | "1m" | "2m" | "3m" | "6m"

export function endDateFor(start: Date, key: PeriodKey): Date {
  switch (key) {
    case "2w":
      return addDays(start, 14)
    case "1m":
      return addMonths(start, 1)
    case "2m":
      return addMonths(start, 2)
    case "3m":
      return addMonths(start, 3)
    case "6m":
      return addMonths(start, 6)
  }
}

/**
 * "총 N개월" (addMonths 동일성으로 판단) 또는
 * "총 X주 Y일" (0일이면 "총 X주")
 */
export function describeFundingDuration(start: Date, end: Date): string {
  for (let m = 1; m <= 12; m++) {
    if (isSameDay(addMonths(start, m), end)) return `총 ${m}개월`
  }
  const days = differenceInCalendarDays(end, start)
  const w = Math.floor(days / 7)
  const r = days % 7
  return r === 0 ? `총 ${w}주` : `총 ${w}주 ${r}일`
}
