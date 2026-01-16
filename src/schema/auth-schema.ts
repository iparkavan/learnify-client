import z from "zod/v3";

export const userAuthSchema = (isSignup: boolean) =>
  z.object({
    fullName: isSignup
      ? z
          .string()
          .min(2, "Full name must be at least 2 characters")
          .max(50, "Full name must be under 50 characters")
      : z.string().optional(),

    email: z.string().email("Invalid email address"),
  });

export type UserAuthSchemaType = z.infer<ReturnType<typeof userAuthSchema>>;

export const OtpSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters" }),
});

export type OtpSchemaType = z.infer<typeof OtpSchema>;
