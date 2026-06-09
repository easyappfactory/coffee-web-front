import axios from "axios";
import {
  mockSlots,
  mockSlotDetail,
  mockSlotDetails,
  mockSlotFundingData,
  mockMaster,
} from "./mock/slots";
import type { Slot, SlotDetail } from "@/types/slot";
import type { FundingStatus, Reward } from "@/types/funding";
import type { Master } from "@/types/user";

const USE_MOCK = true;

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

// ── 결제 API (게이트웨이 경유, USE_MOCK 무시) ────────────────────────────────

const PAY_PREFIX = process.env.NEXT_PUBLIC_PAY_API_PREFIX ?? "/api/v1/bs";

export async function reservePayment(
  serviceId: string,
  variantId: string,
  quantity: number
): Promise<{ orderId: string; publicOrderNumber: string; amount: number }> {
  const res = await apiClient.post(`${PAY_PREFIX}/order/reserve`, { serviceId, variantId, quantity });
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
  const res = await apiClient.post(`${PAY_PREFIX}/order/confirm`, { paymentKey, orderId, amount });
  return res.data.data;
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSlots(): Promise<Slot[]> {
  if (USE_MOCK) {
    await delay();
    return mockSlots;
  }
  const res = await apiClient.get<Slot[]>("/api/slots");
  return res.data;
}

export async function getSlotDetail(id: string): Promise<SlotDetail> {
  if (USE_MOCK) {
    await delay();
    return mockSlotDetails[id] ?? mockSlotDetail;
  }
  const res = await apiClient.get<SlotDetail>(`/api/slots/${id}`);
  return res.data;
}

export async function getMaster(id: string): Promise<Master> {
  if (USE_MOCK) {
    await delay();
    return { ...mockMaster, slotsCount: mockMaster.slotCount, totalFunding: mockMaster.totalFunding };
  }
  const res = await apiClient.get<Master>(`/api/masters/${id}`);
  return res.data;
}

export async function getSlotFunding(
  id: string
): Promise<{ funding: FundingStatus; rewards: Reward[] }> {
  if (USE_MOCK) {
    await delay();
    const data = mockSlotFundingData[id];
    if (!data) throw new Error(`funding data not found for slot: ${id}`);
    return data;
  }
  const res = await apiClient.get(`/api/slots/${id}/funding`);
  return res.data;
}

export async function toggleLike(slotId: string): Promise<{ liked: boolean; count: number }> {
  if (USE_MOCK) {
    await delay(150);
    return { liked: true, count: 2848 };
  }
  const res = await apiClient.post(`/api/slots/${slotId}/likes`);
  return res.data;
}

export async function postComment(
  slotId: string,
  content: string
): Promise<{ id: string; createdAt: string }> {
  if (USE_MOCK) {
    await delay(200);
    return { id: `c_${Date.now()}`, createdAt: new Date().toISOString() };
  }
  const res = await apiClient.post(`/api/slots/${slotId}/comments`, { content });
  return res.data;
}

export async function votePoll(slotId: string, optionId: string): Promise<void> {
  if (USE_MOCK) {
    await delay(150);
    return;
  }
  await apiClient.post(`/api/slots/${slotId}/poll/vote`, { optionId });
}

export async function toggleFollow(masterId: string): Promise<{ following: boolean }> {
  if (USE_MOCK) {
    await delay(150);
    return { following: true };
  }
  const res = await apiClient.post(`/api/masters/${masterId}/follow`);
  return res.data;
}

export async function createSlot(
  data: import("@/types/slotRegistration").CreateSlotRequest,
): Promise<import("@/types/slotRegistration").CreateSlotResponse> {
  if (USE_MOCK) {
    await delay(500);
    return { id: `slot_${Date.now()}`, createdAt: new Date().toISOString() };
  }
  const res = await apiClient.post("/api/slots", data);
  return res.data;
}

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
    `/internal-api/v1/community/${productId}/posts?${params}`
  );
  return res.data.data ?? res.data;
}

export async function createCommunityPost(
  productId: string,
  request: CreatePostRequest
): Promise<Post> {
  const res = await apiClient.post(
    `/internal-api/v1/community/${productId}/posts`,
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
    `/internal-api/v1/community/${productId}/posts/${postId}`,
    request
  );
  return res.data.data;
}

export async function deleteCommunityPost(
  productId: string,
  postId: string
): Promise<void> {
  await apiClient.delete(
    `/internal-api/v1/community/${productId}/posts/${postId}`
  );
}

export async function togglePostLike(
  productId: string,
  postId: string
): Promise<LikeToggleResponse> {
  const res = await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/like`
  );
  return res.data.data;
}

export async function getCommunityComments(
  productId: string,
  postId: string,
  size: number = 50
): Promise<{ comments: CommunityComment[] }> {
  const res = await apiClient.get(
    `/internal-api/v1/community/${productId}/posts/${postId}/comments?size=${size}`
  );
  return res.data.data;
}

export async function createCommunityComment(
  productId: string,
  postId: string,
  request: CreateCommentRequest
): Promise<CommunityComment> {
  const res = await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/comments`,
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
    `/internal-api/v1/community/${productId}/posts/${postId}/comments/${commentId}`
  );
}

// ── Moderation API ───────────────────────────────────────────────────────────

export async function hidePost(productId: string, postId: string): Promise<void> {
  await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/hide`
  );
}

export async function unhidePost(productId: string, postId: string): Promise<void> {
  await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/unhide`
  );
}

export async function hideComment(
  productId: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/comments/${commentId}/hide`
  );
}

export async function unhideComment(
  productId: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiClient.post(
    `/internal-api/v1/community/${productId}/posts/${postId}/comments/${commentId}/unhide`
  );
}

// ── Image Upload API ─────────────────────────────────────────────────────────

export async function getPresignedUrl(
  fileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const res = await apiClient.post("/internal-api/v1/images/presigned-url", {
    fileName,
    contentType,
  });
  return res.data.data;
}
