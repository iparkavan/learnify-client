import { UserRole } from "./contants";

export const getRoleRedirect = (role: string) => {
  switch (role) {
    case UserRole.STUDENT:
      return "/";

    case UserRole.INSTRUCTOR:
      return "/instructor";

    case UserRole.ADMIN:
      return "/admin";

    default:
      return "/";
  }
};
