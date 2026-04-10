"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Play,
  Clock,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import InstructorNavbar from "@/components/instructor/common/instructor-navbar";
import { Course } from "@/types/course-types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const stats = [
  {
    title: "Total Courses",
    value: "12",
    change: "+2 this month",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Total Students",
    value: "2,847",
    change: "+18% from last month",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Revenue",
    value: "$24,580",
    change: "+12% from last month",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    change: "Based on 1,204 reviews",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

// const courses = [
//   {
//     id: 1,
//     title: "Complete Web Development Bootcamp",
//     students: 847,
//     revenue: "$8,470",
//     rating: 4.9,
//     status: "published",
//     progress: 100,
//     thumbnail:
//       "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
//   },
//   {
//     id: 2,
//     title: "Advanced React & TypeScript",
//     students: 534,
//     revenue: "$5,340",
//     rating: 4.8,
//     status: "published",
//     progress: 100,
//     thumbnail:
//       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
//   },
//   {
//     id: 3,
//     title: "Python for Data Science",
//     students: 421,
//     revenue: "$4,210",
//     rating: 4.7,
//     status: "published",
//     progress: 100,
//     thumbnail:
//       "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
//   },
//   {
//     id: 4,
//     title: "Mobile App Development with Flutter",
//     students: 0,
//     revenue: "$0",
//     rating: 0,
//     status: "draft",
//     progress: 65,
//     thumbnail:
//       "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
//   },
// ];

const recentActivity = [
  {
    type: "enrollment",
    message: "New student enrolled in Web Development Bootcamp",
    time: "2 min ago",
  },
  {
    type: "review",
    message: "New 5-star review on React & TypeScript course",
    time: "15 min ago",
  },
  {
    type: "enrollment",
    message: "3 new students enrolled in Python for Data Science",
    time: "1 hour ago",
  },
  {
    type: "sale",
    message: "Course bundle purchased - $149",
    time: "2 hours ago",
  },
];

interface InstructorDashboardProps {
  courses: Course[];
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  courses,
}) => {
  console.log("courses ==, ", courses);
  return (
    <div className="">
      <main className="">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          {stat.change}
                        </p>
                      </div>
                      <div
                        className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Courses Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Your Courses
                  </CardTitle>
                  <Link href="/instructor/courses">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                    >
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.status === "draft" && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              Draft
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground truncate">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {course.students} students
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {course.revenue}
                              </span>
                              {course.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                  {course.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                course.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                course.status === "published"
                                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                                  : ""
                              }
                            >
                              {course.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-popover border-border"
                              >
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" /> Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        {course.status === "draft" && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                Completion
                              </span>
                              <span className="text-foreground font-medium">
                                {course.progress}%
                              </span>
                            </div>
                            <Progress
                              value={course.progress}
                              className="h-1.5"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Link href="/instructor/create-course">
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <Plus className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Create Course</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <Play className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Upload Video</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <Users className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">View Students</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <TrendingUp className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
