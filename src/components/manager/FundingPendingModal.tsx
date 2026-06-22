"use client"

import { Dialog } from "@/components/ui/dialog"

interface FundingPendingModalProps {
  open: boolean
  onClose: () => void
}

export function FundingPendingModal({ open, onClose }: FundingPendingModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="px-8 py-12 flex flex-col items-center gap-5">
        <p className="text-center text-base font-semibold leading-relaxed text-foreground whitespace-pre-line">
          {"펀딩 성공을 축하드립니다!\n주문 정보를 확인하고 주문 확정을 진행해주세요."}
        </p>
      </div>
    </Dialog>
  )
}
