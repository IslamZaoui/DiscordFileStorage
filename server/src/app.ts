import { Hono } from "hono";
import { loggerMiddleware } from "./middlewares/logger";
import { corsMiddleware } from "./middlewares/cors";
import router from "./routes";

const app = new Hono();

app.use(loggerMiddleware);
app.use("/*", corsMiddleware);

app.get("/", (c) => {
  return c.json({
    message: "Discord File Storage API online ✔",
  });
});

app.route("/", router);

export default app;
