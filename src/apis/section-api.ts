import { Section } from "@/lms-pages/instructor/course-creation/edit-course";
import axiosClient from "@/utils/axios-client";

export const createSectionMutateFn = async ({
  courseId,
}: {
  courseId: string;
}) => {
  const res = await axiosClient.post(
    `/instructor/sections/${courseId}/create-section`,
  );

  return res.data;
};

export const deleteSectionMutateFn = async (sectionId: string) => {
  const res = await axiosClient.delete(`/instructor/sections/${sectionId}`);
  return res.data;
};

export const updateSectionMutateFn = async (
  sectionId: string,
  sectionData: Partial<Section>,
) => {
  const res = await axiosClient.patch(
    `/instructor/sections/${sectionId}`,
    sectionData,
  );
  return res.data;
};
