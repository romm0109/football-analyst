import { AuthMeResponse } from "../../types/auth";

const API_BASE = "/api/v1/auth";

export async function fetchMe(): Promise<AuthMeResponse | null> {
  const response = await fetch(`${API_BASE}/me`, {
    method: "GET",
    credentials: "include"
  });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch auth session");
  }
  return (await response.json()) as AuthMeResponse;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include"
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Logout failed");
  }
}

export function buildGoogleStartUrl(): string {
  return `${API_BASE}/google/start`;
}
