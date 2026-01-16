import { contactUsMutationFn } from "@/apis/contact-us-api";
import { useMutation } from "@tanstack/react-query";

export const useContactUs = () => {
  return useMutation({
    mutationKey: ["contact-us"],
    mutationFn: contactUsMutationFn,
  });
};
