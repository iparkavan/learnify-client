import LandingPage from "@/lms-pages/landing-page/landing";
import { Course } from "@/types/course-types";
import { safeFetch } from "@/utils/safe-fetch";

export default async function Home() {
  const API_URL = process.env.API_URL || "http://localhost:5000/api";

  const { data: courses, error } = await safeFetch<Course[]>(
    `${API_URL}/courses`,
    { cache: "no-store" },
    [] // fallback value
  );

  return (
    <div className="min-h-screen">
      <LandingPage courses={courses} error={error ?? ""} />
    </div>
  );
}
