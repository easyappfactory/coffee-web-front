"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityComments,
  createCommunityComment,
  deleteCommunityComment,
} from "@/lib/api";
import type { CreateCommentRequest } from "@/types/community";

export function useCommunityComments(productId: string, postId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["community-comments", productId, postId];

  const commentsQuery = useQuery({
    queryKey,
    queryFn: () => getCommunityComments(productId, postId),
    enabled: !!productId && !!postId,
  });

  const comments = commentsQuery.data?.comments ?? [];

  const createComment = useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      createCommunityComment(productId, postId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["community-posts", productId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: string) =>
      deleteCommunityComment(productId, postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["community-posts", productId] });
    },
  });

  return {
    comments,
    isLoading: commentsQuery.isLoading,
    createComment,
    deleteComment,
  };
}
