import { useQuery } from "@tanstack/react-query"
import { getMySlots } from "@/lib/api"
import type { MySlot } from "@/types/mySlot"

export function useMySlots() {
  return useQuery<MySlot[]>({
    queryKey: ["mySlots"],
    queryFn: getMySlots,
  })
}
