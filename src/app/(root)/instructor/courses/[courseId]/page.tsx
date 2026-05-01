"use client";

import EditCourse from "@/lms-pages/instructor/course-creation/edit-course";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams<{ courseId: string }>();

  const { courseId } = params;

  return (
    <div className="">
      <EditCourse courseId={courseId} />
    </div>
  );
};

export default page;
