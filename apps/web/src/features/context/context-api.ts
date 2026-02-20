import { TeamContext } from "../../types/analysis";

const API_BASE = "/api/v1";

export async function saveContext(context: TeamContext): Promise<TeamContext> {
  const response = await fetch(`${API_BASE}/context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(context)
  });
  if (!response.ok) {
    throw new Error("Failed to save context");
  }
  const data = (await response.json()) as { context: TeamContext };
  return data.context;
}

export async function fetchContext(): Promise<TeamContext | null> {
  const response = await fetch(`${API_BASE}/context`, {
    method: "GET",
    credentials: "include"
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch context");
  }
  const data = (await response.json()) as { context: TeamContext };
  return data.context;
}
