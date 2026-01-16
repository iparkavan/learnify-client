import { Suspense } from "react";
import GoogleSuccess from "../../_components/google-success";

const page = () => {
  return (
    <Suspense>
      <GoogleSuccess />
    </Suspense>
  );
};

export default page;
