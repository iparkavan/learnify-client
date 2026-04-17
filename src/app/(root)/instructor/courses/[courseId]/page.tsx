"use client";

import CreateCourse from "@/lms-pages/instructor/course-creation/create-course";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams<{ courseId: string }>();

  const { courseId } = params;

  return (
    <div className="">
      <CreateCourse courseId={courseId} />
    </div>
  );
};

export default page;
