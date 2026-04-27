import { useQuery } from "@tanstack/react-query";
import { getSlotDetail } from "@/lib/api";

export function useSlotDetail(id: string) {
  return useQuery({
    queryKey: ["slot", id],
    queryFn: () => getSlotDetail(id),
    enabled: !!id,
  });
}
