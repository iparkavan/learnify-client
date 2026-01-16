import {
  getCurrentUserQueryFn,
  loginSendOtpMutationFn,
  signupSendOtpMutationFn,
  verifyOtpMutationFn,
} from "@/apis/auth-api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginSendOtp = () => {
  return useMutation({
    mutationKey: ["login-send-otp"],
    mutationFn: loginSendOtpMutationFn,
  });
};

export const useSignupSendOtp = () => {
  return useMutation({
    mutationKey: ["signup-send-otp"],
    mutationFn: signupSendOtpMutationFn,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOtpMutationFn,
  });
};

export const useCurrentUserInfo = () => {
  // const hasAuthCookie = () => {
  //   return !!Cookies.get("token"); // replace with your cookie name
  // };

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
    // enabled: hasAuthCookie(),
  });
  return query;
};
