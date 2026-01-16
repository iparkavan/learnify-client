import { studentProfileMutationFn } from "@/apis/student-profile-service";
import { useMutation } from "@tanstack/react-query";

const useStudentProfileSetup = () => {
  return useMutation({
    mutationKey: ["student-profile-setup"],
    mutationFn: studentProfileMutationFn,
  });
};

export { useStudentProfileSetup };
