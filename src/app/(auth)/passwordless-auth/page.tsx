import { Suspense } from "react";
import { PasswordLessAuthForm } from "../_components/passwordless-auth-form";
// import { GalleryVerticalEnd } from "lucide-react";

const page = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          MaxSkill.ai.
        </a> */}
        <Suspense fallback={<div></div>}>
          <PasswordLessAuthForm />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
