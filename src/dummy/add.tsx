// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { arrayMove } from "@dnd-kit/sortable";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import {
//   ArrowLeft,
//   Plus,
//   Trash2,
//   GripVertical,
//   Play,
//   FileText,
//   Clock,
//   Save,
//   Eye,
//   Upload,
//   Target,
//   Users,
//   BookOpen,
//   MessageSquare,
//   Image,
//   DollarSign,
//   Megaphone,
//   Video,
//   HelpCircle,
//   Code,
//   CheckCircle2,
//   ChevronDown,
//   LayoutDashboard,
// } from "lucide-react";
// import {
//   LectureContentModal,
//   LectureContent,
// } from "@/components/curriculum/LectureContentModal";
// import { SortableSection } from "@/components/curriculum/SortableSection";
// import { toast } from "sonner";

// // Types
// interface Lecture {
//   id: string;
//   title: string;
//   type: "video" | "text" | "quiz" | "coding" | "assignment";
//   duration: string;
//   isExpanded?: boolean;
//   content?: LectureContent;
//   hasContent?: boolean;
// }

// interface Section {
//   id: string;
//   title: string;
//   objective: string;
//   lectures: Lecture[];
// }

// // Form Schema
// const courseSchema = z.object({
//   title: z
//     .string()
//     .min(5, "Title must be at least 5 characters")
//     .max(60, "Title must be 60 characters or less"),
//   subtitle: z
//     .string()
//     .max(120, "Subtitle must be 120 characters or less")
//     .optional(),
//   description: z.string().min(20, "Description must be at least 20 characters"),
//   category: z.string().min(1, "Please select a category"),
//   subcategory: z.string().optional(),
//   level: z.string().min(1, "Please select a level"),
//   language: z.string().min(1, "Please select a language"),
//   price: z.string().min(1, "Please enter a price"),
//   thumbnail: z.string().optional(),
//   promoVideo: z.string().optional(),
//   welcomeMessage: z.string().optional(),
//   congratsMessage: z.string().optional(),
// });

// type CourseFormData = z.infer<typeof courseSchema>;

// const categories = [
//   "Web Development",
//   "Mobile Development",
//   "Data Science",
//   "Machine Learning",
//   "Cloud Computing",
//   "DevOps",
//   "Cybersecurity",
//   "Design",
// ];

// const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
// const languages = [
//   "English",
//   "Spanish",
//   "French",
//   "German",
//   "Hindi",
//   "Portuguese",
// ];

// const generateId = () => Math.random().toString(36).substr(2, 9);

// type ActiveSection =
//   | "intended-learners"
//   | "course-messages"
//   | "curriculum"
//   | "landing-page"
//   | "pricing"
//   | "promotions";

// const sidebarNavigation = [
//   {
//     group: "Plan your course",
//     items: [
//       {
//         id: "intended-learners" as const,
//         label: "Intended learners",
//         icon: Target,
//       },
//       {
//         id: "course-messages" as const,
//         label: "Course messages",
//         icon: MessageSquare,
//       },
//     ],
//   },
//   {
//     group: "Create your content",
//     items: [{ id: "curriculum" as const, label: "Curriculum", icon: BookOpen }],
//   },
//   {
//     group: "Publish your course",
//     items: [
//       {
//         id: "landing-page" as const,
//         label: "Course landing page",
//         icon: Image,
//       },
//       { id: "pricing" as const, label: "Pricing", icon: DollarSign },
//       { id: "promotions" as const, label: "Promotions", icon: Megaphone },
//     ],
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.05 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
//   },
// };

// const AddCourse = () => {
//   const [sections, setSections] = useState<Section[]>([]);
//   const [activeSection, setActiveSection] =
//     useState<ActiveSection>("intended-learners");
//   const [learningObjectives, setLearningObjectives] = useState<string[]>([
//     "",
//     "",
//     "",
//     "",
//   ]);
//   const [prerequisites, setPrerequisites] = useState<string[]>([""]);
//   const [targetAudience, setTargetAudience] = useState<string[]>([""]);

//   // Content modal state
//   const [contentModalOpen, setContentModalOpen] = useState(false);
//   const [selectedLecture, setSelectedLecture] = useState<{
//     sectionId: string;
//     lecture: Lecture;
//   } | null>(null);

//   // Course image and promo video state
//   const [courseImage, setCourseImage] = useState<{
//     file: File;
//     preview: string;
//   } | null>(null);
//   const [promoVideo, setPromoVideo] = useState<{
//     file: File;
//     name: string;
//     size: string;
//   } | null>(null);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [videoUploading, setVideoUploading] = useState(false);
//   const [videoUploadProgress, setVideoUploadProgress] = useState(0);

//   const form = useForm<CourseFormData>({
//     resolver: zodResolver(courseSchema),
//     defaultValues: {
//       title: "",
//       subtitle: "",
//       description: "",
//       category: "",
//       subcategory: "",
//       level: "",
//       language: "English",
//       price: "",
//       thumbnail: "",
//       promoVideo: "",
//       welcomeMessage: "",
//       congratsMessage: "",
//     },
//   });

//   // Handle course image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error("Invalid file type", {
//           description: "Please upload an image file (jpg, jpeg, gif, or png).",
//         });
//         return;
//       }

//       setImageUploading(true);
//       const preview = URL.createObjectURL(file);

//       // Simulate upload delay
//       setTimeout(() => {
//         setCourseImage({ file, preview });
//         setImageUploading(false);
//         toast.success("Image uploaded!", {
//           description: "Your course image has been uploaded successfully.",
//         });
//       }, 1000);
//     }
//   };

//   // Handle promo video upload
//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith("video/")) {
//         toast.error("Invalid file type", {
//           description: "Please upload a video file.",
//         });
//         return;
//       }

//       setVideoUploading(true);
//       setVideoUploadProgress(0);

//       // Simulate upload progress
//       const interval = setInterval(() => {
//         setVideoUploadProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             setVideoUploading(false);
//             const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
//             setPromoVideo({ file, name: file.name, size: `${sizeInMB} MB` });
//             toast({
//               title: "Video uploaded!",
//               description:
//                 "Your promotional video has been uploaded successfully.",
//             });
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 200);
//     }
//   };

//   // Remove course image
//   const removeCourseImage = () => {
//     if (courseImage?.preview) {
//       URL.revokeObjectURL(courseImage.preview);
//     }
//     setCourseImage(null);
//   };

//   // Remove promo video
//   const removePromoVideo = () => {
//     setPromoVideo(null);
//     setVideoUploadProgress(0);
//   };

//   // Section handlers
//   const addSection = () => {
//     setSections([
//       ...sections,
//       { id: generateId(), title: "", objective: "", lectures: [] },
//     ]);
//   };

//   const updateSection = (sectionId: string, updates: Partial<Section>) => {
//     setSections(
//       sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
//     );
//   };

//   const deleteSection = (sectionId: string) => {
//     setSections(sections.filter((s) => s.id !== sectionId));
//   };

//   // Lecture handlers
//   const addLecture = (sectionId: string, type: Lecture["type"] = "video") => {
//     setSections(
//       sections.map((s) => {
//         if (s.id === sectionId) {
//           return {
//             ...s,
//             lectures: [
//               ...s.lectures,
//               {
//                 id: generateId(),
//                 title: "",
//                 type,
//                 duration: "0:00",
//                 isExpanded: true,
//               },
//             ],
//           };
//         }
//         return s;
//       }),
//     );
//   };

//   const updateLecture = (
//     sectionId: string,
//     lectureId: string,
//     updates: Partial<Lecture>,
//   ) => {
//     setSections(
//       sections.map((s) => {
//         if (s.id === sectionId) {
//           return {
//             ...s,
//             lectures: s.lectures.map((l) =>
//               l.id === lectureId ? { ...l, ...updates } : l,
//             ),
//           };
//         }
//         return s;
//       }),
//     );
//   };

//   const openContentModal = (sectionId: string, lecture: Lecture) => {
//     setSelectedLecture({ sectionId, lecture });
//     setContentModalOpen(true);
//   };

//   const handleSaveContent = (content: LectureContent) => {
//     if (selectedLecture) {
//       updateLecture(selectedLecture.sectionId, selectedLecture.lecture.id, {
//         content,
//         hasContent: true,
//         duration: content.video?.duration || selectedLecture.lecture.duration,
//       });
//       toast.success("Content saved!", {
//         description: "Your lecture content has been saved successfully.",
//       });
//     }
//   };

//   const deleteLecture = (sectionId: string, lectureId: string) => {
//     setSections(
//       sections.map((s) => {
//         if (s.id === sectionId) {
//           return {
//             ...s,
//             lectures: s.lectures.filter((l) => l.id !== lectureId),
//           };
//         }
//         return s;
//       }),
//     );
//   };

//   // Drag and drop handlers
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8,
//       },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     }),
//   );

//   const handleSectionDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (over && active.id !== over.id) {
//       const oldIndex = sections.findIndex((s) => s.id === active.id);
//       const newIndex = sections.findIndex((s) => s.id === over.id);
//       setSections(arrayMove(sections, oldIndex, newIndex));
//       toast.success("Section reordered", {
//         description: "Your curriculum has been updated.",
//       });
//     }
//   };

//   const handleReorderLectures = (
//     sectionId: string,
//     oldIndex: number,
//     newIndex: number,
//   ) => {
//     setSections(
//       sections.map((s) => {
//         if (s.id === sectionId) {
//           return {
//             ...s,
//             lectures: arrayMove(s.lectures, oldIndex, newIndex),
//           };
//         }
//         return s;
//       }),
//     );
//     toast.success("Lecture reordered", {
//       description: "Your curriculum has been updated.",
//     });
//   };

//   const onSubmit = (data: CourseFormData) => {
//     console.log("Course data:", {
//       ...data,
//       sections,
//       learningObjectives,
//       prerequisites,
//       targetAudience,
//     });
//     toast.success("Course Submitted!", {
//       description: "Your course has been submitted for review.",
//     });
//   };

//   const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);

//   // Calculate progress
//   const calculateProgress = () => {
//     let completed = 0;
//     const total = 6;

//     if (learningObjectives.filter((o) => o.trim()).length >= 4) completed++;
//     if (sections.length > 0) completed++;
//     if (form.watch("title")) completed++;
//     if (form.watch("description")) completed++;
//     if (form.watch("category")) completed++;
//     if (form.watch("price")) completed++;

//     return Math.round((completed / total) * 100);
//   };

//   const getLectureIcon = (type: Lecture["type"]) => {
//     switch (type) {
//       case "video":
//         return <Play className="h-4 w-4" />;
//       case "text":
//         return <FileText className="h-4 w-4" />;
//       case "quiz":
//         return <HelpCircle className="h-4 w-4" />;
//       case "coding":
//         return <Code className="h-4 w-4" />;
//       case "assignment":
//         return <BookOpen className="h-4 w-4" />;
//     }
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case "intended-learners":
//         return (
//           <motion.div
//             key="intended-learners"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants}>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 Intended learners
//               </h2>
//               <p className="text-muted-foreground">
//                 The following descriptions will be publicly visible on your
//                 Course Landing Page and will have a direct impact on your course
//                 performance.
//               </p>
//             </motion.div>

//             {/* Learning Objectives */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-foreground mb-1">
//                   What will students learn in your course?
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   You must enter at least 4 learning objectives or outcomes that
//                   learners can expect to achieve after completing your course.
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {learningObjectives.map((objective, index) => (
//                   <div key={index} className="flex gap-2">
//                     <Input
//                       placeholder={`Example: ${index === 0 ? "Define the roles and responsibilities of a project manager" : index === 1 ? "Estimate project timelines and budgets" : index === 2 ? "Identify and manage project risks" : "Master project management tools"}`}
//                       value={objective}
//                       onChange={(e) => {
//                         const newObjectives = [...learningObjectives];
//                         newObjectives[index] = e.target.value;
//                         setLearningObjectives(newObjectives);
//                       }}
//                       className="bg-background border-border focus:border-primary"
//                     />
//                     {learningObjectives.length > 4 && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           setLearningObjectives(
//                             learningObjectives.filter((_, i) => i !== index),
//                           )
//                         }
//                         className="text-muted-foreground hover:text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button
//                   variant="outline"
//                   onClick={() =>
//                     setLearningObjectives([...learningObjectives, ""])
//                   }
//                   className="border-dashed"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add more responses
//                 </Button>
//               </div>
//             </motion.div>

//             {/* Prerequisites */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-foreground mb-1">
//                   What are the requirements or prerequisites?
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   List the required skills, experience, tools or equipment
//                   learners should have prior to taking your course.
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {prerequisites.map((prereq, index) => (
//                   <div key={index} className="flex gap-2">
//                     <Input
//                       placeholder="Example: No programming experience needed. You will learn everything you need to know"
//                       value={prereq}
//                       onChange={(e) => {
//                         const newPrereqs = [...prerequisites];
//                         newPrereqs[index] = e.target.value;
//                         setPrerequisites(newPrereqs);
//                       }}
//                       className="bg-background border-border focus:border-primary"
//                     />
//                     {prerequisites.length > 1 && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           setPrerequisites(
//                             prerequisites.filter((_, i) => i !== index),
//                           )
//                         }
//                         className="text-muted-foreground hover:text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button
//                   variant="outline"
//                   onClick={() => setPrerequisites([...prerequisites, ""])}
//                   className="border-dashed"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add more responses
//                 </Button>
//               </div>
//             </motion.div>

//             {/* Target Audience */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-foreground mb-1">
//                   Who is this course for?
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   Write a clear description of the intended learners for your
//                   course.
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {targetAudience.map((audience, index) => (
//                   <div key={index} className="flex gap-2">
//                     <Input
//                       placeholder="Example: Beginner developers curious about data science"
//                       value={audience}
//                       onChange={(e) => {
//                         const newAudience = [...targetAudience];
//                         newAudience[index] = e.target.value;
//                         setTargetAudience(newAudience);
//                       }}
//                       className="bg-background border-border focus:border-primary"
//                     />
//                     {targetAudience.length > 1 && (
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() =>
//                           setTargetAudience(
//                             targetAudience.filter((_, i) => i !== index),
//                           )
//                         }
//                         className="text-muted-foreground hover:text-destructive"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//                 <Button
//                   variant="outline"
//                   onClick={() => setTargetAudience([...targetAudience, ""])}
//                   className="border-dashed"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add more responses
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         );

//       case "course-messages":
//         return (
//           <motion.div
//             key="course-messages"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants}>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 Course messages
//               </h2>
//               <p className="text-muted-foreground">
//                 Write messages to your students that will be sent automatically
//                 when they join or complete your course.
//               </p>
//             </motion.div>

//             <Form {...form}>
//               <div className="space-y-6">
//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="welcomeMessage"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Welcome Message
//                         </FormLabel>
//                         <FormDescription>
//                           This message will be sent to students when they enroll
//                           in your course.
//                         </FormDescription>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Welcome to my course! I'm excited to have you here..."
//                             className="bg-background border-border focus:border-primary min-h-[150px]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="congratsMessage"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Congratulations Message
//                         </FormLabel>
//                         <FormDescription>
//                           This message will be sent to students when they
//                           complete your course.
//                         </FormDescription>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Congratulations on completing the course! You've done an amazing job..."
//                             className="bg-background border-border focus:border-primary min-h-[150px]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>
//               </div>
//             </Form>
//           </motion.div>
//         );

//       case "curriculum":
//         return (
//           <motion.div
//             key="curriculum"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div
//               variants={itemVariants}
//               className="flex items-start justify-between"
//             >
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground mb-2">
//                   Curriculum
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Start putting together your course by creating sections,
//                   lectures and practice activities.
//                   <span className="block text-sm mt-1 text-primary">
//                     Drag sections and lectures to reorder them.
//                   </span>
//                 </p>
//               </div>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                 <span>{sections.length} sections</span>
//                 <span>•</span>
//                 <span>{totalLectures} lectures</span>
//               </div>
//             </motion.div>

//             {/* Sections with Drag and Drop */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragEnd={handleSectionDragEnd}
//               >
//                 <SortableContext
//                   items={sections.map((s) => s.id)}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   <AnimatePresence mode="popLayout">
//                     {sections.map((section, sectionIndex) => (
//                       <SortableSection
//                         key={section.id}
//                         section={section}
//                         sectionIndex={sectionIndex}
//                         onUpdateSection={updateSection}
//                         onDeleteSection={deleteSection}
//                         onAddLecture={addLecture}
//                         onUpdateLecture={updateLecture}
//                         onDeleteLecture={deleteLecture}
//                         onOpenContentModal={openContentModal}
//                         onReorderLectures={handleReorderLectures}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </SortableContext>
//               </DndContext>

//               {/* Add Section Button */}
//               <Button
//                 variant="outline"
//                 onClick={addSection}
//                 className="w-full border-dashed h-12"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Section
//               </Button>
//             </motion.div>
//           </motion.div>
//         );

//       case "landing-page":
//         return (
//           <motion.div
//             key="landing-page"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants}>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 Course landing page
//               </h2>
//               <p className="text-muted-foreground">
//                 Your course landing page is crucial to your success. It's where
//                 students decide whether to enroll.
//               </p>
//             </motion.div>

//             <Form {...form}>
//               <div className="space-y-6">
//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Course title
//                         </FormLabel>
//                         <FormDescription>
//                           Your title should be a mix of attention-grabbing,
//                           informative, and optimized for search.
//                         </FormDescription>
//                         <FormControl>
//                           <div className="relative">
//                             <Input
//                               placeholder="Insert your course title"
//                               className="bg-background border-border focus:border-primary pr-16"
//                               maxLength={60}
//                               {...field}
//                             />
//                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
//                               {field.value?.length || 0}/60
//                             </span>
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="subtitle"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Course subtitle
//                         </FormLabel>
//                         <FormDescription>
//                           Use 1 or 2 related keywords, and mention 3-4 of the
//                           most important areas that you've covered.
//                         </FormDescription>
//                         <FormControl>
//                           <div className="relative">
//                             <Input
//                               placeholder="Insert your course subtitle"
//                               className="bg-background border-border focus:border-primary pr-20"
//                               maxLength={120}
//                               {...field}
//                             />
//                             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
//                               {field.value?.length || 0}/120
//                             </span>
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Course description
//                         </FormLabel>
//                         <FormDescription>
//                           Description should have minimum 200 words.
//                         </FormDescription>
//                         <FormControl>
//                           <Textarea
//                             placeholder="Insert your course description"
//                             className="bg-background border-border focus:border-primary min-h-[200px]"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div
//                   variants={itemVariants}
//                   className="grid gap-6 sm:grid-cols-2"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Category
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="bg-background border-border">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-popover border-border">
//                             {categories.map((cat) => (
//                               <SelectItem key={cat} value={cat}>
//                                 {cat}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="level"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Level
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="bg-background border-border">
//                               <SelectValue placeholder="Select level" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-popover border-border">
//                             {levels.map((level) => (
//                               <SelectItem key={level} value={level}>
//                                 {level}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants}>
//                   <FormField
//                     control={form.control}
//                     name="language"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-base font-semibold">
//                           Language
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
//                               <SelectValue placeholder="Select language" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent className="bg-popover border-border">
//                             {languages.map((lang) => (
//                               <SelectItem key={lang} value={lang}>
//                                 {lang}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 {/* Thumbnail Upload */}
//                 <motion.div variants={itemVariants} className="space-y-3">
//                   <div>
//                     <h3 className="text-base font-semibold text-foreground">
//                       Course image
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       Upload your course image here. Important guidelines:
//                       750x422 pixels; .jpg, .jpeg, .gif, or .png.
//                     </p>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/jpg,image/png,image/gif"
//                       onChange={handleImageUpload}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       disabled={imageUploading}
//                     />
//                     {courseImage ? (
//                       <div className="border-2 border-primary/50 rounded-xl overflow-hidden bg-muted/30">
//                         <div className="relative aspect-video">
//                           <img
//                             src={courseImage.preview}
//                             alt="Course thumbnail"
//                             className="w-full h-full object-cover"
//                           />
//                           <Button
//                             variant="destructive"
//                             size="icon"
//                             className="absolute top-2 right-2 z-20"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removeCourseImage();
//                             }}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                         <div className="p-3 border-t border-border">
//                           <p className="text-sm text-foreground font-medium truncate">
//                             {courseImage.file.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {(courseImage.file.size / 1024).toFixed(1)} KB
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div
//                         className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
//                           imageUploading
//                             ? "border-primary bg-primary/5"
//                             : "border-border hover:border-primary/50 bg-muted/30"
//                         }`}
//                       >
//                         {imageUploading ? (
//                           <>
//                             <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
//                             <p className="text-foreground font-medium">
//                               Uploading...
//                             </p>
//                           </>
//                         ) : (
//                           <>
//                             <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                             <p className="text-foreground font-medium">
//                               Upload Image
//                             </p>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               Click or drag to upload
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>

//                 {/* Promo Video */}
//                 <motion.div variants={itemVariants} className="space-y-3">
//                   <div>
//                     <h3 className="text-base font-semibold text-foreground">
//                       Promotional video
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       Students who watch a well-made promo video are 5X more
//                       likely to enroll.
//                     </p>
//                   </div>
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={handleVideoUpload}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       disabled={videoUploading || !!promoVideo}
//                     />
//                     {promoVideo ? (
//                       <div className="border-2 border-primary/50 rounded-xl p-4 bg-muted/30">
//                         <div className="flex items-center gap-4">
//                           <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
//                             <Play className="h-8 w-8 text-primary" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-foreground font-medium truncate">
//                               {promoVideo.name}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {promoVideo.size}
//                             </p>
//                           </div>
//                           <Button
//                             variant="destructive"
//                             size="icon"
//                             className="z-20"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removePromoVideo();
//                             }}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ) : videoUploading ? (
//                       <div className="border-2 border-dashed border-primary rounded-xl p-8 bg-primary/5">
//                         <div className="space-y-4">
//                           <Video className="h-12 w-12 mx-auto text-primary" />
//                           <div className="space-y-2">
//                             <Progress
//                               value={videoUploadProgress}
//                               className="h-2"
//                             />
//                             <p className="text-center text-sm text-foreground font-medium">
//                               Uploading... {videoUploadProgress}%
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-muted/30">
//                         <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                         <p className="text-foreground font-medium">
//                           Upload Video
//                         </p>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           Click or drag to upload
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               </div>
//             </Form>
//           </motion.div>
//         );

//       case "pricing":
//         return (
//           <motion.div
//             key="pricing"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants}>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 Pricing
//               </h2>
//               <p className="text-muted-foreground">
//                 Set a price for your course. You can always change it later.
//               </p>
//             </motion.div>

//             <Form {...form}>
//               <motion.div variants={itemVariants}>
//                 <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-base font-semibold">
//                         Course Price (USD)
//                       </FormLabel>
//                       <FormDescription>
//                         Please select the price tier for your course. The price
//                         must be between $19.99 and $199.99.
//                       </FormDescription>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <SelectTrigger className="bg-background border-border w-full sm:w-[200px]">
//                             <SelectValue placeholder="Select price" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-popover border-border">
//                             <SelectItem value="19.99">$19.99</SelectItem>
//                             <SelectItem value="29.99">$29.99</SelectItem>
//                             <SelectItem value="49.99">$49.99</SelectItem>
//                             <SelectItem value="79.99">$79.99</SelectItem>
//                             <SelectItem value="99.99">$99.99</SelectItem>
//                             <SelectItem value="149.99">$149.99</SelectItem>
//                             <SelectItem value="199.99">$199.99</SelectItem>
//                             <SelectItem value="free">Free</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </motion.div>
//             </Form>
//           </motion.div>
//         );

//       case "promotions":
//         return (
//           <motion.div
//             key="promotions"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants}>
//               <h2 className="text-2xl font-bold text-foreground mb-2">
//                 Promotions
//               </h2>
//               <p className="text-muted-foreground">
//                 Create coupons and promotional campaigns to boost your course
//                 sales.
//               </p>
//             </motion.div>

//             <motion.div
//               variants={itemVariants}
//               className="p-8 rounded-xl border border-border bg-muted/30 text-center"
//             >
//               <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-semibold text-foreground mb-2">
//                 No promotions yet
//               </h3>
//               <p className="text-muted-foreground mb-4">
//                 Create your first coupon to share discounts with students.
//               </p>
//               <Button>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Coupon
//               </Button>
//             </motion.div>
//           </motion.div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <SidebarProvider defaultOpen>
//       <div className="min-h-screen flex w-full bg-background">
//         {/* Sidebar */}
//         <Sidebar className="border-r border-border">
//           <SidebarHeader className="p-4 border-b border-border">
//             <Link
//               to="/instructor"
//               className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span className="font-medium">Back to courses</span>
//             </Link>
//           </SidebarHeader>

//           <SidebarContent className="p-2">
//             {sidebarNavigation.map((group) => (
//               <SidebarGroup key={group.group}>
//                 <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
//                   {group.group}
//                 </SidebarGroupLabel>
//                 <SidebarGroupContent>
//                   <SidebarMenu>
//                     {group.items.map((item) => (
//                       <SidebarMenuItem key={item.id}>
//                         <SidebarMenuButton
//                           onClick={() => setActiveSection(item.id)}
//                           isActive={activeSection === item.id}
//                           className="w-full justify-start"
//                         >
//                           <item.icon className="h-4 w-4" />
//                           <span>{item.label}</span>
//                         </SidebarMenuButton>
//                       </SidebarMenuItem>
//                     ))}
//                   </SidebarMenu>
//                 </SidebarGroupContent>
//               </SidebarGroup>
//             ))}
//           </SidebarContent>

//           {/* Progress in footer */}
//           <div className="mt-auto p-4 border-t border-border">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Course Progress</span>
//                 <span className="font-medium text-foreground">
//                   {calculateProgress()}%
//                 </span>
//               </div>
//               <Progress value={calculateProgress()} className="h-2" />
//             </div>
//           </div>
//         </Sidebar>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Sticky Header */}
//           <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <div className="flex items-center justify-between px-6 py-4">
//               <div className="flex items-center gap-4">
//                 <SidebarTrigger />
//                 <div>
//                   <h1 className="text-lg font-bold text-foreground">
//                     {form.watch("title") || "Untitled Course"}
//                   </h1>
//                   <Badge variant="secondary" className="mt-1">
//                     Draft
//                   </Badge>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button variant="outline" className="border-border">
//                   <Eye className="mr-2 h-4 w-4" />
//                   Preview
//                 </Button>
//                 <Button
//                   onClick={form.handleSubmit(onSubmit)}
//                   className="bg-primary hover:bg-primary/90"
//                 >
//                   <Save className="mr-2 h-4 w-4" />
//                   Save
//                 </Button>
//                 <Button className="bg-gradient-primary hover:opacity-90">
//                   Submit for Review
//                 </Button>
//               </div>
//             </div>
//           </header>

//           {/* Content Area */}
//           <main className="flex-1 overflow-auto">
//             <div className="max-w-4xl mx-auto px-6 py-8">
//               <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
//             </div>
//           </main>
//         </div>
//       </div>

//       {/* Content Modal */}
//       {selectedLecture && (
//         <LectureContentModal
//           isOpen={contentModalOpen}
//           onClose={() => {
//             setContentModalOpen(false);
//             setSelectedLecture(null);
//           }}
//           lectureType={selectedLecture.lecture.type}
//           lectureTitle={selectedLecture.lecture.title}
//           initialContent={selectedLecture.lecture.content}
//           onSave={handleSaveContent}
//         />
//       )}
//     </SidebarProvider>
//   );
// };

// export default AddCourse;
