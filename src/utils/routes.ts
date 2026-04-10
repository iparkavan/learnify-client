const baseAuthRoute = "/passwordless-auth";

export const LOGIN_ROUTE = `${baseAuthRoute}?${new URLSearchParams({
  action: "login",
})}`;
export const SIGNUP_ROUTE = `${baseAuthRoute}?${new URLSearchParams({
  action: "signup",
})}`;

export const PROTECTED_ROUTES = [
  "/courses/",
  "/orders",
  "/admin",
  "/instructor",
];

export const PUBLIC_PATHS = ["/", "/courses", "/passwordless-auth"];

export const AUTH_ROUTES = ["/passwordless-auth"];

export const RootRoute = "/";

export const ROLE_ROUTES = {
  ADMIN: ["/admin"],
  INSTRUCTOR: ["/instructor", "/course/create", "/course/edit"],
  STUDENT: ["/student", "/course/buy"],
};

export const hasAccess = (pathname: string, role: string) => {
  const allowedRoutes = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];

  if (!allowedRoutes) return false;

  return allowedRoutes.some((route) => pathname.startsWith(route));
};
