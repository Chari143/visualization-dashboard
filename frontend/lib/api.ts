export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
function buildQueryString(params: Record<string, string[] | string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else if (value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export async function fetchMeta() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/meta`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch meta");
    return await res.json();
  } catch (error) {
    console.error(error);
    return {} as Record<string, string[]>;
  }
}

export async function fetchRecords(params: Record<string, string[] | string | number | undefined>) {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/records?${queryString}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch records");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { records: [] };
  }
}

export async function fetchYearSummary(params: Record<string, string[] | string | undefined>) {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/summary/year?${queryString}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch year summary");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}
