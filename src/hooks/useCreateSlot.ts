import { useMutation } from "@tanstack/react-query"
import { createSlot } from "@/lib/api"

export function useCreateSlot() {
  return useMutation({
    mutationFn: createSlot,
  })
}
