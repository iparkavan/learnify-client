import z from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(60, "Title must be 60 characters or less"),
  subtitle: z
    .string()
    .max(120, "Subtitle must be 120 characters or less")
    .optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().optional(),
  level: z.string().min(1, "Please select a level"),
  language: z.string().min(1, "Please select a language"),
  price: z.string().min(1, "Please enter a price"),
  thumbnail: z.string().optional(),
  thumbnailPublicId: z.string().optional(),
  promoVideo: z.string().optional(),
  welcomeMessage: z.string().optional(),
  congratsMessage: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
