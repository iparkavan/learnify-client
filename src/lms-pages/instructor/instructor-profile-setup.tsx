"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

const instructorProfileSchema = z.object({
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  expertise: z
    .string()
    .max(500, "Expertise must be less than 500 characters")
    .optional(),
});

type InstructorProfileFormData = z.infer<typeof instructorProfileSchema>;

const InstructorProfileSetup = () => {
  //   const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const form = useForm<InstructorProfileFormData>({
    resolver: zodResolver(instructorProfileSchema),
    defaultValues: {
      bio: "",
      expertise: "",
    },
  });

  //   useEffect(() => {
  //     if (!authLoading && !user) {
  //       router("/auth");
  //     }
  //   }, [user, authLoading, router]);

  //   useEffect(() => {
  //     const fetchExistingProfile = async () => {
  //       if (!user) return;

  //       try {
  //         const { data, error } = await supabase
  //           .from("instructor_profiles")
  //           .select("*")
  //           .eq("user_id", user.id)
  //           .maybeSingle();

  //         if (error) throw error;

  //         if (data) {
  //           form.reset({
  //             bio: data.bio || "",
  //             expertise: data.expertise || "",
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //       } finally {
  //         setIsLoadingProfile(false);
  //       }
  //     };

  //     if (user) {
  //       fetchExistingProfile();
  //     }
  //   }, [user, form]);

  const onSubmit = async (data: InstructorProfileFormData) => {
    // if (!user) return;

    setIsSubmitting(true);
    // try {
    //   const { data: existingProfile } = await supabase
    //     .from("instructor_profiles")
    //     .select("id")
    //     .eq("user_id", user.id)
    //     .maybeSingle();

    //   if (existingProfile) {
    //     const { error } = await supabase
    //       .from("instructor_profiles")
    //       .update({
    //         bio: data.bio || null,
    //         expertise: data.expertise || null,
    //       })
    //       .eq("user_id", user.id);

    //     if (error) throw error;
    //     toast.success("Profile updated successfully!");
    //   } else {
    //     const { error } = await supabase.from("instructor_profiles").insert({
    //       user_id: user.id,
    //       bio: data.bio || null,
    //       expertise: data.expertise || null,
    //     });

    //     if (error) throw error;
    //     toast.success("Profile created successfully!");
    //   }

    //   router("/instructor/dashboard");
    // } catch (error: any) {
    //   console.error("Error saving profile:", error);
    //   toast.error(error.message || "Failed to save profile");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  //   if (authLoading || isLoadingProfile) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Instructor Profile Setup</CardTitle>
          <CardDescription>
            Tell students about yourself and your expertise to build credibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell students about yourself, your background, and teaching experience..."
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your background, experience, and what makes you a
                      great instructor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Web Development, Data Science, Machine Learning"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List your areas of expertise, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/instructor/dashboard")}
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfileSetup;
