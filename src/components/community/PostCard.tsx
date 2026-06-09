"use client";

import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Trash2, EyeOff, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/community";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  onHide?: (postId: string) => void;
  onUnhide?: (postId: string) => void;
  isManager: boolean;
  currentUserId: string;
}

export function PostCard({
  post,
  onLike,
  onDelete,
  onToggleComments,
  onHide,
  onUnhide,
  isManager,
  currentUserId,
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isMyPost = post.authorId === currentUserId;
  const relativeTime = new Date(post.createdAt).toLocaleDateString("ko-KR");

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-5",
        post.isHidden && "opacity-50"
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full font-display text-[12px] font-bold text-white",
            post.isMaster ? "bg-brand ring-2 ring-brand/30" : "bg-brand"
          )}>
            {post.authorId.slice(-2).toUpperCase()}
          </div>
          <div>
            <span className="text-[13px] font-semibold text-ink-1">
              {post.authorId.slice(-8)}
            </span>
            {post.isMaster && (
              <span className="rounded-pill bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                Master
              </span>
            )}
            <span className="ml-2 text-[11px] text-ink-muted">{relativeTime}</span>
          </div>
        </div>
        {(isMyPost || isManager) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full p-1 text-ink-muted hover:bg-border/50"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-card border border-border bg-card py-1 shadow-lg">
                {isMyPost && onDelete && (
                  <button
                    onClick={() => { onDelete(post.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-border/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> 삭제
                  </button>
                )}
                {isManager && !post.isHidden && onHide && (
                  <button
                    onClick={() => { onHide(post.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-ink-2 hover:bg-border/30"
                  >
                    <EyeOff className="h-3.5 w-3.5" /> 숨기기
                  </button>
                )}
                {isManager && post.isHidden && onUnhide && (
                  <button
                    onClick={() => { onUnhide(post.id); setShowMenu(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-ink-2 hover:bg-border/30"
                  >
                    <Eye className="h-3.5 w-3.5" /> 숨김 해제
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden badge */}
      {post.isHidden && isManager && (
        <div className="mb-2 inline-block rounded-pill bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
          숨겨진 게시물
        </div>
      )}

      {/* Content */}
      <p className="mb-3 text-sm leading-[1.7] text-ink-2 whitespace-pre-wrap">{post.content}</p>

      {/* Images */}
      {post.images.length > 0 && (
        <div className={cn(
          "mb-3 grid gap-1.5",
          post.images.length === 1 && "grid-cols-1",
          post.images.length === 2 && "grid-cols-2",
          post.images.length >= 3 && "grid-cols-3",
        )}>
          {post.images
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt=""
                className="aspect-square w-full rounded-inner object-cover"
              />
            ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onLike(post.id)}
          className={cn(
            "flex items-center gap-1 text-[12px] font-medium transition-colors",
            post.isLiked ? "text-red-500" : "text-ink-muted hover:text-ink-2"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", post.isLiked && "fill-red-500")} />
          {post.likeCount}
        </button>
        <button
          onClick={() => onToggleComments(post.id)}
          className="flex items-center gap-1 text-[12px] font-medium text-ink-muted hover:text-ink-2"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {post.commentCount}
        </button>
      </div>
    </div>
  );
}
