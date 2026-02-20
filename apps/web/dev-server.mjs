import http from "node:http";

const host = process.env.WEB_HOST ?? "127.0.0.1";
const port = Number(process.env.WEB_PORT ?? 5173);
const apiBase = process.env.WEB_API_BASE ?? "http://127.0.0.1:3000";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Football Analyst</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f7fa; color: #111827; }
      .card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; max-width: 760px; }
      code { background: #eef2ff; padding: 0.1rem 0.4rem; border-radius: 6px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Football Analyst Web Service</h1>
      <p>Web service is running.</p>
      <p>Configured API base: <code>${apiBase}</code></p>
      <p>Try API health: <a href="${apiBase}/health">${apiBase}/health</a></p>
    </div>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end("bad_request");
    return;
  }
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ service: "web", status: "ok" }));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(port, host, () => {
  console.log(`Web service running at http://${host}:${port}`);
});
