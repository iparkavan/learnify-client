import InstructorDashboard from "@/lms-pages/instructor/instructor-dashboard";
import { Course } from "@/types/course-types";
import { safeFetch } from "@/utils/safe-fetch";
import { cookies } from "next/headers";

const page = async () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const cookiesStore = cookies();

  const cookie = (await cookiesStore).toString();
  const { data: courses } = await safeFetch<{ instructorCourse: Course[] }>(
    `${API_URL}/courses/get-instructor-courses`,
    {
      headers: {
        Cookie: cookie,
      },
      cache: "no-cache",
    },
    { instructorCourse: [] },
  );

  return (
    <div className="min-h-screen bg-background">
      <InstructorDashboard initialCourses={courses.instructorCourse} />
    </div>
  );
};

export default page;
