"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CourseFormData, courseSchema } from "@/schema/course-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpen,
  DollarSign,
  Eye,
  Image,
  Loader,
  Megaphone,
  MessageSquare,
  Plus,
  Save,
  Target,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import IntendedLeanersSection from "../../../components/instructor/create-course-comp/intended-learners";
import CourseMessageSection from "../../../components/instructor/create-course-comp/course-message";
import CurriculumSection from "../../../components/instructor/create-course-comp/curriculum-section";
import {
  LectureContent,
  LectureContentModal,
} from "@/components/instructor/create-course-comp/lecture-content";
import { string } from "zod";
import { toast } from "sonner";
import CourseLandingPageSection from "@/components/instructor/create-course-comp/course-landing-page";
import CoursePricingSection from "@/components/instructor/create-course-comp/course-pricing";
import CoursePromotionSection from "@/components/instructor/create-course-comp/course-promotions";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import axiosClient from "@/utils/axios-client";
import axios from "axios";
import { CloudinaryUploadResponse } from "@/types/cloudinary-types";
import { useMutation } from "@tanstack/react-query";
import { saveFullCourseMutateFn } from "@/apis/course-api";

export enum LectureType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  QUIZ = "QUIZ",
  CODING = "CODING",
  ASSIGNMENT = "ASSIGNMENT",
}

export interface Lecture {
  id: string;
  title: string;
  type: LectureType;
  duration: number;
  isExpanded: boolean;
  content?: LectureContent;
  hasContent?: boolean;
}

export interface Section {
  id: string;
  title: string;
  objective: string;
  lectures: Lecture[];
}

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Design",
];

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "All LEVELS"];
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Portuguese",
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const ACTIVE_SECTIONS = {
  INTENDED_LEARNERS: "intended-learners",
  COURSE_MESSAGES: "course-messages",
  CURRICULUM: "curriculum",
  LANDING_PAGE: "landing-page",
  PRICING: "pricing",
  PROMOTIONS: "promotions",
} as const;

export type ActiveSection =
  (typeof ACTIVE_SECTIONS)[keyof typeof ACTIVE_SECTIONS];

const sidebarNavigation = [
  {
    group: "Plan your course",
    items: [
      {
        id: ACTIVE_SECTIONS.INTENDED_LEARNERS,
        label: "Intended Learners",
        icon: Target,
      },
      {
        id: ACTIVE_SECTIONS.COURSE_MESSAGES,
        label: "Course Messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    group: "Create your content",
    items: [
      { id: ACTIVE_SECTIONS.CURRICULUM, label: "Curriculum", icon: BookOpen },
    ],
  },
  {
    group: "Publish your course",
    items: [
      {
        id: ACTIVE_SECTIONS.LANDING_PAGE,
        label: "Course landing page",
        icon: Image,
      },
      { id: ACTIVE_SECTIONS.PRICING, label: "Pricing", icon: DollarSign },
      { id: ACTIVE_SECTIONS.PROMOTIONS, label: "Promotions", icon: Megaphone },
    ],
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildern: 0.05,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const CreateCourse = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("intended-learners");
  const [learningObjectives, setLearningObjectives] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState<string[]>([""]);

  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<{
    sectionId: string;
    lecture: Lecture;
  } | null>(null);
  const [openAccordionSections, setOpenAccordionSections] = useState<string[]>(
    [],
  );

  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [courseImage, setCourseImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [promoVideo, setPromoVideo] = useState<{
    file: File;
    name: string;
    size: string;
  } | null>(null);

  useEffect(() => {
    setOpenAccordionSections(sections.map((s) => String(s.id)));
  }, [sections]);

  const { mutate: saveCourseMutate, isPending: isSavePending } = useMutation({
    mutationFn: saveFullCourseMutateFn,
    mutationKey: ["save-course"],
  });

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      category: "",
      subcategory: "",
      level: "",
      language: "English",
      price: "",
      thumbnail: "",
      promoVideo: "",
      welcomeMessage: "",
      congratsMessage: "",
    },
  });

  // Handle course image upload
  const handleCourseImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Invalid file type", {
          description: "Please upload an image file (jpg, jpeg, gif, or png).",
        });
        return;
      }

      setImageUploading(true);

      try {
        const sigRes = await axiosClient.get(
          "/cloudinary-signature?folder=courses/thumbnails",
        );
        const sigData = sigRes.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp);
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        formData.append("resource_type", "image");

        const res = await axios.post<CloudinaryUploadResponse>(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          formData,
        );

        const preview = URL.createObjectURL(file);
        setCourseImage({ file, preview });

        const imageUrl = res.data.secure_url;

        // ✅ Save in React Hook Form
        form.setValue("thumbnail", imageUrl, { shouldDirty: true });

        toast("Image uploaded!", {
          description: "Your course image uploaded successfully.",
        });
      } catch (error) {
        console.error("Image upload failed", error);
        toast("Upload failed", {
          description: "Image upload failed. Try again.",
        });
      } finally {
        setImageUploading(false);
      }
    }
  };

  // Handle promo video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast("Invalid file type");
      return;
    }

    setVideoUploading(true);
    setVideoUploadProgress(0);

    // setPromoVideo({ file, name: file.name, size: `${sizeInMB} MB` });

    try {
      const sigRes = await axiosClient.get(
        "/cloudinary-signature?folder=courses/promo-videos",
      );
      const sigData = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("resource_type", "video");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setVideoUploadProgress(percent);
          },
        },
      );

      const videoUrl = res.data.secure_url;
      form.setValue("promoVideo", videoUrl);

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setPromoVideo({ file, name: file.name, size: `${sizeInMB} MB` });
      setVideoUploadProgress(100);

      toast("Video uploaded!");
    } catch (err) {
      console.error(err);
      toast("Upload failed");
    } finally {
      setVideoUploading(false);
      setTimeout(() => setVideoUploadProgress(0), 2000); // 👈 delay reset
      e.target.value = "";
    }
  };

  // Remove course image
  const removeCourseImage = () => {
    if (courseImage?.preview) {
      URL.revokeObjectURL(courseImage.preview);
    }
    // setImageUploading(false);
    setCourseImage(null);
  };

  // Remove promo video
  const removePromoVideo = () => {
    setPromoVideo(null);
    setVideoUploadProgress(0);
  };

  const onLearningObjectivesHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setLearningObjectives((prev) =>
      prev.map((obj, i) => (i === index ? e.target.value : obj)),
    );
  };

  // Section Handlers
  const onAddSectionHandler = () => {
    setSections((prev) => [
      ...prev,
      { id: generateId(), title: "", objective: "", lectures: [] },
    ]);
  };

  const updateSectionHandler = (
    sectionId: string,
    updates: Partial<Section>,
  ) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    );
  };

  const onDeleteSectionHandler = (sectionId: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
  };

  // Lecture Handlers
  const onAddLecture = (
    sectionId: string,
    type: Lecture["type"] = LectureType.VIDEO,
  ) => {
    setSections((prevSec) =>
      prevSec.map((sec, index) =>
        sec.id === sectionId
          ? {
              ...sec,
              lectures: [
                ...sec.lectures,
                {
                  id: generateId(),
                  title: "",
                  type,
                  duration: 0,
                  isExpanded: true,
                },
              ],
            }
          : sec,
      ),
    );
  };

  const onUpdatelectureHandler = (
    sectionId: string,
    lectureId: string,
    updates: Partial<Lecture>,
  ) => {
    setSections((prevSection) =>
      prevSection.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              lectures: sec.lectures.map((lec) =>
                lec.id === lectureId ? { ...lec, ...updates } : lec,
              ),
            }
          : sec,
      ),
    );
  };

  const onDeletelectureHandler = (sectionId: string, lectureId: string) => {
    setSections((prevSection) =>
      prevSection.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              lectures: sec.lectures.filter((lec) => lec.id !== lectureId),
            }
          : sec,
      ),
    );
  };

  const openContentModal = (sectionId: string, lecture: Lecture) => {
    setSelectedLecture({ sectionId, lecture });
    setContentModalOpen(true);
  };

  const handleSaveContentHandler = (content: LectureContent) => {
    if (selectedLecture) {
      onUpdatelectureHandler(
        selectedLecture.sectionId,
        selectedLecture.lecture.id,
        {
          content,
          hasContent: true,
          duration: content.video?.duration || selectedLecture.lecture.duration,
        },
      );
      toast("Content saved!", {
        description: "Your lecture content has been saved successfully.",
      });
    }
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
      toast("Section reordered", {
        description: "Your curriculum has been updated.",
      });
    }
  };

  const handleReorderLectures = (
    sectionId: string,
    newLectureOrder: string[],
  ) => {
    setSections(
      sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            lectures: newLectureOrder
              .map((lectureId) =>
                s.lectures.find((lec) => lec.id === lectureId),
              )
              .filter((lec): lec is Lecture => !!lec),
          };
        }
        return s;
      }),
    );
    toast("Lecture reordered", {
      description: "Your curriculum has been updated.",
    });
  };

  const onSubmit = (formData: CourseFormData) => {
    if (isSavePending) return;

    console.log("Course data:", {
      ...formData,
      sections,
      learningObjectives,
      prerequisites,
      targetAudience,
    });

    const payload = {
      courseData: {
        course: {
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory,
          thumbnail: formData.thumbnail,
          promoVideo: formData.promoVideo,
          level: formData.level,
          language: formData.language,
          price: parseFloat(formData.price) || 0,
        },
        sections: sections.map((section) => ({
          id: section.id,
          title: section.title,
          objective: section.objective,
          lectures: section.lectures.map((lecture) => ({
            id: lecture.id,
            title: lecture.title,
            type: lecture.type,
            duration: +lecture.duration,
            content_url: lecture.content?.video?.url,
            has_content: lecture.hasContent ?? false,
            order_index: 0,
            isExpanded: false,
          })),
        })),
      },
    };

    saveCourseMutate(payload, {
      onSuccess: () => {
        toast("Course Saved", {
          description: "Course have been saved as draft",
        });
      },
    });
  };

  const totalLectures = sections.reduce(
    (acc, sec) => acc + sec.lectures.length,
    0,
  );

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0;
    const total = 6;

    if (learningObjectives.filter((o) => o.trim()).length >= 4) completed++;
    if (sections.length > 0) completed++;
    if (form.watch("title")) completed++;
    if (form.watch("description")) completed++;
    if (form.watch("category")) completed++;
    if (form.watch("price")) completed++;

    return Math.round((completed / total) * 100);
  };

  // console.log(learningObjectives);
  const renderContent = () => {
    switch (activeSection) {
      case ACTIVE_SECTIONS.INTENDED_LEARNERS:
        return (
          <IntendedLeanersSection
            learningObjectives={learningObjectives}
            onLearningObjectivesHandler={onLearningObjectivesHandler}
            setLearningObjectives={setLearningObjectives}
            prerequisites={prerequisites}
            targetAudience={targetAudience}
            setPrerequisites={setPrerequisites}
            setTargetAudience={setTargetAudience}
          />
        );
      case ACTIVE_SECTIONS.COURSE_MESSAGES:
        return <CourseMessageSection form={form} />;
      case ACTIVE_SECTIONS.CURRICULUM:
        return (
          <CurriculumSection
            sections={sections}
            handleSectionDragEnd={handleSectionDragEnd}
            onAddSectionHandler={onAddSectionHandler}
            onAddLecture={onAddLecture}
            totalLectures={totalLectures}
            openContentModal={openContentModal}
            onDeleteSection={onDeleteSectionHandler}
            onDeletelecture={onDeletelectureHandler}
            onUpdatelecture={onUpdatelectureHandler}
            onUpdateSection={updateSectionHandler}
            openAccordionSections={openAccordionSections}
            setOpenAccordionSections={setOpenAccordionSections}
            // sensors={sensors}
            onReorderLectures={handleReorderLectures}
          />
        );
      case ACTIVE_SECTIONS.LANDING_PAGE:
        return (
          <CourseLandingPageSection
            form={form}
            categories={categories}
            levels={levels}
            languages={languages}
            onCourseImageUpload={handleCourseImageUpload}
            imageUploading={imageUploading}
            courseImage={courseImage}
            onRemoveCourseImage={removeCourseImage}
            onVideoUpload={handleVideoUpload}
            videoUploading={videoUploading}
            promoVideo={promoVideo}
            onRemovePromoVideo={removePromoVideo}
            videoUploadProgress={videoUploadProgress}
          />
        );
      case ACTIVE_SECTIONS.PRICING:
        return <CoursePricingSection form={form} />;
      case ACTIVE_SECTIONS.PROMOTIONS:
        return <CoursePromotionSection />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <Link
              href="/instructor"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to courses</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-2">
            {sidebarNavigation.map((group) => (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(item.id)}
                          isActive={activeSection === item.id}
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          {/* Progress in footer */}
          <div className="mt-auto p-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium text-foreground">
                  {calculateProgress()}%
                </span>
              </div>
              <Progress
                value={calculateProgress()}
                // value={92}
                className="h-2"
              />
            </div>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
              <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="hover:text-white" />
                    <div>
                      <h1 className="text-lg font-bold text-foreground">
                        {form.watch("title") || "Untitled Course"}
                      </h1>
                      <Badge variant="secondary" className="mt-1">
                        Draft
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-border">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>

                    {/* ✅ NOW THIS WORKS */}
                    <Button type="submit" disabled={isSavePending}>
                      {isSavePending ? (
                        <>
                          <Loader className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Submit for Review
                    </Button>
                  </div>
                </div>
              </header>
              {/* Content Area */}
              <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <AnimatePresence mode="wait">
                    {renderContent()}
                  </AnimatePresence>
                </div>
              </main>
            </form>
          </Form>
        </div>
      </div>

      {/* Content Modal */}
      {selectedLecture && (
        <LectureContentModal
          isOpen={contentModalOpen}
          onClose={() => {
            setContentModalOpen(false);
            setSelectedLecture(null);
          }}
          lectureType={selectedLecture.lecture.type}
          lectureTitle={selectedLecture.lecture.title}
          initialContent={selectedLecture.lecture.content}
          onSave={handleSaveContentHandler}
        />
      )}
    </SidebarProvider>
  );
};

export default CreateCourse;
