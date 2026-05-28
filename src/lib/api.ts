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

// ── 결제 API (게이트웨이 경유, USE_MOCK 무시) ────────────────────────────────

const PAY_PREFIX = process.env.NEXT_PUBLIC_PAY_API_PREFIX ?? "/api/v1/bs";

export async function reservePayment(
  serviceId: string,
  planId: number
): Promise<{ orderId: string }> {
  const res = await apiClient.post(`${PAY_PREFIX}/pay/reserve`, { serviceId, planId });
  return res.data.data;
}

export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{
  paymentKey: string;
  orderId: string;
  orderName: string;
  totalAmount: number;
  status: string;
  method: string;
  approvedAt: string;
}> {
  const res = await apiClient.post(`${PAY_PREFIX}/pay/confirm`, { paymentKey, orderId, amount });
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
