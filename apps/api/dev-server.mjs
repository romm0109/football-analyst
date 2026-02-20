import http from "node:http";

const host = process.env.API_HOST ?? "127.0.0.1";
const port = Number(process.env.API_PORT ?? 3000);

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (!req.url || !req.method) {
    json(res, 400, { error: "bad_request" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.url === "/health") {
    json(res, 200, { service: "api", status: "ok" });
    return;
  }

  if (req.url === "/api/v1/auth/me") {
    json(res, 401, { error: "unauthorized" });
    return;
  }

  json(res, 404, { error: "not_found", path: req.url });
});

server.listen(port, host, () => {
  console.log(`API service running at http://${host}:${port}`);
});
