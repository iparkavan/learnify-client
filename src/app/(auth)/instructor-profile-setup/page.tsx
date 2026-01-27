import InstructorProfileSetup from "@/lms-pages/instructor/instructor-profile-setup";
import Navbar from "@/lms-pages/landing-page/NavBar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <InstructorProfileSetup />
    </div>
  );
};

export default page;
