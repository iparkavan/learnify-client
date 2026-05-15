export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: string;
  thumbnail: string;
  thumbnailPublicId: string;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  categoryId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  totalDuration: number;
  totalLectures: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  metaImage: string | null;
  metaSchema: string | null;
  originalPrice: number;
  status: "DRAFT" | "PUBLISHED";
  promoVideo: string | null;
  sections: SectionResponse[];
}

export interface SectionResponse {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lectures: LectureResponse[];
}

export interface LectureResponse {
  id: string;
  title: string;
  order: number;
  sectionId: string;
  type: "VIDEO" | "QUIZ" | "TEXT";
  video: Video | null;
  quiz: any | null; // refine later if needed
  resources: any[]; // refine later
}

export interface Video {
  id: string;
  title: string | null;
  originalUrl: string;
  streamUrl: string | null;
  thumbnailUrl: string | null;
  duration: number;
  size: number | null;
  format: string | null;
  status: "PROCESSING" | "READY" | "FAILED";
  lectureId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCourseByIdResponse {
  message: string;
  course: Course;
}
