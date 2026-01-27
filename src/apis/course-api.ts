import { SaveCoursePayload } from "@/types/course-types";
import axiosClient from "@/utils/axios-client";

export const getAllCourses = async (): Promise<{}> => {
  const res = await axiosClient.get(`/courses`);
  return res.data;
};

export const saveFullCourseMutateFn = async (payload: SaveCoursePayload) => {
  const res = await axiosClient.post(`/course/save-full-course`, payload);
  return res.data;
};
