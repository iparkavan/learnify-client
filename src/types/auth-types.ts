export interface UserType {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

export interface UserInfoProfileType extends UserType {
  studentProfile: StudentProfile | null;
  instructorProfile: boolean;
}

export interface LoginResponseType {
  message: string;
  user: UserInfoProfileType;
  token: string;
}

// STUDENT PROFILE SETUP TYPES

export interface StudentProfileSetupResponse {
  message: string;
  studentProfile: StudentProfile;
}

export interface StudentProfile {
  id: string;
  degreeProgram: DegreeProgram;
  studyYear: StudyYear;
  specialization: string;
  collegeName: string;
  graduationYear: number;
  country: string;
  referralSource: ReferralSource;
  phoneNumber: string;
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export enum DegreeProgram {
  BACHELOR_OF_TECHNOLOGY = "BACHELOR_OF_TECHNOLOGY",
  // add others if needed
}

export enum StudyYear {
  FIRST_YEAR = "FIRST_YEAR",
  SECOND_YEAR = "SECOND_YEAR",
  THIRD_YEAR = "THIRD_YEAR",
  FINAL_YEAR = "FINAL_YEAR",
}

export enum ReferralSource {
  FRIEND = "FRIEND",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  COLLEGE = "COLLEGE",
  OTHER = "OTHER",
}
