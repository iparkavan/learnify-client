import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Image, Play, Trash2, Video } from "lucide-react";

import {
  containerVariants,
  itemVariants,
} from "@/lms-pages/instructor/course-creation/create-course";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/schema/course-schema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface CourseLandingPageSectionProps {
  form: UseFormReturn<CourseFormData>;
  categories: string[];
  levels: string[];
  languages: string[];
  onCourseImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUploading: boolean;
  courseImage: {
    file: File;
    preview: string;
  } | null;
  onRemoveCourseImage: () => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoUploading: boolean;
  promoVideo: {
    file: File;
    name: string;
    size: string;
  } | null;
  onRemovePromoVideo: () => void;
  videoUploadProgress: number;
}

const CourseLandingPageSection: React.FC<CourseLandingPageSectionProps> = ({
  form,
  categories,
  levels,
  languages,
  onCourseImageUpload,
  imageUploading,
  courseImage,
  onRemoveCourseImage,
  onVideoUpload,
  videoUploading,
  promoVideo,
  onRemovePromoVideo,
  videoUploadProgress,
}) => {
  return (
    <motion.div
      key="landing-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Course landing page
        </h2>
        <p className="text-muted-foreground">
          Your course landing page is crucial to your success. It's where
          students decide whether to enroll.
        </p>
      </motion.div>

      <Form {...form}>
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Course title
                  </FormLabel>
                  <FormDescription>
                    Your title should be a mix of attention-grabbing,
                    informative, and optimized for search.
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Insert your course title"
                        className="bg-background border-border focus:border-primary pr-16"
                        maxLength={60}
                        {...field}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/60
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Course subtitle
                  </FormLabel>
                  <FormDescription>
                    Use 1 or 2 related keywords, and mention 3-4 of the most
                    important areas that you've covered.
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Insert your course subtitle"
                        className="bg-background border-border focus:border-primary pr-20"
                        maxLength={120}
                        {...field}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/120
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Course description
                  </FormLabel>
                  <FormDescription>
                    Description should have minimum 200 words.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Insert your course description"
                      className="bg-background border-border focus:border-primary min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-6 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={"cml13kfjh0000d4uiq16e94l7"}
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
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
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Language
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Thumbnail Upload */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Course image
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload your course image here. Important guidelines: 750x422
                pixels; .jpg, .jpeg, .gif, or .png.
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={onCourseImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={imageUploading}
              />
              {courseImage ? (
                <div className="border-2 border-primary/50 rounded-xl overflow-hidden bg-muted/30">
                  <div className="relative aspect-video">
                    <img
                      src={courseImage.preview}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCourseImage();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 border-t border-border">
                    <p className="text-sm text-foreground font-medium truncate">
                      {courseImage.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(courseImage.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    imageUploading
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-muted/30"
                  }`}
                >
                  {imageUploading ? (
                    <>
                      <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                      <p className="text-foreground font-medium">
                        Uploading...
                      </p>
                    </>
                  ) : (
                    <>
                      <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-foreground font-medium">
                        Upload Image
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click or drag to upload
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Promo Video */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Promotional video
              </h3>
              <p className="text-sm text-muted-foreground">
                Students who watch a well-made promo video are 5X more likely to
                enroll.
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={onVideoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={videoUploading || !!promoVideo}
              />
              {promoVideo ? (
                <div className="border-2 border-primary/50 rounded-xl p-4 bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">
                        {promoVideo.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {promoVideo.size}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePromoVideo();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : videoUploading ? (
                <div className="border-2 border-dashed border-primary rounded-xl p-8 bg-primary/5">
                  <div className="space-y-4">
                    <Video className="h-12 w-12 mx-auto text-primary" />
                    <div className="space-y-2">
                      <Progress value={videoUploadProgress} className="h-2" />
                      <p className="text-center text-sm text-foreground font-medium">
                        Uploading... {videoUploadProgress}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-muted/30">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium">Upload Video</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click or drag to upload
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Form>
    </motion.div>
  );
};

export default CourseLandingPageSection;
