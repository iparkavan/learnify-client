import { LectureType } from "@/lms-pages/instructor/course-creation/edit-course";
import { Lecture } from "@/types/course-types";
import axiosClient from "@/utils/axios-client";

export const createLectureMutateFn = async ({
  sectionId,
  type,
}: {
  sectionId: string;
  type: LectureType;
}) => {
  const res = await axiosClient.post(
    `/instructor/lectures/${sectionId}/create-lecture`,
    { type },
  );
  return res.data;
};

export const updateLectureMutateFn = async (
  lectureId: string,
  data: Partial<Lecture>,
) => {
  const res = await axiosClient.patch(
    `/instructor/lectures/${lectureId}`,
    data,
  );
  return res.data;
};

export const deleteLectureMutateFn = async (lectureId: string) => {
  const res = await axiosClient.delete(`/instructor/lectures/${lectureId}`);
  return res.data;
};
