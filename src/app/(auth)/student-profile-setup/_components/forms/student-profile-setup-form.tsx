import React, { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StudentProfileSchema,
  StudentProfileSchemaType,
} from "@/schema/student-profile-setup-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStudentProfileSetup } from "@/hooks/student-profile-hook";
import { useUserInfoStore } from "@/store/userInfo-store";
import { UserInfoProfileType } from "@/types/auth-types";

const degreeProgramOptions = [
  { value: "BACHELOR_OF_TECHNOLOGY", label: "Bachelor of Technology (B.Tech)" },
  { value: "BACHELOR_OF_ENGINEERING", label: "Bachelor of Engineering (B.E)" },
  { value: "BACHELOR_OF_SCIENCE", label: "Bachelor of Science (B.Sc)" },
  {
    value: "BACHELOR_OF_COMPUTER_APPLICATIONS",
    label: "Bachelor of Computer Applications (BCA)",
  },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "WORKING_PROFESSIONAL", label: "Working Professional" },
  { value: "OTHER", label: "Other" },
];

const studyYearOptions = [
  { value: "FIRST_YEAR", label: "1st Year" },
  { value: "SECOND_YEAR", label: "2nd Year" },
  { value: "THIRD_YEAR", label: "3rd Year" },
  { value: "FOURTH_YEAR", label: "4th Year" },
  { value: "FINAL_YEAR", label: "Final Year" },
  { value: "GRADUATED", label: "Graduated" },
];

const referralSourceOptions = [
  { value: "GOOGLE", label: "Google" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FRIEND", label: "Friend" },
  { value: "COLLEGE", label: "College" },
  { value: "ADVERTISEMENT", label: "Advertisement" },
  { value: "OTHER", label: "Other" },
];

const StudentprofileSetupForm = () => {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { setUser, updateStudentProfile } = useUserInfoStore();

  const { mutate: studenProfileMutate, isPending: isStudentProfilePending } =
    useStudentProfileSetup();

  const router = useRouter();

  // const steps = [
  //   { number: 1, label: "Academic Info" },
  //   { number: 2, label: "Contact" },
  // ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const form = useForm<StudentProfileSchemaType>({
    resolver: zodResolver(StudentProfileSchema),
    defaultValues: {
      degreeProgram: "",
      studyYear: "",
      specialization: "",
      collegeName: "",
      graduationYear: "",
      country: "",
      referralSource: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: StudentProfileSchemaType) => {
    if (isStudentProfilePending) return;
    try {
      studenProfileMutate(data, {
        onSuccess: (data) => {
          updateStudentProfile(data.studentProfile);
          toast.success("Profile setup completed!");
          router.push("/");
        },
      });
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">
                Academic Details
              </span>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="degreeProgram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Degree Program *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors">
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {degreeProgramOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="group"
                            >
                              <p className="group-hover:text-white">
                                {option.label}
                              </p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="studyYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Study Year *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studyYearOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="group"
                            >
                              <p className="group-hover:text-white">
                                {option.label}
                              </p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Specialization
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Computer Science"
                          className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="collegeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        College Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your college"
                          className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Graduation Year
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 2025"
                          className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your country"
                          className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 9876543210"
                          className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="referralSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">
                        How did you find us? *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {referralSourceOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="group"
                            >
                              <p className="group-hover:text-white">
                                {option.label}
                              </p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="pt-4">
              {/* <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full text-base font-semibold bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button> */}
              <Button
                type="submit"
                disabled={isStudentProfilePending}
                className="flex-1 w-full text-base font-semibold bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {isStudentProfilePending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* {currentStep === 2 && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-5"
                    >
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-2 mb-6"
                      >
                        <Sparkles className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">
                          Contact Information
                        </span>
                      </motion.div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/90">
                                  Phone Number *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+91 9876543210"
                                    className="bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="referralSource"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground/90">
                                  How did you find us? *
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors">
                                      <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {referralSourceOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        variants={itemVariants}
                        className="flex gap-3 pt-4"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 text-base font-semibold border-border/50 hover:bg-muted/50 transition-all duration-300"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 text-base font-semibold bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                              Saving...
                            </span>
                          ) : (
                            "Complete Setup"
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )} */}
      </form>
    </Form>
  );
};

export default StudentprofileSetupForm;
