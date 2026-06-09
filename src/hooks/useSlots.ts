import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/lib/api";
import { mockSlots } from "@/lib/mock/slots";
import type { Slot } from "@/types/slot";

/** 소비자 피드용 — 아직 mock (Slot 타입 UI에 맞춤) */
export function useSlots() {
  return useQuery<Slot[]>({
    queryKey: ["slots"],
    queryFn: async () => mockSlots,
  });
}

/** 매니저 슬롯 관리용 — 실제 API */
export function useMySlots() {
  const query = useQuery({
    queryKey: ["my-slots"],
    queryFn: () => getSlots(),
  });

  return {
    ...query,
    data: query.data?.items ?? [],
  };
}
