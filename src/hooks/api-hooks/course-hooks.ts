import { updateCourseMutateFn } from "@/apis/course-api";
import { CourseFormData } from "@/schema/course-schema";
import { useMutation } from "@tanstack/react-query";

export const useUpdateCourse = () => {
  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CourseFormData;
    }) => updateCourseMutateFn({ courseId, data }),
    mutationKey: ["update-course"],
  });
};
