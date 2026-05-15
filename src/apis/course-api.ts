import { CourseFormData } from "@/schema/course-schema";
import {
  CreateCoursePayload,
  CreateCourseResponse,
  SaveCoursePayload,
} from "@/types/course-types";
import { GetCourseByIdResponse } from "@/types/instructor-course-types";
import axiosClient from "@/utils/axios-client";

export const getAllCourses = async (): Promise<{}> => {
  const res = await axiosClient.get(`/courses`);
  return res.data;
};

// INSTRUCTOR COURSES API

export const saveFullCourseMutateFn = async (payload: SaveCoursePayload) => {
  const res = await axiosClient.post(`/courses/save-full-course`, payload);
  return res.data;
};

export const createCourseMutateFn = async (
  payload: CreateCoursePayload,
): Promise<CreateCourseResponse> => {
  const res = await axiosClient.post(
    `/instructor/courses/create-course`,
    payload,
  );
  return res.data;
};

export const updateCourseMutateFn = async ({
  courseId,
  data,
}: {
  courseId: string;
  data: CourseFormData;
}) => {
  const res = await axiosClient.put(
    `/instructor/courses/update-course/${courseId}`,
    data,
  );
  return res.data;
};

export const getCourseByIdQueryFn = async ({
  courseId,
}: {
  courseId: string;
}): Promise<GetCourseByIdResponse> => {
  const res = await axiosClient.get(`/instructor/courses/${courseId}`);
  return res.data;
};

export const deleteCourseByIdMutateFn = async (courseId: string) => {
  const res = await axiosClient.delete(`/instructor/courses/${courseId}`);
  return res.data;
};

export const getAllInstructorCoursesQueryFn = async () => {
  const res = await axiosClient.get("/courses/get-instructor-courses");

  return res.data.instructorCourse;
};
