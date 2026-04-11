import { cookies } from "next/headers";

export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  fallback: T,
): Promise<{ data: T; error: string | null }> {
  console.log("Final URL:", url);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // ✅ Detect server environment
    let cookieHeader = "";

    try {
      const cookieStore = cookies();
      cookieHeader = (await cookieStore)
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch {
      // ❌ cookies() fails on client → ignore
      console.log("❌ cookies() fails on client → ignore");
    }

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        ...(cookieHeader && { Cookie: cookieHeader }), // ✅ inject cookies
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const message = `API Error: ${res.status} ${res.statusText}`;
      console.log(message);
      return { data: fallback, error: message };
    }

    const json = await res.json();
    return { data: json as T, error: null };
  } catch (err: any) {
    console.log("Fetch failed:", err.message || err);

    return {
      data: fallback,
      error: err.message || "Unknown error",
    };
  }
}

// export async function safeFetch<T>(
//   url: string,
//   options: RequestInit = {},
//   fallback: T,
// ): Promise<{ data: T; error: string | null }> {
//   console.log("Final URL:", url);
//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

//     const res = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });

//     clearTimeout(timeout);

//     if (!res.ok) {
//       const message = `API Error: ${res.status} ${res.statusText}`;
//       console.log(message);
//       return { data: fallback, error: message };
//     }

//     const json = await res.json();
//     return { data: json as T, error: null };
//   } catch (err: any) {
//     console.log("Fetch failed:", err.message || err);

//     return {
//       data: fallback,
//       error: err.message || "Unknown error",
//     };
//   }
// }
