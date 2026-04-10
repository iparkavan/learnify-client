import InstructorNavbar from "@/components/instructor/common/instructor-navbar";

export default function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <InstructorNavbar />
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
