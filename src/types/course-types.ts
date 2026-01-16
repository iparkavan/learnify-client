export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Instructor {
  id: string;
  userId: string;
  bio?: string | null;
  expertise?: string | null;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  metaImage?: string | null;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  metaImage?: string | null;
}

export interface CourseCount {
  reviews: number;
  enrollments: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  price: number;
  originalPrice: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  categoryId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  totalDuration: number;
  totalLectures: number;

  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  metaImage?: string | null;
  metaSchema?: any | null;

  category: Category;
  instructor: Instructor;

  _count: CourseCount;
}

export interface CoursesResponse {
  courses: Course[];
}
