import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ACTIVE_SECTIONS,
  containerVariants,
  itemVariants,
} from "../../../lms-pages/instructor/course-creation/create-course";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IntendedLeanersProps {
  learningObjectives: string[];
  onLearningObjectivesHandler: (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  setLearningObjectives: Dispatch<SetStateAction<string[]>>;
  prerequisites: string[];
  targetAudience: string[];
  setPrerequisites: Dispatch<SetStateAction<string[]>>;
  setTargetAudience: Dispatch<SetStateAction<string[]>>;
}

const IntendedLeanersSection: React.FC<IntendedLeanersProps> = ({
  learningObjectives,
  onLearningObjectivesHandler,
  setLearningObjectives,
  prerequisites,
  targetAudience,
  setPrerequisites,
  setTargetAudience,
}) => {
  return (
    <motion.div
      key={ACTIVE_SECTIONS.INTENDED_LEARNERS}
      // hidden={{ opacity: 0 }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Intended learners
        </h2>
        <p className="text-muted-foreground">
          The following descriptions will be publicly visible on your Course
          Landing Page and will have a direct impact on your course performance.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            What will students learn in your course?
          </h3>
          <p className="text-sm text-muted-foreground">
            You must enter at least 4 learning objectives or outcomes that
            learners can expect to achieve after completing your course.
          </p>
        </div>
        <div className="space-y-3">
          {learningObjectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Example: ${index === 0 ? "Define the roles and responsibilities of a project manager" : index === 1 ? "Estimate project timelines and budgets" : index === 2 ? "Identify and manage project risks" : "Master project management tools"}`}
                value={objective}
                // onChange={(e) => learningObjectivesHandler(e, index)}
                onChange={(e) => {
                  // const newObjectives = [...learningObjectives];
                  // newObjectives[index] = e.target.value;
                  // setLearningObjectives(newObjectives);
                  onLearningObjectivesHandler(e, index);
                }}
                className="bg-background border-border focus:border-primary"
              />
              {learningObjectives.length > 4 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setLearningObjectives((prev) =>
                      prev.filter((item, i) => i !== index),
                    )
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setLearningObjectives((prev) => [...prev, ""])}
            className="border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add more responses
          </Button>
        </div>
      </motion.div>

      {/* Prerequisites */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            What are the requirements or prerequisites?
          </h3>
          <p className="text-sm text-muted-foreground">
            List the required skills, experience, tools or equipment learners
            should have prior to taking your course.
          </p>
        </div>
        <div className="space-y-3">
          {prerequisites.map((prereq, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Example: No programming experience needed. You will learn everything you need to know"
                value={prereq}
                onChange={(e) => {
                  const newPrereqs = [...prerequisites];
                  newPrereqs[index] = e.target.value;
                  setPrerequisites(newPrereqs);
                }}
                className="bg-background border-border focus:border-primary"
              />
              {prerequisites.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setPrerequisites(
                      prerequisites.filter((_, i) => i !== index),
                    )
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setPrerequisites([...prerequisites, ""])}
            className="border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add more responses
          </Button>
        </div>
      </motion.div>

      {/* Target Audience */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Who is this course for?
          </h3>
          <p className="text-sm text-muted-foreground">
            Write a clear description of the intended learners for your course.
          </p>
        </div>
        <div className="space-y-3">
          {targetAudience.map((audience, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Example: Beginner developers curious about data science"
                value={audience}
                onChange={(e) => {
                  const newAudience = [...targetAudience];
                  newAudience[index] = e.target.value;
                  setTargetAudience(newAudience);
                }}
                className="bg-background border-border focus:border-primary"
              />
              {targetAudience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTargetAudience(
                      targetAudience.filter((_, i) => i !== index),
                    )
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setTargetAudience([...targetAudience, ""])}
            className="border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add more responses
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IntendedLeanersSection;
