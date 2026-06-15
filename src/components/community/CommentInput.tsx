"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string, parentCommentId?: string) => Promise<void>;
  isPending: boolean;
  replyTo?: { id: string; content: string } | null;
  onCancelReply?: () => void;
}

export function CommentInput({ onSubmit, isPending, replyTo, onCancelReply }: CommentInputProps) {
  const [text, setText] = useState("");

  async function handleSubmit() {
    if (!text.trim() || isPending) return;
    await onSubmit(text.trim(), replyTo?.id);
    setText("");
    onCancelReply?.();
  }

  return (
    <div className="mt-3 space-y-2">
      {replyTo && (
        <div className="flex items-center gap-2 rounded-inner bg-brand/5 px-3 py-1.5">
          <span className="flex-1 text-[11px] text-ink-muted line-clamp-1">
            답글: {replyTo.content}
          </span>
          <button onClick={onCancelReply} className="text-ink-muted hover:text-ink-2">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={replyTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
          className="flex-1 rounded-inner border border-border bg-transparent px-3 py-2 text-[13px] text-ink-1 placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand/30"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!text.trim() || isPending}
          className="rounded-inner font-display text-[12px] font-semibold"
        >
          {isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          등록
        </Button>
      </div>
    </div>
  );
}
