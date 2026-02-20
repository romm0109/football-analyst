export async function submitRating(payload: {
  queryId: string;
  roleType: "analyst" | "coach";
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}): Promise<void> {
  const response = await fetch("/api/v1/feedback/rating", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error("Rating submission failed");
  }
}

export async function fetchFeedbackSummary(): Promise<{ totalRatings: number; averageScore: number }> {
  const response = await fetch("/api/v1/feedback/summary", {
    method: "GET",
    credentials: "include"
  });
  if (!response.ok) {
    throw new Error("Failed to fetch feedback summary");
  }
  return (await response.json()) as { totalRatings: number; averageScore: number };
}
