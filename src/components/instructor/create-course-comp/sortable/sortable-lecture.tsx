import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Trash2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { LectureType } from "@/lms-pages/instructor/course-creation/create-course";

interface Lecture {
  id: string;
  title: string;
  type: LectureType;
  duration: number;
  isExpanded?: boolean;
  hasContent?: boolean;
}

interface SortableLectureProps {
  lecture: Lecture;
  sectionId: string;
  getLectureIcon: (type: Lecture["type"]) => ReactNode;
  onUpdateLecture: (
    sectionId: string,
    lectureId: string,
    updates: Partial<Lecture>,
  ) => void;
  onDeleteLecture: (sectionId: string, lectureId: string) => void;
  onOpenContentModal: (sectionId: string, lecture: Lecture) => void;
}

export const SortableLecture = ({
  lecture,
  sectionId,
  getLectureIcon,
  onUpdateLecture,
  onDeleteLecture,
  onOpenContentModal,
}: SortableLectureProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lecture.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`border border-border rounded-lg bg-background ${
        isDragging ? "shadow-lg ring-2 ring-primary/20 z-50" : ""
      }`}
    >
      <div className="p-3 flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
        <div className="flex items-center gap-2 text-muted-foreground">
          {getLectureIcon(lecture.type)}
          <span className="text-xs capitalize">{lecture.type}</span>
        </div>
        <Input
          value={lecture.title}
          onChange={(e) =>
            onUpdateLecture(sectionId, lecture.id, { title: e.target.value })
          }
          placeholder="Enter lecture title"
          className="flex-1 bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
        />
        {lecture.hasContent ? (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Content Added
          </Badge>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenContentModal(sectionId, lecture)}
          className="text-primary hover:text-white transition-colors"
        >
          <Upload className="h-4 w-4 mr-1" />
          {lecture.hasContent ? "Edit" : "Add"} Content
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteLecture(sectionId, lecture.id)}
          className="text-muted-foreground hover:text-destructive h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
