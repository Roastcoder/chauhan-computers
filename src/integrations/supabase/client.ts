const BASE = (import.meta.env.VITE_API_URL as string) || "https://saddlebrown-lapwing-971744.hostingersite.com/api";

function getToken() {
  return localStorage.getItem("auth_token");
}

async function request(method: string, path: string, body?: any) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  get: (path: string) => request("GET", path),
  post: (path: string, body: any) => request("POST", path, body),
  put: (path: string, body: any) => request("PUT", path, body),
  delete: (path: string) => request("DELETE", path),

  async uploadFiles(files: File[]): Promise<string[]> {
    const token = getToken();
    const form = new FormData();
    files.forEach(f => form.append("files", f));
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.urls as string[];
  },
};
