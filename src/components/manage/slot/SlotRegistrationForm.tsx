"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { BookOpen, Coffee, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { StoryTab } from "./StoryTab"
import { FlavorTab } from "./FlavorTab"
import { PricingTab } from "./PricingTab"
import { FundingScheduleModal } from "./FundingScheduleModal"
import { useCreateSlot } from "@/hooks/useCreateSlot"
import type { SlotRegistrationFormData } from "@/types/slotRegistration"

const FORM_TABS = [
  { id: "story", label: "Story", icon: BookOpen },
  { id: "flavor", label: "Flavor", icon: Coffee },
  { id: "pricing", label: "Pricing", icon: CreditCard },
] as const

type FormTabId = (typeof FORM_TABS)[number]["id"]

export function SlotRegistrationForm() {
  const [activeTab, setActiveTab] = useState<FormTabId>("story")
  const [modalOpen, setModalOpen] = useState(false)
  const { mutate, isPending } = useCreateSlot()

  const methods = useForm<SlotRegistrationFormData>({
    defaultValues: {
      blendName: "",
      blendStory: "",
      hashtags: [],
      thumbnailFile: null,
      flavor: { acidity: 3, sweetness: 3, bitterness: 2, saltiness: 1, nutty: 2, roastLevel: 3 },
      pricingOptions: [
        {
          id: crypto.randomUUID(),
          weight: "200g",
          earlybird: 12000,
          second: 14500,
          final: 18000,
          minQuantity: 1,
          maxQuantity: 10,
        },
      ],
      fundingStartDate: "",
      fundingEndDate: "",
      minFundingAmount: 0,
      maxFundingAmount: null,
    },
  })

  const blendName = methods.watch("blendName") ?? ""
  const blendStory = methods.watch("blendStory") ?? ""
  const pricingOptions = methods.watch("pricingOptions") ?? []
  const minFundingAmount = methods.watch("minFundingAmount") ?? 0

  const isFormReady =
    blendName.trim().length > 0 &&
    blendStory.trim().length > 0 &&
    minFundingAmount >= 1 &&
    pricingOptions.length > 0 &&
    pricingOptions.every(
      (opt) =>
        (opt.weight ?? "").trim().length > 0 &&
        Number(opt.earlybird) > 0 &&
        Number(opt.second) > 0 &&
        Number(opt.final) > 0 &&
        Number(opt.minQuantity) > 0 &&
        Number(opt.maxQuantity) >= Number(opt.minQuantity),
    )

  function handleRegisterClick() {
    const values = methods.getValues()

    if (!values.blendName.trim() || !values.blendStory.trim()) {
      setActiveTab("story")
      alert("스토리 정보(블렌드명, 이야기)를 입력해주세요.")
      return
    }

    if (
      values.pricingOptions.length === 0 ||
      !values.pricingOptions.every(
        (opt) =>
          (opt.weight ?? "").trim().length > 0 &&
          Number(opt.earlybird) > 0 &&
          Number(opt.second) > 0 &&
          Number(opt.final) > 0 &&
          Number(opt.minQuantity) > 0 &&
          Number(opt.maxQuantity) >= Number(opt.minQuantity),
      )
    ) {
      setActiveTab("pricing")
      alert("가격 옵션을 올바르게 입력해주세요.")
      return
    }

    if (!values.minFundingAmount || values.minFundingAmount < 1) {
      setActiveTab("pricing")
      alert("최소 펀딩 금액을 1원 이상으로 입력해주세요.")
      return
    }

    if (
      values.maxFundingAmount !== null &&
      values.maxFundingAmount < values.minFundingAmount
    ) {
      setActiveTab("pricing")
      alert("최대 펀딩 금액이 최소 금액보다 작을 수 없습니다.")
      return
    }

    setModalOpen(true)
  }

  function handleModalConfirm({
    fundingStartDate,
    fundingEndDate,
  }: {
    fundingStartDate: string
    fundingEndDate: string
  }) {
    methods.setValue("fundingStartDate", fundingStartDate)
    methods.setValue("fundingEndDate", fundingEndDate)
    methods.handleSubmit(onSubmit)()
  }

  function onSubmit(data: SlotRegistrationFormData) {
    mutate(
      {
        blendName: data.blendName,
        blendStory: data.blendStory,
        hashtags: data.hashtags,
        flavor: data.flavor,
        fundingStartDate: data.fundingStartDate,
        deadline: data.fundingEndDate,
        minFundingAmount: data.minFundingAmount,
        maxFundingAmount: data.maxFundingAmount,
        pricingOptions: data.pricingOptions.map((opt) => ({
          weight: opt.weight,
          earlybird: opt.earlybird,
          second: opt.second,
          final: opt.final,
          minQuantity: opt.minQuantity,
          maxQuantity: opt.maxQuantity,
        })),
      },
      {
        onSuccess: () => {
          alert("슬롯이 등록되었습니다!")
          methods.reset()
          setModalOpen(false)
        },
      },
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* 고정 헤더: 타이틀 + 버튼 */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h3 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-ink-1">
              신규 블렌드 등록
            </h3>
            <p className="text-sm text-ink-muted">
              최고의 원두 이야기를 세상에 들려주세요.
            </p>
          </div>
          {isFormReady && !isPending ? (
            <div className="animate-border-spin shrink-0 rounded-xl p-[2px]">
              <button
                type="button"
                onClick={handleRegisterClick}
                className="relative rounded-[10px] bg-brand px-10 py-3 text-sm font-bold text-white transition-all active:scale-[0.97]"
              >
                블렌드 등록
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleRegisterClick}
              className="shrink-0 cursor-not-allowed rounded-xl border border-border bg-surface px-10 py-3 text-sm font-bold text-brand/40"
            >
              {isPending ? "등록 중..." : "블렌드 등록"}
            </button>
          )}
        </div>

        {/* 고정 탭 바 */}
        <div className="mb-8 flex gap-10 border-b border-border pb-px">
          {FORM_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 pb-3 text-sm font-semibold transition-colors",
                activeTab === id
                  ? "border-b-2 border-brand text-brand"
                  : "text-ink-muted/60 hover:text-brand",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 — CSS hidden으로 마운트 유지 */}
        <div>
          <div className={activeTab !== "story" ? "hidden" : undefined}>
            <StoryTab />
          </div>
          <div className={activeTab !== "flavor" ? "hidden" : undefined}>
            <FlavorTab />
          </div>
          <div className={activeTab !== "pricing" ? "hidden" : undefined}>
            <PricingTab />
          </div>
        </div>
      </form>

      {/* 펀딩 일정 모달 */}
      <FundingScheduleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        submitting={isPending}
      />
    </FormProvider>
  )
}
