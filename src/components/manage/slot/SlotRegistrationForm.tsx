"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { BookOpen, Coffee, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StoryTab } from "./StoryTab"
import { FlavorTab } from "./FlavorTab"
import { PricingTab } from "./PricingTab"
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
  const { mutate, isPending } = useCreateSlot()

  const methods = useForm<SlotRegistrationFormData>({
    defaultValues: {
      blendName: "",
      blendStory: "",
      hashtags: [],
      thumbnailFile: null,
      flavor: { aroma: 3, body: 3, sweetness: 3, acidity: 3 },
      pricingOptions: [
        {
          id: crypto.randomUUID(),
          weight: "200g",
          earlybird: 12000,
          second: 14500,
          final: 18000,
        },
      ],
    },
  })

  function onSubmit(data: SlotRegistrationFormData) {
    mutate(
      {
        blendName: data.blendName,
        blendStory: data.blendStory,
        hashtags: data.hashtags,
        flavor: data.flavor,
        pricingOptions: data.pricingOptions.map((opt) => ({
          weight: opt.weight,
          earlybird: opt.earlybird,
          second: opt.second,
          final: opt.final,
        })),
      },
      {
        onSuccess: () => {
          alert("슬롯이 등록되었습니다!")
          methods.reset()
        },
      },
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mb-10">
          <h3 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-ink-1">
            신규 블렌드 등록
          </h3>
          <p className="text-sm text-ink-muted">
            최고의 원두 이야기를 세상에 들려주세요.
          </p>
        </div>

        {/* Form Sub-Tabs */}
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

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "story" && <StoryTab />}
          {activeTab === "flavor" && <FlavorTab />}
          {activeTab === "pricing" && <PricingTab />}
        </div>

        {/* Submit */}
        <div className="mt-10 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-brand px-8 py-3 text-white hover:bg-brand-dark"
          >
            {isPending ? "등록 중..." : "블렌드 등록"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
