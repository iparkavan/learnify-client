import { StudentProfileSetupResponse } from "@/types/auth-types";
import axiosClient from "@/utils/axios-client";

const studentProfileMutationFn = async (
  profileData: any
): Promise<StudentProfileSetupResponse> => {
  const res = axiosClient.post("/profile-setup/student", profileData);
  return (await res).data;
};

export { studentProfileMutationFn };
