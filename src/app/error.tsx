"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }: any) {
  const router = useRouter();

  return (
    <html>
      <body className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          Something went wrong
        </h1>
        <p className="mb-6">{error.message}</p>
        <Button
          onClick={() => router.push("/")}
          // className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to home
        </Button>
      </body>
    </html>
  );
}
