"use client";
import {
  usePaymentInitiate,
  useVerifyPaymentInitiate,
} from "@/hooks/payment-hook";
import { RazorpayOptions } from "@/types/razorpay";
import React from "react";
import { Button } from "../ui/button";
import { CreatePaymentResponse } from "@/types/payment-types";
import { useUserInfoStore } from "@/store/userInfo-store";
import { toast } from "sonner";

interface RazorpayButtonProps {
  amount: number;
  courseId: string;
  gateway: "RAZORPAY" | "STRIPE" | "PAYPAL";
  courseTitle: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  courseId,
  gateway,
  courseTitle,
}) => {
  const { user } = useUserInfoStore();

  const { mutate: initiatePaymentMutate, isPending: isPaymentPending } =
    usePaymentInitiate();
  const { mutate: verifyPaymentMutate, isPending: isVerifyPaymentPending } =
    useVerifyPaymentInitiate();

  const handlePayment = async () => {
    try {
      // 1️⃣ Call backend API to create Razorpay order

      initiatePaymentMutate(
        { amount, courseId, gateway },
        {
          onSuccess: (data: CreatePaymentResponse) => {
            const {
              id: razorpayOrderId,
              currency,
              amount: orderAmount,
            } = data.paymentGatewayData;

            // 2️⃣ Open Razorpay checkout
            const options: RazorpayOptions = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
              amount: orderAmount, // paise
              currency: currency,
              name: "MaxSkill.ai",
              description: `Purchase Course: ${courseTitle}`,
              order_id: razorpayOrderId,
              handler: async function (response) {
                verifyPaymentMutate(response, {
                  onSuccess: () => {
                    toast.success("✅ Course Purchased Successfull");
                    window.location.reload();
                  },
                });
              },
              prefill: {
                name: user?.name,
                email: user?.email,
                // contact: user?.email,
              },
              theme: { color: "#4F46E5" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          },
        }
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      // variant="outline"
      className="w-full"
      size="lg"
    >
      Buy Now
    </Button>
  );
};

export default RazorpayButton;
