import z from "zod";

export const contactUsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Please enter the email address")
    .email("Invalid email address")
    .max(225),
  message: z.string().min(1, "Message is required"),
});

export type ContactUsFormValues = z.infer<typeof contactUsSchema>;
