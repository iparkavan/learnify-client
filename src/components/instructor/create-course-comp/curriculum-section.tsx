import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  Lecture,
  LectureType,
  Section,
} from "../../../lms-pages/instructor/course-creation/create-course";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, FileText, HelpCircle, Play, Plus } from "lucide-react";
import {
  closestCenter,
  DndContext,
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
import { SortableSection } from "./sortable/sortable-section";

const getLectureIcon = (type: Lecture["type"]) => {
  switch (type) {
    case LectureType.VIDEO:
      return <Play className="h-4 w-4" />;
    case LectureType.TEXT:
      return <FileText className="h-4 w-4" />;
    case LectureType.QUIZ:
      return <HelpCircle className="h-4 w-4" />;
    case LectureType.CODING:
      return <Code className="h-4 w-4" />;
    case LectureType.ASSIGNMENT:
      return <BookOpen className="h-4 w-4" />;
  }
};

interface CurriculumSectionProps {
  sections: Section[];
  onAddSectionHandler: () => void;
  onAddLecture: (sectionId: string, type: Lecture["type"]) => void;
  totalLectures: number;
  openContentModal: (sectionId: string, lecture: Lecture) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeletelecture: (sectionId: string, lectureId: string) => void;
  onUpdatelecture: (
    sectionId: string,
    lectureId: string,
    update: Partial<Lecture>,
  ) => void;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  openAccordionSections: string[];
  setOpenAccordionSections: Dispatch<SetStateAction<string[]>>;
  // sensors: Sensors;
  handleSectionDragEnd: (event: DragEndEvent) => void;
  onReorderLectures: (sectionId: string, newLectureOrder: string[]) => void;
}

const CurriculumSection: React.FC<CurriculumSectionProps> = ({
  sections,
  onAddSectionHandler,
  onAddLecture,
  totalLectures,
  openContentModal,
  onDeleteSection,
  onDeletelecture,
  onUpdatelecture,
  onUpdateSection,
  openAccordionSections,
  setOpenAccordionSections,
  // sensors,
  handleSectionDragEnd,
  onReorderLectures,
}) => {
  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <motion.div
      key="curriculum"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-start justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Curriculum
          </h2>
          <p className="text-muted-foreground">
            Start putting together your course by creating sections, lectures
            and practice activities.
            <span className="block text-sm mt-1 text-primary">
              Drag sections and lectures to reorder them.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{sections.length} sections</span>
          <span>•</span>
          <span>{totalLectures} lectures</span>
        </div>
      </motion.div>

      {/* Sections with Drag and Drop */}
      <motion.div variants={itemVariants} className="space-y-4">
        <DndContext
          sensors={sensors as any}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {sections.map((section, sectionIndex) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  onUpdateSection={onUpdateSection}
                  onDeleteSection={onDeleteSection}
                  onAddLecture={onAddLecture}
                  onUpdateLecture={onUpdatelecture}
                  onDeleteLecture={onDeletelecture}
                  onOpenContentModal={openContentModal}
                  onReorderlectures={onReorderLectures}
                  openAccordionSections={openAccordionSections}
                  setOpenAccordionSections={setOpenAccordionSections}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>

        {/* Add Section Button */}
        <Button
          variant="outline"
          onClick={onAddSectionHandler}
          className="w-full border-dashed h-12"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Section
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CurriculumSection;

// // ------------------old part -------------------------
//     <motion.div
//       key="curriculum"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-6"
//     >
//       <motion.div
//         variants={itemVariants}
//         className="flex items-start justify-between"
//       >
//         <div>
//           <h2 className="text-2xl font-bold text-foreground mb-2">
//             Curriculum
//           </h2>
//           <p className="text-muted-foreground">
//             Start putting together your course by creating sections, lectures
//             and practice activities.
//           </p>
//         </div>
//         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//           <span>{sections.length} sections</span>
//           <span>•</span>
//           <span>{totalLectures} lectures</span>
//         </div>
//       </motion.div>

//       {/* Sections */}
//       <motion.div variants={itemVariants} className="space-y-4">
//         <AnimatePresence mode="popLayout">
//           <Accordion
//             // type="multiple"
//             // defaultValue={sections.map((section) => String(section.id))}
//             // className="space-y-4"
//             type="multiple"
//             value={openAccordionSections}
//             onValueChange={setOpenAccordionSections}
//             className="space-y-4"
//             // defaultValue="item-1"
//           >
//             {sections.map((section, sectionIndex) => (
//               <AccordionItem key={section.id} value={String(section.id)}>
//                 <motion.div
//                   layout
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="border border-border rounded-lg bg-card overflow-hidden"
//                 >
//                   <AccordionTrigger
//                     className="bg-muted/50 p-4 border-b border-border flex items-center"
//                     // onClick={(e) => e.preventDefault()}
//                   >
//                     {/* Section Header */}
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3">
//                         <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
//                         <span className="font-semibold text-foreground">
//                           Section {sectionIndex + 1}:
//                         </span>
//                         <Input
//                           value={section.title}
//                           onChange={(e) =>
//                             onUpdateSection(section.id, {
//                               title: e.target.value,
//                             })
//                           }
//                           onClick={(e) => e.stopPropagation()}
//                           placeholder="Enter section title"
//                           className="flex-1 bg-background border-border h-9"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             onDeleteSection(section.id);
//                           }}
//                           className="text-muted-foreground hover:text-destructive"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                       <div className="mt-3 pl-8">
//                         <Input
//                           value={section.objective}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) =>
//                             onUpdateSection(section.id, {
//                               objective: e.target.value,
//                             })
//                           }
//                           placeholder="What will students be able to do at the end of this section?"
//                           className="bg-background border-border text-sm"
//                         />
//                       </div>
//                     </div>
//                   </AccordionTrigger>
//                   <AccordionContent className="flex p-4 flex-col gap-4 text-balance">
//                     <div className="space-y-2">
//                       <AnimatePresence mode="popLayout">
//                         {section.Lectures.map((lecture, lectureIndex) => (
//                           <motion.div
//                             key={lecture.id}
//                             layout
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                             className="border border-border rounded-lg bg-background"
//                           >
//                             <div className="p-2 flex items-center gap-3">
//                               <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
//                               <div className="flex items-center gap-2 text-muted-foreground">
//                                 {getLectureIcon(lecture.type)}
//                                 <span className="text-xs capitalize">
//                                   {lecture.type}
//                                 </span>
//                               </div>
//                               <Input
//                                 value={lecture.title}
//                                 onChange={(e) =>
//                                   onUpdatelecture(section.id, lecture.id, {
//                                     title: e.target.value,
//                                   })
//                                 }
//                                 placeholder="Enter lecture title"
//                                 className="flex-1 bg-transparent border p-2 h-auto focus-visible:ring-0"
//                               />

//                               {lecture.hasContent ? (
//                                 <Badge
//                                   variant="secondary"
//                                   className="bg-primary/10 text-primary"
//                                 >
//                                   <CheckCircle2 className="h-3 w-3 mr-1" />
//                                   Content Added
//                                 </Badge>
//                               ) : null}
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-primary hover:text-white"
//                                 onClick={() =>
//                                   openContentModal(section.id, lecture)
//                                 }
//                               >
//                                 <Upload className="h-4 w-4 mr-1" />
//                                 Content
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() =>
//                                   onDeletelecture(section.id, lecture.id)
//                                 }
//                                 className="text-muted-foreground hover:text-destructive h-8 w-8"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </AnimatePresence>

//                       {/* Add Curriculum Item */}
//                       <div className="flex items-center gap-2 pt-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onAddLecture(section.id, "video")}
//                           className="border-dashed"
//                         >
//                           <Plus className="h-4 w-4 mr-1" />
//                           Lecture
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onAddLecture(section.id, "quiz")}
//                           className="border-dashed"
//                         >
//                           <Plus className="h-4 w-4 mr-1" />
//                           Quiz
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onAddLecture(section.id, "coding")}
//                           className="border-dashed"
//                         >
//                           <Plus className="h-4 w-4 mr-1" />
//                           Coding Exercise
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onAddLecture(section.id, "assignment")}
//                           className="border-dashed"
//                         >
//                           <Plus className="h-4 w-4 mr-1" />
//                           Assignment
//                         </Button>
//                       </div>
//                     </div>
//                   </AccordionContent>
//                 </motion.div>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </AnimatePresence>

//         {/* Add Section Button */}
//         <Button
//           variant="outline"
//           onClick={onAddSectionHandler}
//           className="w-full border-dashed h-12"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Section
//         </Button>
//       </motion.div>
//     </motion.div>
