"use client"

import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { ko } from "date-fns/locale"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar(props: CalendarProps) {
  return <DayPicker locale={ko} showOutsideDays {...props} />
}
