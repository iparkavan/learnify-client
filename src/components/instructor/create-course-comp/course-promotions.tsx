import React from "react";
import { Button } from "@/components/ui/button";
import {
  containerVariants,
  itemVariants,
} from "@/lms-pages/instructor/course-creation/edit-course";
import { Megaphone, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CoursePromotionSection = () => {
  return (
    <motion.div
      key="promotions"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-2">Promotions</h2>
        <p className="text-muted-foreground">
          Create coupons and promotional campaigns to boost your course sales.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="p-8 rounded-xl border border-border bg-muted/30 text-center"
      >
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No promotions yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Create your first coupon to share discounts with students.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CoursePromotionSection;
