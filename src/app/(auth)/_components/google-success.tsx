"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/utils/contants";
import axiosClient from "@/utils/axios-client";
import { useUserInfoStore } from "@/store/userInfo-store";

export default function GoogleSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUserInfoStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // Save token
    Cookies.set(ACCESS_TOKEN, token);

    // Fetch authenticated user
    axiosClient
      .get("/auth/profile")
      .then((res) => {
        setUser(res.data.user);
        router.replace("/"); // Replace avoids showing this page in history
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return null; // 👈 No UI, nothing rendered
}
