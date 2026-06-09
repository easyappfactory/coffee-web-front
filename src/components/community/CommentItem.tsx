"use client";

import { MoreHorizontal, Trash2, EyeOff, Eye, Reply } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CommunityComment } from "@/types/community";

interface CommentItemProps {
  comment: CommunityComment;
  currentUserId: string;
  isManager: boolean;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onHide?: (commentId: string) => void;
  onUnhide?: (commentId: string) => void;
}

export function CommentItem({
  comment,
  currentUserId,
  isManager,
  onDelete,
  onReply,
  onHide,
  onUnhide,
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isMyComment = comment.authorId === currentUserId;
  const relativeTime = new Date(comment.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className={cn("rounded-inner border border-border/60 bg-card/50 p-3", comment.isHidden && "opacity-50")}>
      {/* Parent preview (카톡 답장 스타일) */}
      {comment.parentComment && (
        <div className="mb-2 border-l-2 border-brand/30 pl-2.5">
          <span className="text-[11px] font-medium text-ink-muted">
            {comment.parentComment.authorId.slice(-8)}
          </span>
          <p className="text-[11px] text-ink-muted line-clamp-1">
            {comment.parentComment.content}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 font-display text-[10px] font-bold text-brand">
            {comment.authorId.slice(-2).toUpperCase()}
          </div>
          <span className="text-[12px] font-semibold text-ink-1">
            {comment.authorId.slice(-8)}
          </span>
          <span className="text-[10px] text-ink-muted">{relativeTime}</span>
        </div>
        <div className="flex items-center gap-1">
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="rounded-full p-1 text-ink-muted hover:bg-border/50"
            >
              <Reply className="h-3.5 w-3.5" />
            </button>
          )}
          {(isMyComment || isManager) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-1 text-ink-muted hover:bg-border/50"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-7 z-10 min-w-[100px] rounded-card border border-border bg-card py-1 shadow-lg">
                  {isMyComment && onDelete && (
                    <button
                      onClick={() => { onDelete(comment.id); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-red-500 hover:bg-border/30"
                    >
                      <Trash2 className="h-3 w-3" /> 삭제
                    </button>
                  )}
                  {isManager && !comment.isHidden && onHide && (
                    <button
                      onClick={() => { onHide(comment.id); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-ink-2 hover:bg-border/30"
                    >
                      <EyeOff className="h-3 w-3" /> 숨기기
                    </button>
                  )}
                  {isManager && comment.isHidden && onUnhide && (
                    <button
                      onClick={() => { onUnhide(comment.id); setShowMenu(false); }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-ink-2 hover:bg-border/30"
                    >
                      <Eye className="h-3 w-3" /> 숨김 해제
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden badge */}
      {comment.isHidden && isManager && (
        <div className="mb-1 inline-block rounded-pill bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-500">
          숨겨진 댓글
        </div>
      )}

      {/* Content */}
      <p className="text-[13px] leading-[1.6] text-ink-2">{comment.content}</p>
    </div>
  );
}
