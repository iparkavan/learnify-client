import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN } from "./utils/contants";
import {
  AUTH_ROUTES,
  LOGIN_ROUTE,
  PROTECTED_ROUTES,
  RootRoute,
  SIGNUP_ROUTE,
} from "./utils/routes";

const isProtected = (path: string) =>
  PROTECTED_ROUTES.some((p) => path.startsWith(p));

const isAuth = (path: string) => AUTH_ROUTES.some((p) => path.startsWith(p));

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  const { pathname } = req.nextUrl;

  // ------------------------
  // 1️⃣ Auth Routes (Login / OTP / Signup)
  // ------------------------
  if (token && isAuth(pathname)) {
    // If token exists, redirect to intended page or root
    const redir = req.nextUrl.searchParams.get("redir");
    return NextResponse.redirect(new URL(redir || RootRoute, req.url));
  }

  // ------------------------
  // 2️⃣ Protected Routes
  // ------------------------
  if (isProtected(pathname)) {
    if (!token) {
      // No token → redirect to login with `redir`
      const redirectUrl = new URL(LOGIN_ROUTE, req.url);
      redirectUrl.searchParams.set("redir", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);

      // ✅ Token valid → allow access
      return NextResponse.next();
    } catch {
      // Invalid token → clear cookie, redirect to login with `redir`
      const redirectUrl = new URL(LOGIN_ROUTE, req.url);
      redirectUrl.searchParams.set("redir", pathname);
      const res = NextResponse.redirect(redirectUrl);
      res.cookies.delete(ACCESS_TOKEN);
      return res;
    }
  }

  // ------------------------
  // 3️⃣ Public Routes
  // ------------------------
  return NextResponse.next();
}

// ------------------------
// Matcher
// ------------------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

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

// // This function can be marked `async` if using `await` inside
// export async function proxy(req: NextRequest) {
//   const token = req.cookies.get(ACCESS_TOKEN)?.value;
//   const { pathname } = req.nextUrl;

//   // if (token && isAuth(pathname)) {
//   //   const previousUrl = req.headers.get("referer");
//   //   // If referer exists → go back
//   //   if (previousUrl) {
//   //     return NextResponse.redirect(previousUrl);
//   //   }
//   //   // Fallback → root page
//   //   return NextResponse.redirect(new URL(RootRoute, req.url));
//   // }

//   if (token && isAuth(pathname)) {
//     const redir = req.nextUrl.searchParams.get("redir");
//     return NextResponse.redirect(new URL(redir || RootRoute, req.url));
//   }

//   if (isProtected(pathname)) {
//     if (!token) {
//       const redirectUrl = new URL(LOGIN_ROUTE, req.url);
//       redirectUrl.searchParams.set("redir", pathname);
//       return NextResponse.redirect(redirectUrl);
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//       await jwtVerify(token, secret);
//       return NextResponse.next(); // ✅ token valid
//     } catch {
//       const res = NextResponse.redirect(new URL(SIGNUP_ROUTE, req.url));
//       res.cookies.delete(ACCESS_TOKEN);
//       return res;
//     }
//   }

//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
