export const ACCESS_TOKEN = "access_token";

export type UserRoleType = "STUDENT" | "INSTRUCTOR";

export enum UserRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

export function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60); // round to nearest second
}
