"use client";
import { ReactNode, useEffect } from "react";
import { useCurrentUserInfo } from "@/hooks/auth-hook";
import { useRouter } from "next/navigation";
import { UserRole } from "@/utils/contants";
import { useUserInfoStore } from "@/store/userInfo-store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedProfileSetupRoute({
  children,
}: ProtectedRouteProps) {
  const { user } = useUserInfoStore();
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.replace("/login");
    //   return;
    // }

    if (user?.role === UserRole.STUDENT && !user.studentProfile) {
      router.replace("/student-profile-setup");
    }

    if (user?.role === UserRole.INSTRUCTOR && !user.instructorProfile) {
      router.replace("/instructor/profile-setup");
    }
  }, [user, router]);

  // Prevent rendering children until checks are done
  if (!user) return null;

  return <>{children}</>;
}

// import { cookies } from "next/headers";
// import { UserInfoType } from "@/types/user-types";
// import { ACCESS_TOKEN } from "./contants";
// import jwt, { JwtPayload } from "jsonwebtoken";

// export async function getCurrentUser(): Promise<UserInfoType | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(ACCESS_TOKEN)?.value;

//   if (!token) return null;

//   try {
//     const decoded = jwt.decode(token) as JwtPayload | null;

//     if (
//       !decoded ||
//       typeof decoded !== "object" ||
//       !decoded.userId ||
//       !decoded.email ||
//       !decoded.role
//     ) {
//       return null;
//     }

//     // ✅ Map only needed fields to match your UserInfo type
//     return {
//       id: decoded.userId as string,
//       name: decoded.name as string,
//       email: decoded.email as string,
//       role: decoded.role as "ADMIN" | "INSTRUCTOR" | "STUDENT",
//     };
//   } catch (err) {
//     console.error("Failed to decode token:", err);
//     return null;
//   }
// }
