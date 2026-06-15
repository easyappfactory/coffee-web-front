/**
 * Format a number as KRW currency string.
 * Example: won(1234000) → "₩1,234,000"
 */
export function won(n: number): string {
  return "₩" + n.toLocaleString("ko-KR")
}
