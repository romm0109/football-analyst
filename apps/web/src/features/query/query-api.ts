import { AudienceMode, QueryResult } from "../../types/analysis";

const API_BASE = "/api/v1/query";

export async function runQuery(question: string, audienceMode: AudienceMode): Promise<QueryResult> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question, audienceMode })
  });
  if (!response.ok) {
    throw new Error("Query failed");
  }
  return (await response.json()) as QueryResult;
}

export async function clarifyQuery(queryId: string, answer: string): Promise<QueryResult> {
  const response = await fetch(`${API_BASE}/${queryId}/clarify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ answer })
  });
  if (!response.ok) {
    throw new Error("Clarification failed");
  }
  return (await response.json()) as QueryResult;
}
