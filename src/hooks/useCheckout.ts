import { useMutation } from "@tanstack/react-query";
import { reservePayment } from "@/lib/api";
import { useCheckoutStore } from "@/store/checkoutStore";

export function useCheckout() {
  const { setOrderId, setStep } = useCheckoutStore();

  const placeOrder = useMutation({
    mutationFn: ({ serviceId, variantId, quantity }: { serviceId: string; variantId: string; quantity: number }) =>
      reservePayment(serviceId, variantId, quantity),
    onSuccess: ({ orderId }) => {
      setOrderId(orderId);
      setStep("payment");
    },
  });

  return { placeOrder };
}
