import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import QueryProvider from "@/context/query-provider";
import { UserProvider } from "@/context/user-provider";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { safeFetch } from "@/utils/safe-fetch";
import { UserInfoProfileType } from "@/types/auth-types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Learnify",
    template: "%s - Learnify",
  },
  description: "LMS Platform",
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const cookieStore = cookies();

  const token = (await cookieStore).get("access_token")?.value;

  console.log("Token in layout", token);

  let user: any = null;

  if (token) {
    try {
      const { data } = await safeFetch<{ user: UserInfoProfileType }>(
        `${API_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
        [] as any,
      );

      // if (res.ok) {
      // const data = await res.json();
      user = data?.user || null;
      // }
    } catch (err) {
      console.log("User fetch failed");
    }
  }

  console.log("Initial user in layout", user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <UserProvider initialUser={user}>
              {/* <Navbar /> */}
              {children}
              <Toaster />
            </UserProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
