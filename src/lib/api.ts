import axios from "axios";
import {
  mockSlots,
  mockSlotDetail,
  mockSlotDetails,
  mockSlotFundingData,
  mockMaster,
  mockMasterProfiles,
} from "./mock/slots";
import { mockOrder } from "./mock/orders";
import type { Slot, SlotDetail } from "@/types/slot";
import type { FundingStatus, Reward, Order } from "@/types/funding";
import type { Master } from "@/types/user";

const USE_MOCK = true;

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

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

export async function createOrder(payload: {
  slotId: string;
  rewardId: string;
  quantity: number;
  paymentMethod: string;
}): Promise<Order> {
  if (USE_MOCK) {
    await delay(400);
    const slotData = mockSlotFundingData[payload.slotId];
    const reward = slotData?.rewards.find((r) => r.id === payload.rewardId);
    const slot = mockSlots.find((s) => s.id === payload.slotId);
    const masterProfile = slot ? mockMasterProfiles[slot.master.id] : undefined;
    return {
      ...mockOrder,
      id: `ord_${Date.now()}`,
      slotId: payload.slotId,
      slotTitle: slot?.title ?? mockOrder.slotTitle,
      slotThumbnail: slot?.thumbnailUrl ?? mockOrder.slotThumbnail,
      masterName: masterProfile?.name ?? slot?.master.name ?? "",
      masterRole: masterProfile?.role ?? slot?.master.role ?? "",
      rewardId: payload.rewardId,
      rewardLabel: reward?.label ?? mockOrder.rewardLabel,
      rewardDescription: reward?.description ?? "",
      quantity: payload.quantity,
      unitPrice: reward?.price ?? mockOrder.unitPrice,
      totalPrice: (reward?.price ?? mockOrder.unitPrice) * payload.quantity,
      paymentMethod: payload.paymentMethod,
      status: "pending",
    };
  }
  const res = await apiClient.post<Order>("/api/orders", payload);
  return res.data;
}

export async function getOrder(orderId: string): Promise<Order> {
  if (USE_MOCK) {
    await delay();
    return mockOrder;
  }
  const res = await apiClient.get<Order>(`/api/orders/${orderId}`);
  return res.data;
}

export async function processPayment(
  orderId: string,
  paymentMethod: string
): Promise<Order> {
  if (USE_MOCK) {
    await delay(600);
    return { ...mockOrder, status: "paid" };
  }
  const res = await apiClient.patch<Order>(`/api/orders/${orderId}/payment`, { paymentMethod });
  return res.data;
}
