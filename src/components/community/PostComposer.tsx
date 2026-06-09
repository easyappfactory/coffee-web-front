"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

interface PostComposerProps {
  onSubmit: (content: string, imageUrls: string[]) => Promise<void>;
  isPending: boolean;
}

export function PostComposer({ onSubmit, isPending }: PostComposerProps) {
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { images, imageUrls, isUploading, addImages, removeImage, clearImages } =
    useImageUpload(5);

  async function handleSubmit() {
    if (!content.trim()) return;
    await onSubmit(content.trim(), imageUrls);
    setContent("");
    clearImages();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) addImages(files);
    e.target.value = "";
  }

  return (
    <div className="rounded-card border border-border bg-card p-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="커뮤니티에 글을 남겨보세요..."
        className="min-h-[80px] resize-none border-0 bg-transparent p-0 text-sm leading-[1.7] text-ink-1 placeholder:text-ink-muted focus-visible:ring-0"
      />

      {images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <div key={i} className="relative shrink-0">
              <img
                src={img.preview}
                alt=""
                className="h-20 w-20 rounded-inner object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= 5 || isUploading}
          className={cn(
            "flex items-center gap-1.5 text-[12px] font-medium text-ink-muted hover:text-ink-2",
            (images.length >= 5 || isUploading) && "opacity-40"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          사진 {images.length}/5
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending || isUploading}
          className="rounded-pill font-display text-[12px] font-semibold"
          variant={content.trim() ? "default" : "secondary"}
        >
          {isPending && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
          등록
        </Button>
      </div>
    </div>
  );
}
