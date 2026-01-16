export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (...args: unknown[]) => void): void; // ✅ replaced `any` with `unknown`
  close(): void;
}
