import {
  LoginResponseType,
  UserInfoProfileType,
  UserType,
} from "@/types/auth-types";
import axiosClient from "@/utils/axios-client";
import { UserRoleType } from "@/utils/contants";

export const loginSendOtpMutationFn = async (data: {
  email: string;
  name?: string;
}): Promise<{ message: string; email: string; name?: string }> => {
  const res = await axiosClient.post(`/auth/login/send-otp`, data);
  return res.data;
};

export const signupSendOtpMutationFn = async (data: {
  email: string;
  name?: string;
}): Promise<{ message: string; email: string; name?: string }> => {
  const res = await axiosClient.post(`/auth/signup/send-otp`, data);
  return res.data;
};

export const verifyOtpMutationFn = async (data: {
  email: string;
  otp: string;
  name?: string;
  type: UserRoleType;
}): Promise<LoginResponseType> => {
  const res = await axiosClient.post(`/auth/verify-otp`, data);
  return res.data;
};

export const getCurrentUserQueryFn = async (): Promise<{
  message: string;
  user: UserInfoProfileType;
}> => {
  const res = await axiosClient.get(`/user/me`);
  return res.data;
};
