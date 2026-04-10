import InstructorDashboard from "@/lms-pages/instructor/instructor-dashboard";
import { safeFetch } from "@/utils/safe-fetch";
import { cookies } from "next/headers";

const page = async () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const cookiesStore = cookies();

  const cookie = (await cookiesStore).toString();
  const { data: courses } = await safeFetch(
    `${API_URL}/courses/get-instructor-courses`,
    {
      headers: {
        Cookie: cookie,
      },
      cache: "no-cache",
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <InstructorDashboard courses={courses.instructorCourse} />
    </div>
  );
};

export default page;
