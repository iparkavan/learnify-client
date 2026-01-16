"use client";

import CourseList from "../courses-pages/courses-list";
import Hero from "./Hero";
import Features from "./Features";
import Courses from "./Courses";
import { useUserInfoStore } from "@/store/userInfo-store";
import { Course } from "@/types/course-types";
import Contact from "./contacts";

const LandingPage = ({
  courses,
  error,
}: {
  courses: Course[];
  error: string;
}) => {
  const { user } = useUserInfoStore();

  return (
    <div>
      {!user && (
        <>
          <Hero />
        </>
      )}
      <CourseList courses={courses} error={error} />
      {!user && (
        <>
          {/* <Courses /> */}
          <Features />
          {/* <Pricing /> */}
          {/* <CTA /> */}
          <Contact />
        </>
      )}
    </div>
  );
};

export default LandingPage;
