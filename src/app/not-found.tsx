"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { UserRole } from "@/utils/contants";

type TokenPayload = {
  role?: UserRole;
};

export default function NotFound() {
  const [homeRoute, setHomeRoute] = useState("/");

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      switch (decoded.role) {
        case UserRole.ADMIN:
          setHomeRoute("/admin");
          break;

        case UserRole.INSTRUCTOR:
          setHomeRoute("/instructor");
          break;

        case UserRole.STUDENT:
          setHomeRoute("/");
          break;

        default:
          setHomeRoute("/");
      }
    } catch {
      setHomeRoute("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold text-gray-800"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-600 mt-4 text-lg"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8"
      >
        <Link href={homeRoute} className={buttonVariants()}>
          <HomeIcon size={20} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
