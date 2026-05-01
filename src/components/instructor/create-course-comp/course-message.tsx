"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import IntendedLeaners from "./intended-learners";
import {
  containerVariants,
  itemVariants,
} from "../../../lms-pages/instructor/course-creation/edit-course";
import { CourseFormData } from "@/schema/course-schema";
import { UseFormReturn } from "react-hook-form";

interface CourseMessageProps {
  form: UseFormReturn<CourseFormData>;
}

const CourseMessageSection: React.FC<CourseMessageProps> = ({ form }) => {
  return (
    <motion.div
      key="course-messages"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Course messages
        </h2>
        <p className="text-muted-foreground">
          Write messages to your students that will be sent automatically when
          they join or complete your course.
        </p>
      </motion.div>

      <div>
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Welcome Message
                  </FormLabel>
                  <FormDescription>
                    This message will be sent to students when they enroll in
                    your course.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Welcome to my course! I'm excited to have you here..."
                      className="bg-background border-border focus:border-primary min-h-[150px]"
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
              name="congratsMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Congratulations Message
                  </FormLabel>
                  <FormDescription>
                    This message will be sent to students when they complete
                    your course.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Congratulations on completing the course! You've done an amazing job..."
                      className="bg-background border-border focus:border-primary min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseMessageSection;
