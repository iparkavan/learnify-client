import { CourseFormData } from "@/schema/course-schema";
import {
  CreateCoursePayload,
  CreateCourseResponse,
  SaveCoursePayload,
} from "@/types/course-types";
import axiosClient from "@/utils/axios-client";

export const getAllCourses = async (): Promise<{}> => {
  const res = await axiosClient.get(`/courses`);
  return res.data;
};

export const saveFullCourseMutateFn = async (payload: SaveCoursePayload) => {
  const res = await axiosClient.post(`/courses/save-full-course`, payload);
  return res.data;
};

export const createCourseMutateFn = async (
  payload: CreateCoursePayload,
): Promise<CreateCourseResponse> => {
  const res = await axiosClient.post(`/courses/create-course`, payload);
  return res.data;
};

export const updateCourseMutateFn = async ({
  courseId,
  data,
}: {
  courseId: string;
  data: CourseFormData;
}) => {
  const res = await axiosClient.put(`/courses/update-course/${courseId}`, data);
  return res.data;
};
