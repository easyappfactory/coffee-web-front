"use client"

import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import type { UseMutationResult } from "@tanstack/react-query"

interface StartFundingAlertProps {
  open: boolean
  onClose: () => void
  mutation: UseMutationResult<void, Error, void, unknown>
}

export function StartFundingAlert({
  open,
  onClose,
  mutation,
}: StartFundingAlertProps) {
  function handleStart() {
    mutation.mutate(undefined, { onSuccess: () => onClose() })
  }

  return (
    <ConfirmDialog
      open={open}
      message={
        <>
          펀딩을 시작하시면 슬롯 내용은 더이상 <b>수정이 불가</b>합니다.
        </>
      }
      desc="시작 후에는 상품·가격·옵션·펀딩 기간을 변경할 수 없습니다."
      cancelLabel="취소"
      confirmLabel="펀딩 시작"
      pending={mutation.isPending}
      pendingLabel="처리 중…"
      onCancel={onClose}
      onConfirm={handleStart}
    />
  )
}
