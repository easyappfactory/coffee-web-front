"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  togglePostLike,
} from "@/lib/api";
import type { CreatePostRequest, UpdatePostRequest } from "@/types/community";

export function useCommunityPosts(productId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["community-posts", productId];

  const postsQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      getCommunityPosts(productId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const createPost = useMutation({
    mutationFn: (request: CreatePostRequest) =>
      createCommunityPost(productId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updatePost = useMutation({
    mutationFn: ({ postId, request }: { postId: string; request: UpdatePostRequest }) =>
      updateCommunityPost(productId, postId, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deletePost = useMutation({
    mutationFn: (postId: string) => deleteCommunityPost(productId, postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const toggleLike = useMutation({
    mutationFn: (postId: string) => togglePostLike(productId, postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    posts,
    isLoading: postsQuery.isLoading,
    isError: postsQuery.isError,
    error: postsQuery.error,
    hasNextPage: postsQuery.hasNextPage,
    fetchNextPage: postsQuery.fetchNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
  };
}
