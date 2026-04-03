export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  fallback: T,
): Promise<{ data: T; error: string | null }> {
  console.log("Final URL:", url);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
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
