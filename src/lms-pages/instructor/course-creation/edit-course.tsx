"use client";

import { motion, AnimatePresence } from "framer-motion";
import isEqual from "lodash.isequal";
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
  Save,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import axiosClient from "@/utils/axios-client";
import axios from "axios";
import { CloudinaryUploadResponse } from "@/types/cloudinary-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCourseByIdQueryFn,
  saveFullCourseMutateFn,
} from "@/apis/course-api";
import {
  LectureContent,
  LectureContentModal,
} from "@/components/instructor/create-course-comp/lecture-content";
import { useUpdateCourse } from "@/hooks/api-hooks/course-hooks";
import { useDebounce } from "@/hooks/debounce";
import { useParams } from "next/navigation";
import { Course, SectionResponse } from "@/types/instructor-course-types";
import {
  createSectionMutateFn,
  deleteSectionMutateFn,
  updateSectionMutateFn,
} from "@/apis/section-api";
import {
  createLectureMutateFn,
  updateLectureMutateFn,
} from "@/apis/lecture-api";

// ─── Lazy-load heavy section components ──────────────────────────────────────
const IntendedLeanersSection = lazy(
  () =>
    import("../../../components/instructor/create-course-comp/intended-learners"),
);
const CourseMessageSection = lazy(
  () =>
    import("../../../components/instructor/create-course-comp/course-message"),
);
const CurriculumSection = lazy(
  () =>
    import("../../../components/instructor/create-course-comp/curriculum-section"),
);
const CourseLandingPageSection = lazy(
  () =>
    import("@/components/instructor/create-course-comp/course-landing-page"),
);
const CoursePricingSection = lazy(
  () => import("@/components/instructor/create-course-comp/course-pricing"),
);
const CoursePromotionSection = lazy(
  () => import("@/components/instructor/create-course-comp/course-promotions"),
);

// ─── Static data outside component (stable references) ───────────────────────
export const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Design",
];

export const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "All LEVELS"];

export const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Portuguese",
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export enum LectureType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  QUIZ = "QUIZ",
  CODING = "CODING",
  ASSIGNMENT = "ASSIGNMENT",
}

// export interface Lecture {
//   id: string;
//   title: string;
//   type: LectureType;
//   duration: number;
//   isExpanded: boolean;
//   content?: LectureContent;
//   hasContent?: boolean;
// }

export interface Lecture {
  id: string;
  title: string;
  type: LectureType;
  duration: number;
  order: number;
  isExpanded: boolean;
  content?: LectureContent;
  hasContent?: boolean;
}

export interface Section {
  id: string;
  title: string;
  objective: string;
  order?: number;
  courseId?: string;
  lectures: Lecture[];
}

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

// Moved outside — never recreated on render
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
    transition: { staggerChildren: 0.05 },
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

// ─── Memoized Sidebar Navigation ─────────────────────────────────────────────
const CourseSidebar = memo(
  ({
    activeSection,
    onSectionChange,
    progress,
  }: {
    activeSection: ActiveSection;
    onSectionChange: (id: ActiveSection) => void;
    progress: number;
  }) => (
    <Sidebar className="border-r border-border pt-20">
      <SidebarHeader className="p-4 border-b border-border">
        <Link
          href="/instructor"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Dashboard</span>
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
                      type="button"
                      onClick={() => onSectionChange(item.id)}
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

      <div className="mt-auto p-4 border-t border-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Sidebar>
  ),
);
CourseSidebar.displayName = "CourseSidebar";

interface CreateCourseProps {
  courseId: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EditCourse: React.FC<CreateCourseProps> = ({ courseId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  console.log("SECTIONS", sections);
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

  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "Idle" | "Saving..." | "Saved" | "Error"
  >("Idle");

  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [courseImage, setCourseImage] = useState<{
    file?: File;
    preview: string;
  } | null>(null);
  const [promoVideo, setPromoVideo] = useState<{
    file?: File; // optional
    name?: string;
    size?: string;
    url?: string; // for DB video
  } | null>(null);

  const prevRef = useRef<any>(null);
  const isFirstRender = useRef(true);
  const latestSaveRef = useRef(0);
  const prevSectionsRef = useRef<Section[]>([]);

  const queryClient = useQueryClient();

  const { mutate: saveCourseMutate, isPending: isSavePending } = useMutation({
    mutationFn: saveFullCourseMutateFn,
    mutationKey: ["save-course"],
  });

  const {
    mutateAsync: autoSaveUpdateCourseMutate,
    isPending: isAutoSaveUpdateCoursePending,
  } = useUpdateCourse();

  const { data: courseData, isPending: isCoursePending } = useQuery({
    queryKey: ["get-course-by-id", courseId],
    queryFn: () => getCourseByIdQueryFn({ courseId }),
    enabled: !!courseId,
  });

  const {
    mutate: deleteSectionMutate,
    isPending: isDeleteSectionPending,
    variables: isDeleteSectionVariables,
  } = useMutation({
    mutationFn: (sectionId: string) => deleteSectionMutateFn(sectionId),

    onMutate: async (sectionId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["get-course-by-id", courseId],
      });

      // 1. Snapshot previous value
      // Note: Your useQuery returns { course: Course } based on your useEffect
      const previousData = queryClient.getQueryData<{ course: Course }>([
        "get-course-by-id",
        courseId,
      ]);

      if (previousData?.course?.sections) {
        // 2. Optimistically update the CACHE
        queryClient.setQueryData<{ course: Course }>(
          ["get-course-by-id", courseId],
          {
            ...previousData,
            course: {
              ...previousData.course,
              sections: previousData.course.sections.filter(
                (s) => s.id !== sectionId,
              ),
            },
          },
        );

        // 3. Optimistically update your UI STATE (the 'sections' state)
        // We filter 'sections' which is already the mapped UI type
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
      }

      return { previousData };
    },

    onError: (err, sectionId, context) => {
      // 4. Rollback
      if (context?.previousData) {
        queryClient.setQueryData(
          ["get-course-by-id", courseId],
          context.previousData,
        );

        // Re-map the sections to UI format to restore local state
        const rolledBackSections = mapSectionsToUI(
          context.previousData.course.sections,
        );
        setSections(rolledBackSections);
      }
      toast.error("Delete failed. UI restored.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-course-by-id", courseId],
      });
    },
  });

  const { mutate: createSectionMutate, isPending: isCreateSectionPending } =
    useMutation({
      mutationFn: () =>
        createSectionMutateFn({
          courseId,
        }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get-course-by-id", courseId],
        });
        toast("Section created", {
          description: "The section has been created successfully.",
        });
      },
    });

  const { mutate: createLectureMutate, isPending: isCreateLecturePending } =
    useMutation({
      mutationFn: ({
        sectionId,
        type,
      }: {
        sectionId: string;
        type: LectureType;
      }) => createLectureMutateFn({ sectionId, type }),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get-course-by-id", courseId],
        });
        toast("Lecture created", {
          description: "The lecture has been created successfully.",
        });
      },
    });

  const { mutateAsync: updateSectionMutate } = useMutation({
    mutationFn: async ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: Partial<Section>;
    }) => updateSectionMutateFn(sectionId, data),
  });

  const { mutateAsync: updateLectureMutate } = useMutation({
    mutationFn: async ({
      lectureId,
      data,
    }: {
      lectureId: string;
      data: Partial<Lecture>;
    }) => updateLectureMutateFn(lectureId, data),
  });

  const debouncedSections = useDebounce(sections, 1500);

  useEffect(() => {
    if (isFirstRender.current) return;

    const previous = prevSectionsRef.current;
    const current = debouncedSections;

    // first hydrate
    if (!previous.length) {
      prevSectionsRef.current = current;
      return;
    }

    const saveChanges = async () => {
      try {
        setAutoSaveStatus("Saving...");

        for (const currentSection of current) {
          const prevSection = previous.find((s) => s.id === currentSection.id);

          // NEW SECTION
          if (!prevSection) continue;

          // SECTION CHANGED
          const sectionChanged =
            prevSection.title !== currentSection.title ||
            prevSection.objective !== currentSection.objective ||
            prevSection.order !== currentSection.order;

          if (sectionChanged) {
            await updateSectionMutate({
              sectionId: currentSection.id,
              data: {
                title: currentSection.title,
                objective: currentSection.objective,
                order: currentSection.order,
              },
            });
          }

          // LECTURES
          for (const currentLecture of currentSection.lectures) {
            const prevLecture = prevSection.lectures.find(
              (l) => l.id === currentLecture.id,
            );

            if (!prevLecture) continue;

            const lectureChanged =
              prevLecture.title !== currentLecture.title ||
              prevLecture.type !== currentLecture.type ||
              prevLecture.duration !== currentLecture.duration ||
              prevLecture.order !== currentLecture.order ||
              !isEqual(prevLecture.content, currentLecture.content);

            if (lectureChanged) {
              await updateLectureMutate({
                lectureId: currentLecture.id,
                data: {
                  title: currentLecture.title,
                  type: currentLecture.type,
                  duration: currentLecture.duration,
                  order: currentLecture.order,
                  content: currentLecture.content,
                },
              });
            }
          }
        }

        setAutoSaveStatus("Saved");
      } catch (error) {
        console.error(error);
        setAutoSaveStatus("Error");
      } finally {
        prevSectionsRef.current = current;
      }
    };

    saveChanges();
  }, [debouncedSections]);

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

  const mapCourseToForm = (c: Course) => ({
    title: c.title || "",
    subtitle: c.subtitle || "",
    description: c.description || "",
    category: c.categoryId || "",
    subcategory: "",
    level: c.level || "",
    language: "English",
    price: c.price?.toString() || "",
    thumbnail: c.thumbnail || "",
    promoVideo: c.promoVideo || "",
    welcomeMessage: "",
    congratsMessage: "",
  });

  const mapSectionsToUI = (sections: SectionResponse[]): Section[] => {
    console.log("Mapping sections:", sections);
    return sections.map((section) => ({
      id: section.id,
      title: section.title,
      courseId: section.courseId,
      order: section.order,
      objective: "", // not in backend
      lectures: section.lectures.map((lecture: any) => {
        const video = lecture.video;

        return {
          id: lecture.id,
          title: lecture.title,
          type: lecture.type,
          duration: video?.duration || 0,
          order: lecture.order,
          isExpanded: false, // UI state default
          hasContent: !!(lecture.video || lecture.quiz),
          content: {
            video: video
              ? {
                  url: video.originalUrl,
                  duration: video.duration,
                }
              : undefined,
            quiz: lecture.quiz || undefined,
            description: undefined,
            resources: lecture.resources || [],
          },
        };
      }),
    }));
  };

  const hydrateCourse = (c: Course) => {
    form.reset(mapCourseToForm(c));

    const mappedSections = mapSectionsToUI(c.sections);
    setSections(mappedSections);
    setOpenAccordionSections(mappedSections.map((s) => s.id));

    setCourseImage(
      c.thumbnail
        ? {
            preview: c.thumbnail,
            file: undefined,
          }
        : null,
    );

    setPromoVideo(c.promoVideo ? { url: c.promoVideo } : null);
  };

  useEffect(() => {
    if (courseData?.course) {
      hydrateCourse(courseData.course);
    }
  }, [courseData]);

  // _____ COURSE PAYLOAD _______________
  const buildCoursePayload = useCallback(() => {
    const values = form.getValues();

    return {
      title: values.title,
      subtitle: values.subtitle,
      description: values.description,
      category: values.category,
      subcategory: values.subcategory,
      thumbnail: values.thumbnail,
      promoVideo: values.promoVideo,
      level: values.level,
      language: values.language,
      price: values.price,
      welcomeMessage: values.welcomeMessage,
      congratsMessage: values.congratsMessage,
      learningObjectives: learningObjectives,
      prerequisites: prerequisites,
      targetAudience: targetAudience,
    };
  }, [form, learningObjectives, prerequisites, targetAudience]);

  const watchedCourseFields = useWatch({ control: form.control });

  const debounceCourse = useDebounce(
    {
      watchedCourseFields,
      learningObjectives,
      prerequisites,
      targetAudience,
    },
    1500,
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const payload = buildCoursePayload();

    if (isEqual(prevRef.current, payload)) return;

    prevRef.current = payload;

    const save = async () => {
      const saveId = Date.now();
      latestSaveRef.current = saveId;

      try {
        setAutoSaveStatus("Saving...");

        await autoSaveUpdateCourseMutate({
          courseId,
          data: payload,
        });

        if (latestSaveRef.current === saveId) {
          setAutoSaveStatus("Saved");
        }
      } catch {
        if (latestSaveRef.current === saveId) {
          setAutoSaveStatus("Error");
        }
      }
    };

    save();
  }, [debounceCourse]);

  // ✅ useWatch instead of form.watch() in render — avoids full re-renders
  const watchedTitle = useWatch({ control: form.control, name: "title" });

  const watchedDescription = useWatch({
    control: form.control,
    name: "description",
  });

  const watchedCategory = useWatch({
    control: form.control,
    name: "category",
  });

  const watchedPrice = useWatch({ control: form.control, name: "price" });

  // ✅ useMemo for progress — only recomputes when deps change
  const progress = useMemo(() => {
    let completed = 0;
    const total = 6;
    if (learningObjectives.filter((o) => o.trim()).length >= 4) completed++;
    if (sections.length > 0) completed++;
    if (watchedTitle) completed++;
    if (watchedDescription) completed++;
    if (watchedCategory) completed++;
    if (watchedPrice) completed++;
    return Math.round((completed / total) * 100);
  }, [
    learningObjectives,
    sections.length,
    watchedTitle,
    watchedDescription,
    watchedCategory,
    watchedPrice,
  ]);

  // ✅ totalLectures memoized
  const totalLectures = useMemo(
    () => sections.reduce((acc, sec) => acc + sec.lectures.length, 0),
    [sections],
  );

  // ─── Handlers (all memoized with useCallback) ─────────────────────────────
  const handleCourseImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

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
        form.setValue("thumbnail", res.data.secure_url, {
          shouldDirty: true,
        });
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
    },
    [form],
  );

  const handleVideoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        toast("Invalid file type");
        return;
      }

      setVideoUploading(true);
      setVideoUploadProgress(0);

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

        form.setValue("promoVideo", res.data.secure_url);
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setPromoVideo({ file, name: file.name, size: `${sizeInMB} MB` });
        setVideoUploadProgress(100);
        toast("Video uploaded!");
      } catch (err) {
        console.error(err);
        toast("Upload failed");
      } finally {
        setVideoUploading(false);
        setTimeout(() => setVideoUploadProgress(0), 2000);
        e.target.value = "";
      }
    },
    [form],
  );

  const removeCourseImage = useCallback(() => {
    if (courseImage?.preview) URL.revokeObjectURL(courseImage.preview);
    setCourseImage(null);
  }, [courseImage?.preview]);

  const removePromoVideo = useCallback(() => {
    setPromoVideo(null);
    setVideoUploadProgress(0);
  }, []);

  const onLearningObjectivesHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      setLearningObjectives((prev) =>
        prev.map((obj, i) => (i === index ? e.target.value : obj)),
      );
    },
    [],
  );

  // ─── Section Handlers ─────────────────────────────────────────────────────

  // ✅ Replaced useEffect sync with direct state update on add
  const onAddSectionHandler = useCallback(() => {
    // let tempId = generateId();
    // let count;
    // const newSection: Section = {
    //   id: tempId,
    //   title: "Untitled Section",
    //   objective: "",
    //   lectures: [],
    // };
    // setSections((prev) => [...prev, newSection]);
    // // Directly open the new section instead of syncing via useEffect
    // setOpenAccordionSections((prev) => [...prev, newSection.id]);

    createSectionMutate();
  }, []);

  const updateSectionHandler = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
      );
    },
    [],
  );

  const onDeleteSectionHandler = useCallback((sectionId: string) => {
    // nedd
    deleteSectionMutate(sectionId, {
      // onSuccess: () => {
      //   queryClient.invalidateQueries({
      //     queryKey: ["get-course-by-id", courseId],
      //   });
      //   toast("Section deleted", {
      //     description: "The section has been deleted successfully.",
      //   });
      // },
    });
    // setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
  }, []);

  // ─── Lecture Handlers ─────────────────────────────────────────────────────

  const onAddLecture = useCallback(
    (sectionId: string, type: Lecture["type"] = LectureType.VIDEO) => {
      // setSections((prevSec) =>
      //   prevSec.map((sec) =>
      //     sec.id === sectionId
      //       ? {
      //           ...sec,
      //           lectures: [
      //             ...sec.lectures,
      //             {
      //               id: generateId(),
      //               title: "",
      //               type,
      //               duration: 0,
      //               isExpanded: true,
      //             },
      //           ],
      //         }
      //       : sec,
      //   ),
      // );

      createLectureMutate({ sectionId, type });
    },
    [],
  );

  const onUpdatelectureHandler = useCallback(
    (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
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
    },
    [],
  );

  const onDeletelectureHandler = useCallback(
    (sectionId: string, lectureId: string) => {
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
    },
    [],
  );

  const openContentModal = useCallback(
    (sectionId: string, lecture: Lecture) => {
      setSelectedLecture({ sectionId, lecture });
      setContentModalOpen(true);
    },
    [],
  );

  const currentLecture = useMemo(() => {
    if (!selectedLecture) return null;

    const section = sections.find((s) => s.id === selectedLecture.sectionId);

    console.log(
      section?.lectures.find((l) => l.id === selectedLecture.lecture.id),
    );

    return section?.lectures.find((l) => l.id === selectedLecture.lecture.id);
  }, [sections, selectedLecture]);

  const handleSaveContentHandler = useCallback(
    (content: LectureContent) => {
      if (selectedLecture) {
        onUpdatelectureHandler(
          selectedLecture.sectionId,
          selectedLecture.lecture.id,
          {
            content,
            hasContent: true,
            duration:
              content.video?.duration || selectedLecture.lecture.duration,
          },
        );
        toast("Content saved!", {
          description: "Your lecture content has been saved successfully.",
        });
      }
    },
    [selectedLecture, onUpdatelectureHandler],
  );

  const handleSectionDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        const reOrdered = arrayMove(sections, oldIndex, newIndex).map(
          (section, index) => ({
            ...section,
            order: index,
          }),
        );

        setSections(reOrdered);

        toast("Section reordered", {
          description: "Your curriculum has been updated.",
        });
      }
    },
    [sections],
  );

  const handleReorderLectures = useCallback(
    (sectionId: string, newLectureOrder: string[]) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;

          const reorderedLectures = newLectureOrder
            .map((lectureId) => s.lectures.find((lec) => lec.id === lectureId))
            .filter(Boolean)
            .map((lecture, index) => ({
              ...lecture!,
              order: index,
            }));

          return {
            ...s,
            lectures: reorderedLectures,
          };
        }),
      );

      toast("Lecture reordered", {
        description: "Your curriculum has been updated.",
      });
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    setContentModalOpen(false);
    setSelectedLecture(null);
  }, []);

  const setActiveSectionHandler = useCallback((id: ActiveSection) => {
    setActiveSection(id);
  }, []);

  // ─── Form submit ──────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    (formData: CourseFormData) => {
      if (isSavePending) return;

      console.log("🔥 FULL SAVE TRIGGERED");

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
            lectures: section.lectures.map((lecture, index) => ({
              id: lecture.id,
              title: lecture.title,
              type: lecture.type,
              duration: +lecture.duration,
              content_url: lecture.content?.video?.url,
              has_content: lecture.hasContent ?? false,
              order_index: 0,
              isExpanded: false,
              order: index,
              sectionId: section.id,
            })),
          })),
        },
      };

      saveCourseMutate(payload, {
        onSuccess: () => {
          toast("Course Saved", {
            description: "Course has been saved as draft",
          });
        },
      });
    },
    [isSavePending, sections, saveCourseMutate],
  );

  // ─── Section renderer ─────────────────────────────────────────────────────

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
            onReorderLectures={handleReorderLectures}
            isCreateSectionPending={isCreateSectionPending}
            isDeleteSectionPending={isDeleteSectionPending}
            isDeleteSectionVariables={isDeleteSectionVariables}
            isCreateLecturePending={isCreateLecturePending}
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
        {/* ✅ Memoized sidebar — won't re-render on form changes */}
        <CourseSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSectionHandler}
          progress={progress}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
              <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger
                      type="button"
                      className="hover:text-white"
                    />
                    <div>
                      {/* ✅ useWatch value — no form.watch() call in render */}
                      <h1 className="text-lg font-bold text-foreground">
                        {watchedTitle || "Untitled Course"}
                      </h1>
                      <Badge variant="secondary" className="mt-1">
                        Draft
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-border"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      type="submit"
                      disabled={isAutoSaveUpdateCoursePending}
                    >
                      {isAutoSaveUpdateCoursePending ? (
                        <>
                          <Loader className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      Submit for Review
                    </Button>
                  </div>
                </div>
              </header>

              {/* ✅ Suspense wraps lazy-loaded sections */}
              <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-16 text-muted-foreground">
                        <Loader className="animate-spin mr-2 h-5 w-5" />
                        Loading...
                      </div>
                    }
                  >
                    <AnimatePresence mode="wait">
                      {renderContent()}
                    </AnimatePresence>
                  </Suspense>
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
          onClose={handleCloseModal}
          lectureType={selectedLecture.lecture.type}
          lectureTitle={selectedLecture.lecture.title}
          // initialContent={selectedLecture.lecture.content}
          initialContent={currentLecture?.content}
          onSave={handleSaveContentHandler}
        />
      )}
    </SidebarProvider>
  );
};

export default EditCourse;
