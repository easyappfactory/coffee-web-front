export interface Post {
  id: string;
  slotProductId: string;
  authorId: string;
  content: string;
  images: PostImage[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isHidden: boolean;
  isMaster: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostImage {
  id: string;
  imageUrl: string;
  displayOrder: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentComment: ParentCommentPreview | null;
  isHidden: boolean;
  isMaster: boolean;
  createdAt: string;
}

export interface ParentCommentPreview {
  id: string;
  authorId: string;
  content: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrls: string[];
}

export interface UpdatePostRequest {
  content: string;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface LikeToggleResponse {
  liked: boolean;
  likeCount: number;
}

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}
