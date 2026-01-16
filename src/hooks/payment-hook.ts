import {
  initiatePaymentMutationFn,
  verifyPaymentMutationFn,
} from "@/apis/payment-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePaymentInitiate = () => {
  return useMutation({
    mutationKey: ["initiate-payment"],
    mutationFn: initiatePaymentMutationFn,
  });
};

export const useVerifyPaymentInitiate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["verify-payment"],
    mutationFn: verifyPaymentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-cart-items"] });
    },
  });
};
