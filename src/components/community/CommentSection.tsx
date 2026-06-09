"use client";

import { useState } from "react";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { useCommunityComments } from "@/hooks/useCommunityComments";
import { hideComment as hideCommentApi, unhideComment as unhideCommentApi } from "@/lib/api";


interface CommentSectionProps {
  productId: string;
  postId: string;
  currentUserId: string;
  isManager: boolean;
}

export function CommentSection({ productId, postId, currentUserId, isManager }: CommentSectionProps) {
  const { comments, isLoading, createComment, deleteComment } = useCommunityComments(productId, postId);
  const [replyTo, setReplyTo] = useState<{ id: string; content: string } | null>(null);

  async function handleSubmit(content: string, parentCommentId?: string) {
    await createComment.mutateAsync({ content, parentCommentId });
  }

  function handleReply(commentId: string) {
    const target = comments.find((c) => c.id === commentId);
    if (target) setReplyTo({ id: target.id, content: target.content });
  }

  async function handleHideComment(commentId: string) {
    await hideCommentApi(productId, postId, commentId);
  }

  async function handleUnhideComment(commentId: string) {
    await unhideCommentApi(productId, postId, commentId);
  }

  if (isLoading) {
    return <div className="py-4 text-center text-[12px] text-ink-muted">로딩 중...</div>;
  }

  return (
    <div className="mt-3 space-y-2">
      {comments.length === 0 && (
        <p className="py-3 text-center text-[12px] text-ink-muted">첫 번째 댓글을 남겨보세요</p>
      )}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          isManager={isManager}
          onDelete={(id) => deleteComment.mutate(id)}
          onReply={handleReply}
          onHide={isManager ? handleHideComment : undefined}
          onUnhide={isManager ? handleUnhideComment : undefined}
        />
      ))}
      <CommentInput
        onSubmit={handleSubmit}
        isPending={createComment.isPending}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
