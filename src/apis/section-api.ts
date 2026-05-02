import axiosClient from "@/utils/axios-client";

export const createSectionMutateFn = async ({
  courseId,
}: {
  courseId: string;
}) => {
  const res = await axiosClient.post(
    `/instructor/courses/${courseId}/create-section`,
  );

  return res.data;
};
