"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const { theme } = useTheme();

  const links = {
    product: [
      "Features",
      // "Pricing",
      "Courses",
      //  "Testimonials"
    ],
    company: [
      // "About", "Blog", "Careers",
      "Contact",
    ],
    // resources: ["Help Center", "Community", "Terms", "Privacy"],
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 relative">
              <Image
                src="/logos/logo.png"
                width={180}
                height={100}
                alt="logo"
                className={cn(
                  "absolute",
                  theme === "dark" ? "hidden" : "block"
                )}
              />
              <Image
                src="/logos/logo-dark.png"
                width={180}
                height={100}
                alt="logo"
                className={cn(
                  "absolute",
                  theme === "dark" ? "block" : "hidden"
                )}
              />
              {/* <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                EduPlatform
              </span> */}
            </div>
            <p className="text-muted-foreground my-10 max-w-sm">
              Empowering learners worldwide with accessible, high-quality
              education for everyone.
            </p>
            <div className="flex gap-4">
              {[
                // Facebook, Twitter,
                Instagram,
                Linkedin,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="hover:text-accent hover:scale-110 transition-all duration-200 block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 MaxSkill.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
