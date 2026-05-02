import axiosClient from "@/utils/axios-client";

export const createSectionMutateFn = async ({
  courseId,
  payload,
}: {
  courseId: string;
  payload: {
    title: string;
  };
}) => {
  const res = await axiosClient.post(
    `/instructor/courses/${courseId}/create-section`,
    payload,
  );

  return res.data;
};
