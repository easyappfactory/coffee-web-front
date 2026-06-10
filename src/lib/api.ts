import axios from "axios";
import {
  mockSlots,
  mockSlotDetails,
  mockSlotFundingData,
  mockMaster,
} from "./mock/slots";
import type { Slot, SlotDetail } from "@/types/slot";
import type { FundingStatus, Reward } from "@/types/funding";
import type { Master } from "@/types/user";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// POC: X-User-Id / X-Service-Id 헤더 자동 주입
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("pocUserId") ?? POC_USERS.USER;
    config.headers["X-User-Id"] = userId;
    config.headers["X-Service-Id"] = "brewing-society";
  }
  return config;
});

export const POC_USERS: Record<string, string> = {
  USER: "01966a00-0000-7000-8000-000000000001",
  MANAGER: "01966a00-0000-7000-8000-000000000002",
  ADMIN: "01966a00-0000-7000-8000-000000000003",
  SYSTEM_MANAGER: "01966a00-0000-7000-8000-000000000004",
};

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX!;

// ── 결제 API ────────────────────────────────────────────────────────────────

export async function reservePayment(
  serviceId: string,
  variantId: string,
  quantity: number
): Promise<{ orderId: string; publicOrderNumber: string; amount: number }> {
  const res = await apiClient.post(`${API_PREFIX}/order/reserve`, { serviceId, variantId, quantity });
  return res.data.data;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{
  orderId: string;
  publicOrderNumber: string;
  orderName: string;
  amount: number;
  status: string;
  paymentKey: string;
}> {
  const res = await apiClient.post(`${API_PREFIX}/order/confirm`, { paymentKey, orderId, amount });
  return res.data.data;
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Slot API (실제 백엔드 연동) ──────────────────────────────────────────────

interface SlotApiItem {
  id: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  supporters?: number;
  hasMembership?: boolean;
}

export async function getSlots(): Promise<Slot[]> {
  const res = await apiClient.get(`${API_PREFIX}/slots`);
  const items: SlotApiItem[] = res.data.data ?? res.data.items ?? [];
  return items.map((item) => {
    const mockSlot = mockSlots.find(s => s.id === item.id);
    return {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      createdAt: item.createdAt,
      series: mockSlot?.series ?? "Limited Series",
      category: mockSlot?.category ?? "BEANS",
      videoUrl: mockSlot?.videoUrl,
      duration: mockSlot?.duration ?? "10 MIN READ",
      master: mockSlot?.master ?? mockSlots[0].master,
      likes: mockSlot?.likes ?? 0,
      views: mockSlot?.views ?? 0,
      isLiked: mockSlot?.isLiked ?? false,
      supporters: mockSlot?.supporters ?? item.supporters ?? 0,
      capacity: mockSlot?.capacity ?? 1000,
      accentColor: mockSlot?.accentColor,
      thumbnailColor: mockSlot?.thumbnailColor,
      hasMembership: item.hasMembership,
    } satisfies Slot;
  });
}

export async function getSlotDetail(id: string): Promise<SlotDetail> {
  const res = await apiClient.get(`${API_PREFIX}/slots/${id}`);
  const api = res.data.data;
  const mockSlot = mockSlots.find(s => s.id === id);
  const mockDetail = mockSlotDetails[id];

  return {
    id: api.id,
    title: api.title,
    excerpt: api.excerpt ?? "",
    description: api.description ?? "",
    hashtags: api.hashtags ?? [],
    thumbnailUrl: api.thumbnailUrl ?? "",
    imageUrls: api.imageUrls ?? [],
    deadline: api.deadline,
    status: api.status,
    flavor: api.flavor,
    createdAt: api.createdAt,
    hasMembership: api.hasMembership ?? false,
    series: mockSlot?.series ?? "Limited Series",
    category: mockSlot?.category ?? "BEANS",
    videoUrl: mockSlot?.videoUrl,
    duration: mockSlot?.duration ?? "10 MIN READ",
    master: mockSlot?.master ?? mockSlots[0].master,
    likes: mockSlot?.likes ?? 0,
    views: mockSlot?.views ?? 0,
    isLiked: mockSlot?.isLiked ?? false,
    supporters: mockSlot?.supporters ?? 0,
    capacity: mockSlot?.capacity ?? 1000,
    accentColor: mockSlot?.accentColor,
    thumbnailColor: mockSlot?.thumbnailColor,
    comments: mockDetail?.comments ?? [],
    poll: mockDetail?.poll,
  };
}

export async function createSlot(
  data: import("@/types/slotRegistration").CreateSlotRequest,
): Promise<import("@/types/slotRegistration").CreateSlotResponse> {
  const body = {
    story: {
      title: data.blendName,
      excerpt: data.blendStory.slice(0, 100),
      description: data.blendStory,
      hashtags: data.hashtags,
      thumbnailUrl: null,
    },
    flavor: {
      acidity: data.flavor.acidity,
      sweetness: data.flavor.sweetness,
      bitterness: data.flavor.bitterness,
      saltiness: data.flavor.saltiness,
      nutty: data.flavor.nutty,
      roastLevel: data.flavor.roastLevel,
    },
    deadline: data.deadline,
    variants: data.pricingOptions.map((opt) => ({
      variantCode: opt.weight,
      price: opt.earlybird,
      stock: 100,
      minQuantity: opt.minQuantity,
      maxQuantity: opt.maxQuantity,
    })),
  };
  const res = await apiClient.post(`${API_PREFIX}/slots`, body);
  return { id: res.data.data.slotId, createdAt: new Date().toISOString() };
}

// ── 아직 백엔드 미구현 → mock 고정 ─────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-unused-vars */

export async function getMaster(_id: string): Promise<Master> {
  await delay();
  return { ...mockMaster, slotsCount: mockMaster.slotCount, totalFunding: mockMaster.totalFunding };
}

export async function getSlotFunding(
  id: string,
): Promise<{ funding: FundingStatus; rewards: Reward[] }> {
  await delay();
  const data = mockSlotFundingData[id];
  if (!data) throw new Error(`funding data not found for slot: ${id}`);
  return data;
}

export async function toggleLike(_slotId: string): Promise<{ liked: boolean; count: number }> {
  await delay(150);
  return { liked: true, count: 2848 };
}

export async function votePoll(_slotId: string, _optionId: string): Promise<void> {
  await delay(150);
}

export async function toggleFollow(_masterId: string): Promise<{ following: boolean }> {
  await delay(150);
  return { following: true };
}

/* eslint-enable @typescript-eslint/no-unused-vars */

// ── Community API ────────────────────────────────────────────────────────────

import type {
  Post,
  CommunityComment,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  LikeToggleResponse,
  PresignedUrlResponse,
} from "@/types/community";

export async function getCommunityPosts(
  productId: string,
  cursor?: string,
  size: number = 20
): Promise<{ items: Post[]; nextCursor: string | null; hasNext: boolean }> {
  const params = new URLSearchParams({ size: String(size) });
  if (cursor) params.set("cursor", cursor);
  const res = await apiClient.get(
    `${API_PREFIX}/community/${productId}/posts?${params}`
  );
  const { data: items, meta } = res.data;
  return { items: items ?? [], nextCursor: meta?.nextCursor ?? null, hasNext: meta?.hasNext ?? false };
}

export async function createCommunityPost(
  productId: string,
  request: CreatePostRequest
): Promise<Post> {
  const res = await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts`,
    request
  );
  return res.data.data;
}

export async function updateCommunityPost(
  productId: string,
  postId: string,
  request: UpdatePostRequest
): Promise<Post> {
  const res = await apiClient.put(
    `${API_PREFIX}/community/${productId}/posts/${postId}`,
    request
  );
  return res.data.data;
}

export async function deleteCommunityPost(
  productId: string,
  postId: string
): Promise<void> {
  await apiClient.delete(
    `${API_PREFIX}/community/${productId}/posts/${postId}`
  );
}

export async function togglePostLike(
  productId: string,
  postId: string
): Promise<LikeToggleResponse> {
  const res = await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/like`
  );
  return res.data.data;
}

export async function getCommunityComments(
  productId: string,
  postId: string,
  size: number = 50
): Promise<{ comments: CommunityComment[] }> {
  const res = await apiClient.get(
    `${API_PREFIX}/community/${productId}/posts/${postId}/comments?size=${size}`
  );
  return res.data.data;
}

export async function createCommunityComment(
  productId: string,
  postId: string,
  request: CreateCommentRequest
): Promise<CommunityComment> {
  const res = await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/comments`,
    request
  );
  return res.data.data;
}

export async function deleteCommunityComment(
  productId: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiClient.delete(
    `${API_PREFIX}/community/${productId}/posts/${postId}/comments/${commentId}`
  );
}

// ── Moderation API ───────────────────────────────────────────────────────────

export async function hidePost(productId: string, postId: string): Promise<void> {
  await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/hide`
  );
}

export async function unhidePost(productId: string, postId: string): Promise<void> {
  await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/unhide`
  );
}

export async function hideComment(
  productId: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/comments/${commentId}/hide`
  );
}

export async function unhideComment(
  productId: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiClient.post(
    `${API_PREFIX}/community/${productId}/posts/${postId}/comments/${commentId}/unhide`
  );
}

// ── Image Upload API ─────────────────────────────────────────────────────────

export async function getPresignedUrl(
  fileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const res = await apiClient.post(`${API_PREFIX}/images/presigned-url`, {
    fileName,
    contentType,
  });
  return res.data.data;
}
