const http = require("node:http");
const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");

const request = (path, options = {}) =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method: options.method || "GET",
          headers: options.headers || {},
        },
        (res) => {
          let body = "";

          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            server.close(() => resolve({ body, headers: res.headers, statusCode: res.statusCode }));
          });
        }
      );

      req.on("error", (error) => {
        server.close(() => reject(error));
      });
      req.end();
    });
  });

test("GET /health returns service status without a database connection", async () => {
  const response = await request("/health");

  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), {
    ok: true,
    service: "awareness-journal-api",
  });
});

test("GET /health allows the GitHub Pages frontend origin", async () => {
  const response = await request("/health", {
    headers: {
      Origin: "https://dinhloan.github.io",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["access-control-allow-origin"], "https://dinhloan.github.io");
});
