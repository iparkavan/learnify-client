import axiosClient from "@/utils/axios-client";

export const getEnrollmentStatus = async (courseId: string) => {
  const res = await axiosClient.get(
    `/enrollments/${courseId}/enrollment-status`
  );
  return res.data;
};
