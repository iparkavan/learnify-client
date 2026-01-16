import { getEnrollmentStatus } from "@/apis/enrollment-api";
import { useQuery } from "@tanstack/react-query";

export const useGetEnrollmentStatus = (courseId: string) => {
  return useQuery({
    queryKey: ["enrollment-status", courseId],
    queryFn: () => getEnrollmentStatus(courseId),
  });
};
