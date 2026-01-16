import { RazorpayOptions } from "@/types/razorpay";
import axiosClient from "@/utils/axios-client";

export const initiatePaymentMutationFn = async (data: {
  amount: number;
  courseId: string;
  gateway: "RAZORPAY" | "STRIPE" | "PAYPAL";
}) => {
  const res = await axiosClient.post(`/payment/initiate`, data);
  return res.data;
};

export const verifyPaymentMutationFn = async (data: RazorpayOptions) => {
  const res = await axiosClient.post(`/payment/verify`, data);
  return res.data;
};
