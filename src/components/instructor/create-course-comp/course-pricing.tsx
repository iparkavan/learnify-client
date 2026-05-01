import {
  containerVariants,
  itemVariants,
} from "@/lms-pages/instructor/course-creation/edit-course";
import { CourseFormData } from "@/schema/course-schema";
import React from "react";
import { UseFormReturn } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CoursePrisingSectionProps {
  form: UseFormReturn<CourseFormData>;
}

const CoursePricingSection: React.FC<CoursePrisingSectionProps> = ({
  form,
}) => {
  return (
    <motion.div
      key="pricing"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-2">Pricing</h2>
        <p className="text-muted-foreground">
          Set a price for your course. You can always change it later.
        </p>
      </motion.div>

      <Form {...form}>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Course Price (USD)
                </FormLabel>
                <FormDescription>
                  Please select the price tier for your course. The price must
                  be between $19.99 and $199.99.
                </FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
                      <SelectValue placeholder="Select price" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="19.99">$19.99</SelectItem>
                      <SelectItem value="29.99">$29.99</SelectItem>
                      <SelectItem value="49.99">$49.99</SelectItem>
                      <SelectItem value="79.99">$79.99</SelectItem>
                      <SelectItem value="99.99">$99.99</SelectItem>
                      <SelectItem value="149.99">$149.99</SelectItem>
                      <SelectItem value="199.99">$199.99</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </Form>
    </motion.div>
  );
};

export default CoursePricingSection;
