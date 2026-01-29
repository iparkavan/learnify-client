import { Dispatch, SetStateAction, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  Trash2,
  Plus,
  Play,
  FileText,
  HelpCircle,
  Code,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Lecture,
  LectureType,
  Section,
} from "@/lms-pages/instructor/course-creation/create-course";
import { SortableLecture } from "./sortable-lecture";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// interface Lecture {
//   id: string;
//   title: string;
//   type: "video" | "text" | "quiz" | "coding" | "assignment";
//   duration: string;
//   isExpanded?: boolean;
//   hasContent?: boolean;
// }

// interface Section {
//   id: string;
//   title: string;
//   objective: string;
//   lectures: Lecture[];
// }

interface SortableSectionProps {
  section: Section;
  sectionIndex: number;
  onUpdateSection: (sectionId: string, updates: Partial<Section>) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddLecture: (sectionId: string, type: Lecture["type"]) => void;
  onUpdateLecture: (
    sectionId: string,
    lectureId: string,
    updates: Partial<Lecture>,
  ) => void;
  openAccordionSections: string[];
  setOpenAccordionSections: Dispatch<SetStateAction<string[]>>;
  onDeleteLecture: (sectionId: string, lectureId: string) => void;
  onOpenContentModal: (sectionId: string, lecture: Lecture) => void;
  onReorderlectures: (sectionId: string, newLectureOrder: string[]) => void;
}

export const SortableSection = ({
  section,
  sectionIndex,
  onUpdateSection,
  onDeleteSection,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture,
  onOpenContentModal,
  onReorderlectures,
  openAccordionSections,
  setOpenAccordionSections,
}: SortableSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const handleLectureDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = section.lectures.findIndex(
        (l: Lecture) => l.id === active.id,
      );
      const newIndex = section.lectures.findIndex(
        (l: Lecture) => l.id === over.id,
      );
      const newLectureOrder = Array.from(section.lectures.map((l) => l.id));
      const [movedLecture] = newLectureOrder.splice(oldIndex, 1);
      newLectureOrder.splice(newIndex, 0, movedLecture);
      onReorderlectures(section.id, newLectureOrder);
    }
  };

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

      default:
        return null; // optional fallback
    }
  };

  const totalDuration = section.lectures.reduce(
    (acc, l) => acc + l.duration,
    0,
  );

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`border border-border rounded-lg bg-card overflow-hidden ${
        isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
      }`}
    >
      <Accordion
        type="multiple"
        value={openAccordionSections}
        onValueChange={setOpenAccordionSections}
        className="space-y-4"
      >
        {/* Section Header */}
        <AccordionItem key={section.id} value={String(section.id)}>
          {/* Header Row */}
          <div className="bg-muted/50 border-b border-border p-4 space-y-2">
            <div className="flex items-center justify-between w-full">
              {/* LEFT CONTENT */}
              <div className="flex items-center gap-3 flex-1">
                {/* Drag Handle */}
                <button
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing touch-none"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                </button>

                {/* Section Label */}
                <span className="font-semibold whitespace-nowrap">
                  Section {sectionIndex + 1}:
                </span>

                {/* Title Input */}
                <Input
                  value={section.title}
                  onChange={(e) =>
                    onUpdateSection(section.id, { title: e.target.value })
                  }
                  placeholder="Enter section title"
                  className="flex-1 bg-background h-9"
                />

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{section.lectures.length} lectures</span>
                  {totalDuration > 0 && (
                    <>
                      <span>•</span>
                      <span>{totalDuration} min</span>
                    </>
                  )}
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSection(section.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* RIGHT ACCORDION TRIGGER */}
              <AccordionTrigger className="ml-4" />
            </div>

            <div className="">
              <Input
                value={section.objective}
                onChange={(e) =>
                  onUpdateSection(section.id, { objective: e.target.value })
                }
                placeholder="What will students be able to do at the end of this section?"
                className="bg-background border-border text-sm"
              />
            </div>
          </div>

          {/* lectures - Collapsible Content */}
          <AccordionContent className="flex p-4 flex-col gap-4 text-balance">
            <motion.div
              className=" space-y-2"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleLectureDragEnd}
              >
                <SortableContext
                  items={section.lectures.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    {section.lectures.map((lecture) => {
                      const lectureWithDefaults = {
                        ...lecture,
                        isExpanded: lecture.isExpanded ?? false,
                      };
                      return (
                        <SortableLecture
                          key={lecture.id}
                          lecture={lectureWithDefaults}
                          sectionId={section.id}
                          getLectureIcon={getLectureIcon}
                          onUpdateLecture={onUpdateLecture}
                          onDeleteLecture={onDeleteLecture}
                          onOpenContentModal={(sectionId, lec) =>
                            onOpenContentModal(sectionId, {
                              ...lec,
                              isExpanded: lec.isExpanded ?? false,
                            })
                          }
                        />
                      );
                    })}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>

              {section.lectures.length === 0 && (
                <div className="text-center text-muted-foreground text-sm">
                  No lectures yet. Add your first lecture below.
                </div>
              )}

              {/* Add Curriculum Item */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLecture(section.id, LectureType.VIDEO)}
                  className="border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Lecture
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLecture(section.id, LectureType.QUIZ)}
                  className="border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLecture(section.id, LectureType.CODING)}
                  className="border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Coding Exercise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onAddLecture(section.id, LectureType.ASSIGNMENT)
                  }
                  className="border-dashed"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assignment
                </Button>
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};
