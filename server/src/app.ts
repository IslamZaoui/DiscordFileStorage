import { Hono } from "hono";
import { serve } from "bun";
import { loggerMiddleware } from "./middlewares/logger";
import { corsMiddleware } from "./middlewares/cors";
import router from "./routes";
import { MAX_FILE_SIZE } from "./config";

const app = new Hono();

app.use(loggerMiddleware);
app.use("/*", corsMiddleware);

app.get("/", (c) => {
    return c.json({
        message: "Discord File Storage API online ✔",
    });
});

app.route("/", router);

const server = serve({
    port: Bun.env.PORT || 3000,
    hostname: Bun.env.HOST || "localhost",
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
    maxRequestBodySize: MAX_FILE_SIZE,
});

console.log(
    `Discord File Storage API running on http://${server.hostname}:${server.port}`
);
