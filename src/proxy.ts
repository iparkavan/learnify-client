import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_ROUTES,
  hasAccess,
  LOGIN_ROUTE,
  PROTECTED_ROUTES,
  RootRoute,
} from "./utils/routes";
import { ACCESS_TOKEN } from "./utils/contants";
import { jwtVerify } from "jose";

const isProtected = (path: string) =>
  PROTECTED_ROUTES.some((route) => path.startsWith(route));

const isAuth = (path: string) => AUTH_ROUTES.some((p) => path.startsWith(p));
// This function can be marked `async` if using `await` inside
export async function proxy(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  const { pathname } = req.nextUrl;

  // Auth routes (login/signup)

  if (token && isAuth(pathname)) {
    const redir = req.nextUrl.searchParams.get("redir");
    return NextResponse.redirect(new URL(redir || RootRoute, req.url));
  }

  // Protected routes

  if (isProtected(pathname)) {
    if (!token) {
      const redirectUrl = new URL(LOGIN_ROUTE, req.url);
      redirectUrl.searchParams.set("redir", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      console.log("User role from token:", role);

      if (!hasAccess(pathname, role)) {
        return NextResponse.redirect(new URL("/403", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      const redirectUrl = new URL(LOGIN_ROUTE, req.url);
      redirectUrl.searchParams.set("redir", pathname);

      const res = NextResponse.redirect(redirectUrl);
      res.cookies.delete(ACCESS_TOKEN);

      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// ///////////////----------------- below is the old code, kept for reference-----------------////////////////

// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { ACCESS_TOKEN } from "./utils/contants";
// import {
//   AUTH_ROUTES,
//   LOGIN_ROUTE,
//   PROTECTED_ROUTES,
//   RootRoute,
//   SIGNUP_ROUTE,
// } from "./utils/routes";

// const isProtected = (path: string) =>
//   PROTECTED_ROUTES.some((p) => path.startsWith(p));

// const isAuth = (path: string) => AUTH_ROUTES.some((p) => path.startsWith(p));

// export async function proxy(req: NextRequest) {
//   const token = req.cookies.get(ACCESS_TOKEN)?.value;
//   const { pathname } = req.nextUrl;

//   // ------------------------
//   // 1️⃣ Auth Routes (Login / OTP / Signup)
//   // ------------------------
//   if (token && isAuth(pathname)) {
//     // If token exists, redirect to intended page or root
//     const redir = req.nextUrl.searchParams.get("redir");
//     return NextResponse.redirect(new URL(redir || RootRoute, req.url));
//   }

//   // ------------------------
//   // 2️⃣ Protected Routes
//   // ------------------------
//   if (isProtected(pathname)) {
//     if (!token) {
//       // No token → redirect to login with `redir`
//       const redirectUrl = new URL(LOGIN_ROUTE, req.url);
//       redirectUrl.searchParams.set("redir", pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//       console.log("Verifying token:", token);
//       await jwtVerify(token, secret);

//       // ✅ Token valid → allow access
//       return NextResponse.next();
//     } catch {
//       // Invalid token → clear cookie, redirect to login with `redir`
//       const redirectUrl = new URL(LOGIN_ROUTE, req.url);
//       redirectUrl.searchParams.set("redir", pathname);
//       const res = NextResponse.redirect(redirectUrl);
//       res.cookies.delete(ACCESS_TOKEN);
//       return res;
//     }
//   }

//   // ------------------------
//   // 3️⃣ Public Routes
//   // ------------------------
//   return NextResponse.next();
// }

// // ------------------------
// // Matcher
// // ------------------------
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// ----------------------------Above is the old code, kept for reference----------------------------

// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import { ACCESS_TOKEN } from "./utils/contants";
// import { AUTH_ROUTES, RootRoute } from "./utils/rbac";
// import { LOGIN_ROUTE } from "./utils/routes";
// import {
//   AUTH_ROUTES,
//   LOGIN_ROUTE,
//   PROTECTED_ROUTES,
//   RootRoute,
// } from "./utils/routes";
// import { hasAccess } from "./utils/rbac";

// // Public landing
// export const RootRoute = "/";

// // Auth routes
// export const LOGIN_ROUTE = "/login";
// export const SIGNUP_ROUTE = "/signup";

// export const AUTH_ROUTES = [LOGIN_ROUTE, SIGNUP_ROUTE];

// Protected routes (require login)
// export const PROTECTED_ROUTES = [
//   "/admin",
//   "/instructor",
//   "/student",
//   "/dashboard",
//   "/course",
// ];

// // 🔥 Role-based routes
// export const ROLE_ROUTES = {
//   admin: ["/admin"],
//   instructor: ["/instructor", "/course/create", "/course/edit"],
//   student: ["/student", "/course/buy"],
// };

// export const hasAccess = (pathname: string, role: string) => {
//   const allowedRoutes = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];

//   if (!allowedRoutes) return false;

//   return allowedRoutes.some((route) => pathname.startsWith(route));
// };

// // ------------------------
// // Helpers
// // ------------------------
// const isProtected = (path: string) =>
//   PROTECTED_ROUTES.some((p) => path.startsWith(p));

// const isAuth = (path: string) => AUTH_ROUTES.some((p) => path.startsWith(p));

// // ------------------------
// // Middleware
// // ------------------------
// export async function proxy(req: NextRequest) {
//   const token = req.cookies.get(ACCESS_TOKEN)?.value;
//   const { pathname } = req.nextUrl;

//   // ------------------------
//   // 1️⃣ Auth Routes (Login / Signup)
//   // ------------------------
//   if (token && isAuth(pathname)) {
//     const redir = req.nextUrl.searchParams.get("redir");
//     return NextResponse.redirect(new URL(redir || RootRoute, req.url));
//   }

//   // ------------------------
//   // 2️⃣ Protected Routes
//   // ------------------------
//   if (isProtected(pathname)) {
//     if (!token) {
//       const redirectUrl = new URL(LOGIN_ROUTE, req.url);
//       redirectUrl.searchParams.set("redir", pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

//       const { payload } = await jwtVerify(token, secret);

//       const role = payload.role as string;

//       // 🔥 Role-based access check
//       if (!hasAccess(pathname, role)) {
//         return NextResponse.redirect(new URL("/403", req.url));
//       }

//       return NextResponse.next();
//     } catch {
//       const redirectUrl = new URL(LOGIN_ROUTE, req.url);
//       redirectUrl.searchParams.set("redir", pathname);

//       const res = NextResponse.redirect(redirectUrl);
//       res.cookies.delete(ACCESS_TOKEN);

//       return res;
//     }
//   }

//   // ------------------------
//   // 3️⃣ Public Routes
//   // ------------------------
//   return NextResponse.next();
// }

// // ------------------------
// // Matcher
// // ------------------------
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
