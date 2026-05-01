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
          type="button"
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
