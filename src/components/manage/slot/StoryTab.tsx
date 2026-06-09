"use client"

import { useState, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { ImagePlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { SlotRegistrationFormData } from "@/types/slotRegistration"

export function StoryTab() {
  const { watch, setValue } = useFormContext<SlotRegistrationFormData>()

  const [tagInput, setTagInput] = useState("")
  const hashtags = watch("hashtags")
  const thumbnailFile = watch("thumbnailFile")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewUrl =
    thumbnailFile && thumbnailFile.length > 0
      ? URL.createObjectURL(thumbnailFile[0])
      : null

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    e.preventDefault()
    const tag = tagInput.trim().replace(/^#/, "")
    if (tag && !hashtags.includes(tag)) {
      setValue("hashtags", [...hashtags, tag])
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    setValue(
      "hashtags",
      hashtags.filter((t) => t !== tag),
    )
  }

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-7 space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-bold uppercase tracking-widest text-ink-muted">
            블렌드 이름
          </label>
          <Input
            value={watch("blendName")}
            onChange={(e) => setValue("blendName", e.target.value)}
            placeholder="예: 새벽의 숲 (Dawn Forest)"
            className="border-0 border-b border-border bg-transparent text-2xl font-display focus-visible:ring-0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold uppercase tracking-widest text-ink-muted">
            블렌딩 이야기
          </label>
          <Textarea
            value={watch("blendStory")}
            onChange={(e) => setValue("blendStory", e.target.value)}
            placeholder="이 커피가 만들어지기까지의 여정을 기록해주세요..."
            rows={6}
            className="resize-none border-0 border-b border-border bg-transparent text-lg focus-visible:ring-0"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold uppercase tracking-widest text-ink-muted">
            해시태그
          </label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="#태그 입력 후 Enter"
            className="border-0 border-b border-border bg-transparent focus-visible:ring-0"
          />
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 bg-brand/10 text-brand"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group flex aspect-[4/5] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center transition-colors hover:border-brand/40"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="썸네일 미리보기"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <>
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-light transition-transform group-hover:scale-110">
                <ImagePlus className="h-8 w-8 text-brand" />
              </div>
              <h4 className="mb-2 font-display text-xl font-bold text-ink-1">
                대표 이미지 업로드
              </h4>
              <p className="text-sm text-ink-muted">
                드래그 앤 드롭 하거나 클릭하여 선택하세요.
                <br />
                최소 2000 x 2500px 추천.
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setValue("thumbnailFile", e.target.files)}
          />
        </div>
      </div>
    </div>
  )
}
