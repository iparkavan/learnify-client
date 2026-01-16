const baseAuthRoute = "/passwordless-auth";

export const LOGIN_ROUTE = `${baseAuthRoute}?${new URLSearchParams({
  action: "login",
})}`;
export const SIGNUP_ROUTE = `${baseAuthRoute}?${new URLSearchParams({
  action: "signup",
})}`;

export const PROTECTED_ROUTES = ["/courses/", "/orders"];

export const PUBLIC_PATHS = ["/", "/courses", "/passwordless-auth"];

export const AUTH_ROUTES = ["/passwordless-auth"];

export const RootRoute = "/";
