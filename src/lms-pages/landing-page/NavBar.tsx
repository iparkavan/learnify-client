"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeModeToggle } from "@/components/Theme/theme-toggle";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/routes";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useUserInfoStore } from "@/store/userInfo-store";
import { UserAvatarDropdownMenu } from "@/app/(root)/_components/user-avatar-dropdown-menu";
import { ACCESS_TOKEN } from "@/utils/contants";
import Cookies from "js-cookie";

const Navbar = () => {
  const { user } = useUserInfoStore();
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  const router = useRouter();

  const { clearUser } = useUserInfoStore();

  const logoutHandler = () => {
    Cookies.remove(ACCESS_TOKEN);
    clearUser();
    router.push(LOGIN_ROUTE);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/10 backdrop-blur-md border-b border-border"
    >
      <div className="px-4 mx-auto">
        <div className="flex h-18 items-center justify-between">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Image
                src="/logos/logo.png"
                width={180}
                height={100}
                alt="logo"
                // className={theme === "dark" ? "hidden" : "block"}
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-8"
          >
            {!user && (
              <>
                <a
                  href="/#hero"
                  className="hover:text-primary transition-all duration-200 hover:scale-125"
                >
                  Hero
                </a>
                <a
                  href="/#features"
                  className="hover:text-primary transition-all duration-200 hover:scale-125"
                >
                  Features
                </a>
                <a
                  href="/#courses"
                  className="hover:text-primary transition-all duration-200 hover:scale-125"
                >
                  Courses
                </a>

                {/* <a
                  href="/#pricing"
                  className="hover:text-primary transition-all duration-200 hover:scale-125"
                >
                  Pricing
                </a> */}
              </>
            )}
            <div className="flex items-center gap-2">
              <div className="">
                <ThemeModeToggle />
              </div>
              {!user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push(LOGIN_ROUTE)}
                    className="hover:text-white transition-all duration-200"
                  >
                    Log In
                  </Button>
                  <Button onClick={() => router.push(SIGNUP_ROUTE)}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <div
                  className="py-6 px-2"
                  onMouseEnter={() => setIsAvatarMenuOpen(true)}
                  onMouseLeave={() => setIsAvatarMenuOpen(false)}
                >
                  <UserAvatarDropdownMenu
                    isAvatarMenuOpen={isAvatarMenuOpen}
                    setIsOpenAvatarMenuOpen={setIsAvatarMenuOpen}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="flex flex-col gap-4">
              {!user ? (
                <>
                  <a
                    href="/#hero"
                    className="hover:text-primary transition-all duration-200 hover:scale-125"
                  >
                    Hero
                  </a>
                  <a
                    href="/#features"
                    className="hover:text-primary transition-all duration-200 hover:scale-125"
                  >
                    Features
                  </a>
                  <a
                    href="/#courses"
                    className="hover:text-primary transition-all duration-200 hover:scale-125"
                  >
                    Courses
                  </a>
                </>
              ) : (
                <>
                  <Button
                    // href="/#pricing"
                    onClick={logoutHandler}
                    variant={"destructive"}
                    // className="text-foreground hover:text-primary transition-colors"
                  >
                    Logout
                  </Button>
                </>
              )}
              <ThemeModeToggle />

              {!user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push(LOGIN_ROUTE);
                    }}
                    className="hover:text-white transition-all duration-200"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => {
                      router.push(SIGNUP_ROUTE);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <div
                  className=""
                  onMouseEnter={() => setIsAvatarMenuOpen(true)}
                  onMouseLeave={() => setIsAvatarMenuOpen(false)}
                >
                  <UserAvatarDropdownMenu
                    isAvatarMenuOpen={isAvatarMenuOpen}
                    setIsOpenAvatarMenuOpen={setIsAvatarMenuOpen}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

// "use client";

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { BookOpen, Menu, X } from "lucide-react";
// import { useState } from "react";
// import { ThemeModeToggle } from "@/components/Theme/theme-toggle";
// import { useRouter } from "next/navigation";
// import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/routes";

// const Navbar = () => {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed top-0 left-0 right-0 z-50 bg-background/10 backdrop-blur-md border-b border-border"
//     >
//       <div className=" mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="flex items-center gap-2"
//           >
//             <BookOpen className="h-8 w-8 text-primary" />
//             <span className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
//               EduPlatform
//             </span>
//           </motion.div>

//           {/* Desktop Menu */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="hidden md:flex items-center gap-8"
//           >
//             <a
//               href="#features"
//               className="hover:text-accent transition-all duration-200 hover:scale-110"
//             >
//               Features
//             </a>
//             <a
//               href="#courses"
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Courses
//             </a>
//             <a
//               href="#pricing"
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Pricing
//             </a>
//             <div className="flex items-center gap-2">
//               <div>
//                 <ThemeModeToggle />
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => router.push(LOGIN_ROUTE)}
//                 className="hover:text-white transition-all duration-200"
//               >
//                 Log In
//               </Button>
//               <Button onClick={() => router.push(SIGNUP_ROUTE)}>Sign Up</Button>
//             </div>
//             {/* <Button className="bg-linear-to-r bg-primary to-accent">
//               Get Started
//             </Button> */}
//           </motion.div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden text-foreground"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden pt-4 pb-2 text-center"
//           >
//             <div className="flex flex-col gap-4">
//               <a
//                 href="#features"
//                 className="text-foreground hover:text-primary transition-colors"
//               >
//                 Features
//               </a>
//               <a
//                 href="#courses"
//                 className="text-foreground hover:text-primary transition-colors"
//               >
//                 Courses
//               </a>
//               <a
//                 href="#pricing"
//                 className="text-foreground hover:text-primary transition-colors"
//               >
//                 Pricing
//               </a>

//               <Button
//                 variant="outline"
//                 onClick={() => router.push(LOGIN_ROUTE)}
//                 className="hover:text-white transition-all duration-200"
//               >
//                 Log In
//               </Button>
//               <Button onClick={() => router.push(SIGNUP_ROUTE)}>Sign Up</Button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
