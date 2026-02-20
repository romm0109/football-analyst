export interface PdfExportResult {
  exportId: string;
  downloadUrl: string;
  pages: number;
}

export async function exportPdf(
  dashboardId: string,
  queryId: string,
  includeNarrative = true
): Promise<PdfExportResult> {
  const response = await fetch("/api/v1/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ dashboardId, queryId, includeNarrative })
  });
  if (!response.ok) {
    throw new Error("PDF export failed");
  }
  return (await response.json()) as PdfExportResult;
}
