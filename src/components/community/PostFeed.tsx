"use client";

import { useState, useCallback } from "react";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";
import { CommentSection } from "./CommentSection";
import { CommunityLock } from "./CommunityLock";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { hidePost as hidePostApi, unhidePost as unhidePostApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface PostFeedProps {
  productId: string;
  currentUserId: string;
  isManager: boolean;
}

export function PostFeed({ productId, currentUserId, isManager }: PostFeedProps) {
  const {
    posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    createPost,
    deletePost,
    toggleLike,
  } = useCommunityPosts(productId);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handleCreatePost = useCallback(
    async (content: string, imageUrls: string[]) => {
      await createPost.mutateAsync({ content, imageUrls });
    },
    [createPost]
  );

  const handleToggleComments = useCallback((postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  }, []);

  async function handleHidePost(postId: string) {
    await hidePostApi(productId, postId);
  }

  async function handleUnhidePost(postId: string) {
    await unhidePostApi(productId, postId);
  }

  // 403 → 잠금 오버레이, CORS/네트워크 에러(응답 없음) 포함
  if (
    isError &&
    axios.isAxiosError(error) &&
    (error.response?.status === 403 || !error.response)
  ) {
    return <CommunityLock />;
  }

  // 그 외 서버 에러
  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-ink-muted">
        커뮤니티를 불러올 수 없습니다
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-ink-muted">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PostComposer onSubmit={handleCreatePost} isPending={createPost.isPending} />

      {posts.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          첫 번째 게시물을 작성해보세요
        </p>
      )}

      {posts.map((post) => (
        <div key={post.id}>
          <PostCard
            post={post}
            onLike={(id) => toggleLike.mutate(id)}
            onDelete={(id) => deletePost.mutate(id)}
            onToggleComments={handleToggleComments}
            onHide={isManager ? handleHidePost : undefined}
            onUnhide={isManager ? handleUnhidePost : undefined}
            isManager={isManager}
            currentUserId={currentUserId}
          />
          {expandedPostId === post.id && (
            <CommentSection
              productId={productId}
              postId={post.id}
              currentUserId={currentUserId}
              isManager={isManager}
            />
          )}
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-pill text-[12px]"
          >
            {isFetchingNextPage ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : null}
            더 보기
          </Button>
        </div>
      )}
    </div>
  );
}
