import CourseDetails from "@/lms-pages/courses-pages/course-details";
import Footer from "@/lms-pages/landing-page/Footer";
import Navbar from "@/lms-pages/landing-page/NavBar";
import { Course } from "@/types/course-types";
// import ProtectedProfileSetupRoute from "@/utils/profile-setup-protected";
import { safeFetch } from "@/utils/safe-fetch";

interface CoursePageProps {
  params: { slug: string };
}

const page = async ({ params }: CoursePageProps) => {
  const resolvedParams = await params; // unwrap the promise
  const { slug } = resolvedParams;

  const API_URL = "http://localhost:5000/api";

  const { data: course, error } = await safeFetch<Course>(
    `${API_URL}/courses/${slug}`,
    { cache: "no-store" },
    {} as Course,
  );

  return (
    <div>
      <Navbar />
      {/* <ProtectedProfileSetupRoute> */}
      <CourseDetails course={course} />
      {/* </ProtectedProfileSetupRoute> */}
      <Footer />
    </div>
  );
};

export default page;
