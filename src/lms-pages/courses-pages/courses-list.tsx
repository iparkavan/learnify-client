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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Palette,
  Database,
  Brain,
  Megaphone,
  TrendingUp,
  Star,
  Clock,
  Users,
  Search,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/course-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserInfoStore } from "@/store/userInfo-store";
import { getInitialConverter } from "@/utils/initial-converter";

const courses = [
  {
    id: 1,
    icon: Code,
    title: "Complete Web Development Bootcamp 2024",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    reviews: 325420,
    students: 850000,
    price: "$89.99",
    originalPrice: "$149.99",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    duration: "52 hours",
    lectures: 380,
    level: "All Levels",
    category: "Web Development",
    color: "from-blue-500 to-cyan-500",
    bestseller: true,
  },
  {
    id: 2,
    icon: Brain,
    title: "Machine Learning A-Z: AI, Python & R",
    instructor: "Kirill Eremenko",
    rating: 4.5,
    reviews: 168540,
    students: 520000,
    price: "$94.99",
    originalPrice: "$159.99",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    duration: "44 hours",
    lectures: 320,
    level: "Intermediate",
    category: "AI & Machine Learning",
    color: "from-orange-500 to-red-500",
    bestseller: true,
  },
  {
    id: 3,
    icon: Palette,
    title: "UI/UX Design Specialization",
    instructor: "Daniel Schifano",
    rating: 4.8,
    reviews: 94230,
    students: 380000,
    price: "$79.99",
    originalPrice: "$139.99",
    image:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=450&fit=crop",
    duration: "28 hours",
    lectures: 215,
    level: "Beginner",
    category: "Design",
    color: "from-purple-500 to-pink-500",
    bestseller: false,
  },
  {
    id: 4,
    icon: Database,
    title: "The Complete SQL Bootcamp 2024",
    instructor: "Jose Portilla",
    rating: 4.6,
    reviews: 128450,
    students: 450000,
    price: "$84.99",
    originalPrice: "$144.99",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop",
    duration: "36 hours",
    lectures: 280,
    level: "All Levels",
    category: "Data Science",
    color: "from-green-500 to-emerald-500",
    bestseller: true,
  },
  {
    id: 5,
    icon: Megaphone,
    title: "Digital Marketing Masterclass",
    instructor: "Phil Ebiner",
    rating: 4.5,
    reviews: 85620,
    students: 320000,
    price: "$74.99",
    originalPrice: "$134.99",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    duration: "24 hours",
    lectures: 190,
    level: "Beginner",
    category: "Digital Marketing",
    color: "from-yellow-500 to-orange-500",
    bestseller: false,
  },
  {
    id: 6,
    icon: TrendingUp,
    title: "Business Strategy & Entrepreneurship",
    instructor: "Chris Haroun",
    rating: 4.7,
    reviews: 72340,
    students: 280000,
    price: "$69.99",
    originalPrice: "$129.99",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    duration: "32 hours",
    lectures: 245,
    level: "Intermediate",
    category: "Business",
    color: "from-indigo-500 to-blue-500",
    bestseller: false,
  },
  {
    id: 7,
    icon: Code,
    title: "React - The Complete Guide 2024",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.8,
    reviews: 215680,
    students: 680000,
    price: "$89.99",
    originalPrice: "$149.99",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    duration: "48 hours",
    lectures: 410,
    level: "All Levels",
    category: "Web Development",
    color: "from-blue-500 to-cyan-500",
    bestseller: true,
  },
  {
    id: 8,
    icon: Brain,
    title: "Deep Learning Specialization",
    instructor: "Andrew Ng",
    rating: 4.9,
    reviews: 186540,
    students: 590000,
    price: "$99.99",
    originalPrice: "$169.99",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop",
    duration: "56 hours",
    lectures: 385,
    level: "Advanced",
    category: "AI & Machine Learning",
    color: "from-orange-500 to-red-500",
    bestseller: true,
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Design",
  "Data Science",
  "AI & Machine Learning",
  "Digital Marketing",
  "Business",
];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const sortOptions = [
  "Most Popular",
  "Highest Rated",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

const CourseList = ({
  courses,
  error,
}: {
  courses: Course[];
  error: string;
}) => {
  const { user } = useUserInfoStore();

  const initial = getInitialConverter(user?.name || "Guest");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("Most Popular");

  return (
    <section id={"courses"} className="min-h-screen bg-background">
      {user && (
        <section className="pt-22 container mx-auto">
          <div className="flex items-center gap-4 justify-center sm:justify-start px-4">
            <Avatar className="h-14 w-14">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Welcome Back, {user?.name}
              </h2>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="pt-6 pb-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore Our{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Course Catalog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn from industry experts and advance your career with our
              comprehensive courses.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for courses..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {error && (
            <div className="text-red-500 w-full dark:bg-red-100/10 bg-red-100 p-3 rounded mb-4">
              Failed to load courses — showing fallback.
              <br />
              <small>{error}</small>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses &&
              courses.length > 0 &&
              courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/courses/${course.slug}`}>
                    <Card className="h-full overflow-hidden group py--6 pb-6 cursor-pointer border-border hover:border-primary/50 transition-all duration-300 hover:shadow-medium">
                      <div className="relative overflow-hidden">
                        {course.thumbnail && (
                          <Image
                            width={100}
                            height={100}
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        )}
                        {course && (
                          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
                            Bestseller
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {course.instructor.user.name}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm">4.5</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(course._count.reviews)
                                      ? "fill-accent text-accent"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({course._count.reviews.toLocaleString()})
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course?.totalDuration}</span>
                          </div>
                          {course._count.enrollments && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>
                                {(course._count.enrollments / 1000).toFixed(0)}K
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold">
                              {course.price}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {course.originalPrice}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default CourseList;
