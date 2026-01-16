"use client";

import { useCurrentUserInfo } from "@/hooks/auth-hook";
import { useUserInfoStore } from "@/store/userInfo-store";
import { UserInfoType } from "@/types/user-types";
import { useEffect } from "react";

export function UserProvider({
  children,
}: // initialUser,
{
  children: React.ReactNode;
  // initialUser: UserInfoType | null;
}) {
  const { setUser } = useUserInfoStore();
  const { data, isSuccess } = useCurrentUserInfo();

  // ✅ Sync initial user from SSR
  // useEffect(() => {
  //   if (initialUser) setUser(initialUser);
  // }, [initialUser, setUser]);

  useEffect(() => {
    if (isSuccess && data?.user) {
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        studentProfile: data.user.studentProfile,
        instructorProfile: data.user.instructorProfile,
      });
    }
  }, [data, isSuccess, setUser]);

  return <>{children}</>;
}
