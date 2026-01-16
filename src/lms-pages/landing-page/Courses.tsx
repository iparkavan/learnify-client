"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Palette,
  Database,
  Brain,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const courses = [
  {
    icon: Code,
    title: "Web Development",
    description: "Master modern web technologies",
    courses: "250+ Courses",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Design",
    description: "UI/UX and graphic design",
    courses: "180+ Courses",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Database,
    title: "Data Science",
    description: "Analytics and machine learning",
    courses: "200+ Courses",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Artificial intelligence fundamentals",
    courses: "150+ Courses",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "SEO, social media, and content",
    courses: "120+ Courses",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Business",
    description: "Entrepreneurship and management",
    courses: "190+ Courses",
    color: "from-indigo-500 to-blue-500",
  },
];

const Courses = () => {
  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Popular{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive catalog of courses across multiple disciplines.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full overflow-hidden group cursor-pointer border hover:border-primary/50 transition-all duration-300">
                <CardHeader className="">
                  <div
                    className={`absolute inset-0 bg-linear-to-br rounded-xl ${course.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-xl bg-linear-to-br ${course.color} flex items-center justify-center mb-4`}
                  >
                    <course.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {course.courses}
                    </Badge>
                    <Link
                      href={"/courses"}
                      className="group-hover:text-primary"
                    >
                      View Courses
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
