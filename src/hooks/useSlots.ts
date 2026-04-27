import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/lib/api";

export function useSlots() {
  return useQuery({
    queryKey: ["slots"],
    queryFn: getSlots,
  });
}
