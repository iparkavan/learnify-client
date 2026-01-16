import CourseDetails from "@/lms-pages/courses-pages/course-details";
import { Course } from "@/types/course-types";
import ProtectedProfileSetupRoute from "@/utils/profile-setup-protected";
import { safeFetch } from "@/utils/safe-fetch";

interface CoursePageProps {
  params: { slug: string };
}

const page = async ({ params }: CoursePageProps) => {
  const resolvedParams = await params; // unwrap the promise
  const { slug } = resolvedParams;

  const API_URL = process.env.API_URL || "http://localhost:5000/api";

  const { data: course, error } = await safeFetch<Course>(
    `${API_URL}/courses/${slug}`,
    { cache: "no-store" },
    {} as Course
  );

  console.log("course details", course, error);

  return (
    <div>
      <ProtectedProfileSetupRoute>
        <CourseDetails course={course} />
      </ProtectedProfileSetupRoute>
    </div>
  );
};

export default page;
