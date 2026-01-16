export interface OrderResponse {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

  razorpayOrderId: string | null;
  paymentId: string | null;
  refundId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewayData {
  id: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentResponse {
  order: OrderResponse;
  paymentGatewayData: PaymentGatewayData;
}
