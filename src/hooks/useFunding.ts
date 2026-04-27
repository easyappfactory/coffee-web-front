import { useQuery } from "@tanstack/react-query";
import { getSlotFunding } from "@/lib/api";

export function useFunding(slotId: string) {
  return useQuery({
    queryKey: ["funding", slotId],
    queryFn: () => getSlotFunding(slotId),
    enabled: !!slotId,
  });
}
