import axiosClient from "@/utils/axios-client";

export const contactUsMutationFn = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  const res = await axiosClient.post(`/contact-us`, data);
  return res.data;
};
