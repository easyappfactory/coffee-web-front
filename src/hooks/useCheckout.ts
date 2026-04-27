import { useMutation } from "@tanstack/react-query";
import { createOrder, processPayment } from "@/lib/api";
import { useCheckoutStore } from "@/store/checkoutStore";

export function useCheckout() {
  const { setOrderId, setStep } = useCheckoutStore();

  const placeOrder = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      setOrderId(order.id);
      setStep("payment");
    },
  });

  const pay = useMutation({
    mutationFn: ({ orderId, paymentMethod }: { orderId: string; paymentMethod: string }) =>
      processPayment(orderId, paymentMethod),
    onSuccess: () => setStep("complete"),
  });

  return { placeOrder, pay };
}
