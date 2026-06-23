"use client"

import { Dialog } from "@/components/ui/dialog"
import type { UseMutationResult } from "@tanstack/react-query"

interface StartFundingAlertProps {
  open: boolean
  onClose: () => void
  mutation: UseMutationResult<void, Error, void, unknown>
}

export function StartFundingAlert({ open, onClose, mutation }: StartFundingAlertProps) {
  function handleStart() {
    mutation.mutate(undefined, { onSuccess: () => onClose() })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="px-6 py-10 flex flex-col items-center gap-8">
        <p className="text-center text-base font-medium leading-relaxed text-foreground">
          펀딩을 시작하시면 슬롯 내용은 더이상 수정이{" "}
          <span className="text-destructive font-bold">불가</span>합니다.
        </p>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground bg-muted hover:bg-muted/80 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={mutation.isPending}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "처리 중…" : "펀딩 시작"}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
