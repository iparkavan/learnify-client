"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  Shield,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  Search,
  BarChart3,
  Flag,
  MessageSquare,
  DollarSign,
  FileText,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface CourseWithSections {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  level: string | null;
  price: number | null;
  status: string | null;
  review_status: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  user_id: string;
  course_image_url: string | null;
  created_at: string;
  sections: {
    id: string;
    title: string;
    lectures: { id: string; title: string; type: string }[];
  }[];
}

interface ContentReport {
  id: string;
  reporter_id: string | null;
  course_id: string | null;
  reason: string;
  description: string | null;
  status: string;
  resolution_notes: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Course review state
  const [courses, setCourses] = useState<CourseWithSections[]>([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithSections | null>(null);
  const [reviewAction, setReviewAction] = useState<
    "approved" | "rejected" | "needs_changes"
  >("approved");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Reports state
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [reportFilter, setReportFilter] = useState("all");
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(
    null,
  );
  const [resolveAction, setResolveAction] = useState<"resolved" | "dismissed">(
    "resolved",
  );
  const [resolveNotes, setResolveNotes] = useState("");

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()),
  );

  const pendingCourses = courses.filter(
    (c) => c.review_status === "pending",
  ).length;
  const approvedCourses = courses.filter(
    (c) => c.review_status === "approved",
  ).length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const totalLectures = courses.reduce(
    (sum, c) => sum + c.sections.reduce((s, sec) => s + sec.lectures.length, 0),
    0,
  );

  const getReviewBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "needs_changes":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            Needs Changes
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  const getReportBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            Resolved
          </Badge>
        );
      case "dismissed":
        return <Badge variant="secondary">Dismissed</Badge>;
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            Pending
          </Badge>
        );
    }
  };

  //   if (loading || authLoading) {
  //     return (
  //       <div className="min-h-screen bg-background flex items-center justify-center">
  //         <RefreshCw className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage courses, users, and platform content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingCourses > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  {pendingCourses} pending reviews
                </Badge>
              )}
              {pendingReports > 0 && (
                <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 px-3 py-1">
                  {pendingReports} open reports
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Review
              {pendingCourses > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 px-1.5 py-0 text-xs"
                >
                  {pendingCourses}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Reports
              {pendingReports > 0 && (
                <Badge className="ml-1 px-1.5 py-0 text-xs bg-yellow-500 text-yellow-50">
                  {pendingReports}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ========== OVERVIEW TAB ========== */}
          <TabsContent value="overview">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  {
                    title: "Total Courses",
                    value: courses.length,
                    icon: BookOpen,
                    color: "text-primary",
                    bg: "bg-primary/10",
                    sub: `${pendingCourses} pending review`,
                  },
                  {
                    title: "Total Lectures",
                    value: totalLectures,
                    icon: FileText,
                    color: "text-accent",
                    bg: "bg-accent/10",
                    sub: "Across all courses",
                  },
                  {
                    title: "Approved Courses",
                    value: approvedCourses,
                    icon: CheckCircle,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    sub: "Live on platform",
                  },
                  {
                    title: "Open Reports",
                    value: pendingReports,
                    icon: AlertTriangle,
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    sub: "Awaiting review",
                  },
                ].map((stat) => (
                  <motion.div
                    key={stat.title}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                              {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {stat.sub}
                            </p>
                          </div>
                          <div
                            className={`${stat.bg} ${stat.color} p-3 rounded-xl`}
                          >
                            <stat.icon className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recent pending courses */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Courses Awaiting Review</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("courses")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {courses.filter((c) => c.review_status === "pending")
                      .length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No courses awaiting review
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {courses
                          .filter((c) => c.review_status === "pending")
                          .slice(0, 5)
                          .map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50"
                            >
                              <div className="flex items-center gap-4">
                                {course.course_image_url ? (
                                  <img
                                    src={course.course_image_url}
                                    alt=""
                                    className="w-16 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-foreground">
                                    {course.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {course.sections.length} sections ·{" "}
                                    {course.sections.reduce(
                                      (s, sec) => s + sec.lectures.length,
                                      0,
                                    )}{" "}
                                    lectures ·{" "}
                                    {course.category || "Uncategorized"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setReviewDialogOpen(true);
                                }}
                              >
                                Review
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent reports */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Reports</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("reports")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {reports.filter((r) => r.status === "pending").length ===
                    0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No open reports
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {reports
                          .filter((r) => r.status === "pending")
                          .slice(0, 5)
                          .map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50"
                            >
                              <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {report.reason}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      report.created_at,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {getReportBadge(report.status)}
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* ========== COURSE REVIEW TAB ========== */}
          <TabsContent value="courses">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="needs_changes">Needs Changes</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead>Review Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCourses.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center py-12 text-muted-foreground"
                            >
                              No courses found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCourses.map((course) => (
                            <TableRow key={course.id} className="group">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {course.course_image_url ? (
                                    <img
                                      src={course.course_image_url}
                                      alt=""
                                      className="w-12 h-8 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-8 rounded bg-muted flex items-center justify-center">
                                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-foreground text-sm">
                                      {course.title}
                                    </p>
                                    {course.subtitle && (
                                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {course.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {course.category || "—"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {course.level || "—"}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {course.price ? `$${course.price}` : "Free"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {course.sections.length}s ·{" "}
                                {course.sections.reduce(
                                  (s, sec) => s + sec.lectures.length,
                                  0,
                                )}
                                l
                              </TableCell>
                              <TableCell>
                                {getReviewBadge(course.review_status)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(
                                  course.created_at,
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
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
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        setReviewDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" /> Review
                                      Course
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        setReviewAction("approved");
                                        setReviewDialogOpen(true);
                                      }}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />{" "}
                                      Quick Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        setReviewAction("rejected");
                                        setReviewDialogOpen(true);
                                      }}
                                    >
                                      <XCircle className="mr-2 h-4 w-4 text-destructive" />{" "}
                                      Reject
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* ========== USERS TAB ========== */}
          <TabsContent value="users">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 space-y-4">
                      <Users className="h-16 w-16 text-muted-foreground/30 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          User management
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          View registered users, instructors, and manage roles
                          from the backend panel. User data is managed securely
                          through the authentication system.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
                        <Card className="border-border/50">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                              {courses.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Instructors with courses
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-border/50">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                              {approvedCourses}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Published courses
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-border/50">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                              {reports.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Total reports
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* ========== REPORTS TAB ========== */}
          <TabsContent value="reports">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="flex gap-4">
                <Select value={reportFilter} onValueChange={setReportFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter reports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {}}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reason</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-12 text-muted-foreground"
                            >
                              <Flag className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                              No reports found
                            </TableCell>
                          </TableRow>
                        ) : (
                          reports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">
                                {report.reason}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                                {report.description || "—"}
                              </TableCell>
                              <TableCell>
                                {getReportBadge(report.status)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(
                                  report.created_at,
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {report.status === "pending" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setResolveDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Course Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review Course
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex gap-4">
                {selectedCourse.course_image_url ? (
                  <img
                    src={selectedCourse.course_image_url}
                    alt=""
                    className="w-32 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse.subtitle}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary">
                      {selectedCourse.category || "No category"}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedCourse.level || "No level"}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedCourse.price
                        ? `$${selectedCourse.price}`
                        : "Free"}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedCourse.description && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Curriculum ({selectedCourse.sections.length} sections)
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCourse.sections.map((section, i) => (
                    <div
                      key={section.id}
                      className="p-2 rounded border border-border/50 bg-muted/30"
                    >
                      <p className="text-sm font-medium">
                        Section {i + 1}: {section.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.lectures.length} lectures
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCourse.review_notes && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Previous review notes:
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedCourse.review_notes}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Decision
                  </label>
                  <Select
                    value={reviewAction}
                    onValueChange={(v) =>
                      setReviewAction(v as typeof reviewAction)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                          Approve
                        </span>
                      </SelectItem>
                      <SelectItem value="needs_changes">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" /> Request
                          Changes
                        </span>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive" />{" "}
                          Reject
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Review Notes
                  </label>
                  <Textarea
                    placeholder="Add feedback for the instructor..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {}}
              disabled={reviewLoading}
              className={
                reviewAction === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : reviewAction === "rejected"
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
              }
            >
              {reviewLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {reviewAction === "approved"
                ? "Approve Course"
                : reviewAction === "rejected"
                  ? "Reject Course"
                  : "Request Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Report Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-sm font-medium text-foreground">
                  {selectedReport.reason}
                </p>
                {selectedReport.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedReport.description}
                  </p>
                )}
              </div>
              <Select
                value={resolveAction}
                onValueChange={(v) =>
                  setResolveAction(v as typeof resolveAction)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">Mark as Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismiss</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Resolution notes..."
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {}}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
