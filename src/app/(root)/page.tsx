import HeadFootLayout from "@/components/common/head-foot-layout";
import LandingPage from "@/lms-pages/landing-page/landing";
import { Course } from "@/types/course-types";
import { safeFetch } from "@/utils/safe-fetch";

export default async function Home() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const { data: courses, error } = await safeFetch<Course[]>(
    `${API_URL}/courses`,
    { cache: "no-store" },
    [], // fallback value
  );

  // const response = await fetch(`${API_URL}/courses`, {
  //   cache: "no-store",
  // });

  // const courses = await response.json();

  console.log("courses", courses);

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <HeadFootLayout>
        <LandingPage courses={courses} error={error ?? ""} />
      </HeadFootLayout>
      {/* <Footer /> */}
    </div>
  );
}
