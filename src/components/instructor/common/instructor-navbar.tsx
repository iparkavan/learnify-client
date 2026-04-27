"use client";

import { createCourseMutateFn } from "@/apis/course-api";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const InstructorNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: createCourseMutate, isPending: isCreateCoursePending } =
    useMutation({
      mutationFn: createCourseMutateFn,
      mutationKey: ["create-course"],
    });

  const handleCreateCourse = () => {
    if (isCreateCoursePending) return;

    createCourseMutate(
      {
        title: "Untitled Course",
      },
      {
        onSuccess: (data) => {
          router.push(`/instructor/courses/${data.course.id}`);
        },
      },
    );
  };

  const isInstructorHome = pathname === "/instructor";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Instructor Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Instructor!
            </p>
          </div>
          {isInstructorHome && (
            <Button
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={handleCreateCourse}
              disabled={isCreateCoursePending}
            >
              {isCreateCoursePending ? (
                <>
                  <Loader />
                  Loading
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InstructorNavbar;
