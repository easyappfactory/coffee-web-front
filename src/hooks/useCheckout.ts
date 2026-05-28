import { useMutation } from "@tanstack/react-query";
import { reservePayment } from "@/lib/api";
import { useCheckoutStore } from "@/store/checkoutStore";

export function useCheckout() {
  const { setOrderId, setStep } = useCheckoutStore();

  const placeOrder = useMutation({
    mutationFn: ({ serviceId, planId }: { serviceId: string; planId: number }) =>
      reservePayment(serviceId, planId),
    onSuccess: ({ orderId }) => {
      setOrderId(orderId);
      setStep("payment");
    },
  });

  return { placeOrder };
}
