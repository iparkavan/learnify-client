"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Users,
  Clock,
  Award,
  Globe,
  PlayCircle,
  Download,
  CheckCircle,
  BookOpen,
  Target,
  Heart,
  Share2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import RazorpayButton from "@/components/RazorPay/razorpay-button";
import { Course } from "@/types/course-types";
import {
  getDiscountPercentage,
  getInitialConverter,
} from "@/utils/initial-converter";
import { useGetEnrollmentStatus } from "@/hooks/enrollment-hook";

interface CourseDetailsProps {
  course: Course;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
  const { id } = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const nameInitials = getInitialConverter(course.instructor.user.name);
  const discountPercentage = getDiscountPercentage(
    course.price,
    course.originalPrice
  );

  const { data: isEnrollmentStatus, isPending: isEnrollmentStatusPending } =
    useGetEnrollmentStatus(course?.id);

  console.log("isEnrollmentStatus", isEnrollmentStatus);

  const courseData = {
    id: "1",
    title: "Complete Web Development Bootcamp 2024",
    subtitle:
      "Master Modern Web Development with React, Node.js, and TypeScript",
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Full-Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
      students: 125000,
      courses: 12,
    },
    rating: 4.8,
    reviews: 45230,
    students: 187543,
    duration: "42 hours",
    lectures: 312,
    level: "All Levels",
    language: "English",
    price: 89.99,
    discountPrice: 14.99,
    lastUpdated: "November 2024",
  };

  const learningOutcomes = [
    "Build modern, responsive websites using HTML5, CSS3, and JavaScript",
    "Master React.js including Hooks, Context API, and Redux",
    "Create RESTful APIs with Node.js and Express",
    "Work with databases including MongoDB and PostgreSQL",
    "Implement authentication and authorization in web apps",
    "Deploy applications to production using modern DevOps tools",
    "Write clean, maintainable code following best practices",
    "Build full-stack applications from scratch",
  ];

  const courseContent = [
    {
      section: "Introduction to Web Development",
      lectures: 12,
      duration: "1h 30m",
      lessons: [
        { title: "Course Introduction", duration: "5:30", preview: true },
        {
          title: "Setting Up Your Development Environment",
          duration: "15:45",
          preview: true,
        },
        { title: "How the Web Works", duration: "12:20", preview: false },
        { title: "HTML Fundamentals", duration: "18:45", preview: false },
      ],
    },
    {
      section: "CSS & Responsive Design",
      lectures: 24,
      duration: "3h 45m",
      lessons: [
        { title: "CSS Basics", duration: "20:15", preview: false },
        { title: "Flexbox Layout", duration: "25:30", preview: false },
        { title: "CSS Grid System", duration: "28:45", preview: false },
        {
          title: "Responsive Design Principles",
          duration: "22:10",
          preview: false,
        },
      ],
    },
    {
      section: "JavaScript Programming",
      lectures: 45,
      duration: "6h 20m",
      lessons: [
        { title: "JavaScript Basics", duration: "30:25", preview: false },
        { title: "DOM Manipulation", duration: "35:40", preview: false },
        { title: "Async JavaScript & APIs", duration: "42:15", preview: false },
        { title: "ES6+ Features", duration: "38:20", preview: false },
      ],
    },
    {
      section: "React Development",
      lectures: 58,
      duration: "8h 45m",
      lessons: [
        { title: "Introduction to React", duration: "25:30", preview: false },
        { title: "Components & Props", duration: "32:45", preview: false },
        {
          title: "State Management with Hooks",
          duration: "40:20",
          preview: false,
        },
        { title: "React Router", duration: "28:15", preview: false },
      ],
    },
    {
      section: "Backend Development with Node.js",
      lectures: 42,
      duration: "7h 15m",
      lessons: [
        { title: "Node.js Fundamentals", duration: "30:45", preview: false },
        { title: "Express.js Framework", duration: "35:20", preview: false },
        { title: "RESTful API Design", duration: "40:30", preview: false },
        {
          title: "Authentication & Security",
          duration: "45:15",
          preview: false,
        },
      ],
    },
  ];

  const requirements = [
    "No programming experience needed - I'll teach you everything you need to know",
    "A computer with internet access (Windows, Mac, or Linux)",
    "Basic familiarity with using a computer and web browser",
    "Passion and dedication to learn web development",
  ];

  const reviews = [
    {
      author: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "This is hands down the best web development course I've taken. Sarah's teaching style is clear and engaging. The projects are practical and really helped solidify my understanding.",
      helpful: 243,
    },
    {
      author: "Emma Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 5,
      date: "1 month ago",
      comment:
        "As a complete beginner, I was nervous about learning to code. This course made everything so accessible. The pacing is perfect and the support from the community is amazing!",
      helpful: 189,
    },
    {
      author: "David Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 4,
      date: "3 weeks ago",
      comment:
        "Great course with comprehensive content. Some sections could use more real-world examples, but overall it's excellent value for money. Already built two projects!",
      helpful: 156,
    },
  ];

  const videoChapters = courseContent.flatMap((section, sectionIndex) =>
    section.lessons.map((lesson, lessonIndex) => ({
      id: `${sectionIndex}-${lessonIndex}`,
      title: lesson.title,
      duration: lesson.duration,
      timestamp: sectionIndex * 600 + lessonIndex * 180, // Mock timestamps
      completed: lessonIndex < 2,
    }))
  );

  console.log("course", course.instructor.user.name);

  return (
    <div className="min-h-screen">
      {/* Course Header */}
      <section className="bg-card border-b border-border pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Preview - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:hidden relative aspect-video rounded-lg overflow-hidden mb-6 order-1 cursor-pointer group"
              onClick={() => {
                localStorage.setItem(
                  "videoPageData",
                  JSON.stringify({
                    title: courseData.title,
                    chapters: videoChapters,
                    videoUrl:
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  })
                );

                router.push(`/course/${id}/watch`);
              }}
            >
              <Image
                fill
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                alt={courseData.title}
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <Button size="lg" className="h-16 w-16 rounded-full">
                  <PlayCircle className="h-8 w-8" />
                </Button>
              </div> */}
            </motion.div>

            {/* Left Content */}
            <div className="lg:col-span-2 order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4" variant="secondary">
                  Bestseller
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {courseData.subtitle}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {course._count.reviews}
                    </span>
                    <span className="text-muted-foreground">
                      ({course._count.reviews.toLocaleString()} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {course._count.enrollments.toLocaleString()} students
                    </span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-6">
                  <Avatar>
                    {/* <AvatarImage src={courseData.instructor.avatar} /> */}
                    <AvatarFallback>{nameInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-semibold">
                      {course.instructor.user.name}
                    </p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs md:text-sm">
                      {course.totalDuration} on-demand video
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs md:text-sm">
                      {courseData.lectures} lectures
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="text-xs md:text-sm">{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs md:text-sm">
                      {courseData.language}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Action */}
      <div className="container mx-auto p-6 sm:p-0 m-6 lg:hidden">
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${course.price}</span>
              <span className="text-lg text-muted-foreground line-through">
                ${course.originalPrice}
              </span>
              <Badge variant="destructive">{discountPercentage}% OFF</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              2 days left at this price!
            </p>
          </div>

          <div className="space-y-2">
            {/* <Button className="w-full" size="lg">
                        Add to Cart
                      </Button> */}

            {isEnrollmentStatus?.enrolled ? (
              <Button className="w-full" variant={"secondary"}>
                You are already enrolled in this course
              </Button>
            ) : (
              <RazorpayButton
                courseId={course.id}
                amount={course.price}
                gateway="RAZORPAY"
                courseTitle={courseData.title}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* <div className="pt-4 border-t border-border space-y-2">
            <p className="font-semibold mb-3">This course includes:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                <span>42 hours on-demand video</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>48 downloadable resources</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Lifetime access</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {learningOutcomes.map((outcome, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Content */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Course content</CardTitle>
                  <CardDescription>
                    {courseContent.length} sections •{" "}
                    {courseContent.reduce((acc, s) => acc + s.lectures, 0)}{" "}
                    lectures • 42h total length
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {courseContent.map((section, index) => (
                      <AccordionItem key={index} value={`section-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-semibold text-left">
                              {section.section}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {section.lectures} lectures • {section.duration}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {lesson.title}
                                  </span>
                                  {lesson.preview && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card> */}

              {/* Requirements */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex gap-3">
                        <Target className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card> */}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                  {course.description}
                  {/* <p>
                    Welcome to the most comprehensive and up-to-date web
                    development course on the internet! This course is designed
                    to take you from zero to hero, whether you're looking to
                    start a new career, build your own startup, or add web
                    development skills to your toolbox.
                  </p>
                  <p>
                    You'll learn by building over 20 real-world projects,
                    including a complete full-stack e-commerce application. We
                    cover everything from the absolute basics to advanced
                    concepts, ensuring you have the complete skillset needed to
                    build modern, professional web applications.
                  </p>
                  <p>
                    The course is project-based, which means you'll be building
                    projects throughout the course rather than just watching
                    endless theory videos. This hands-on approach ensures you
                    truly understand the concepts and can apply them in real
                    scenarios.
                  </p>
                  <p className="font-semibold">
                    What makes this course different?
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Learn by building 20+ real projects</li>
                    <li>Lifetime access with free updates</li>
                    <li>Active community support</li>
                    <li>Industry-relevant curriculum</li>
                    <li>Professional instructor with 10+ years experience</li>
                  </ul> */}
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Avatar className="h-24 w-24">
                      {/* <AvatarImage src={courseData.instructor.avatar} /> */}
                      <AvatarFallback>{nameInitials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {course.instructor.user.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {course.instructor.bio}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {course.instructor.rating} Instructor Rating
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {course.instructor.totalStudents.toLocaleString()}{" "}
                            Students
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4" />
                          <span>{course.instructor.totalCourses} Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {course.instructor.bio}
                    {/* Sarah is a Senior Full-Stack Developer with over 10 years of
                    experience in the tech industry. She has worked with Fortune
                    500 companies and startups, building scalable web
                    applications. Sarah is passionate about teaching and has
                    helped thousands of students launch their careers in web
                    development. */}
                  </p>
                </CardContent>
              </Card>

              {/* Student Reviews */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Student feedback</CardTitle>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">
                        {courseData.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Course Rating
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <Progress
                            value={rating === 5 ? 85 : rating === 4 ? 12 : 3}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-16">
                            {rating === 5 ? "85%" : rating === 4 ? "12%" : "3%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-border pb-6 last:border-0"
                    >
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.author}</h4>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="hover:text-foreground transition-colors">
                              Helpful ({review.helpful})
                            </button>
                            <button className="hover:text-foreground transition-colors">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card> */}
            </div>

            {/* Right Sidebar - Course Preview */}
            <div className="hidden lg:block order-1 lg:order-3">
              <Card className="sticky top-24 py--6">
                <div
                  className="relative aspect-video rounded-t-lg overflow-hidden cursor-pointer group"
                  // onClick={() => {
                  //   localStorage.setItem(
                  //     "videoPageData",
                  //     JSON.stringify({
                  //       title: courseData.title,
                  //       chapters: videoChapters,
                  //       videoUrl:
                  //         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  //     })
                  //   );

                  //   router.push(`/course/${id}/watch`);
                  // }}
                >
                  <Image
                    fill
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                    alt={courseData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <Button size="lg" className="h-16 w-16 rounded-full">
                      <PlayCircle className="h-8 w-8" />
                    </Button>
                  </div> */}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          ${course.price}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.originalPrice}
                        </span>
                        <Badge variant="destructive">
                          {discountPercentage}% OFF
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        2 days left at this price!
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* <Button className="w-full" size="lg">
                        Add to Cart
                      </Button> */}

                      {isEnrollmentStatus?.enrolled ? (
                        <Button className="w-full" variant={"secondary"}>
                          You are already enrolled in this course
                        </Button>
                      ) : (
                        <RazorpayButton
                          courseId={course.id}
                          amount={course.price}
                          gateway="RAZORPAY"
                          courseTitle={courseData.title}
                        />
                      )}
                      {/* <Button variant="outline" className="w-full" size="lg">
                        Buy Now
                      </Button> */}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-border space-y-2">
                      <p className="font-semibold mb-3">
                        This course includes:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {course.totalDuration} hours on-demand video
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span>48 downloadable resources</span>
                        </div> */}
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>Certificate of completion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>Lifetime access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
