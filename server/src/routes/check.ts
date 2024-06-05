import { Hono } from "hono";
import { checkSchema } from "../schemas";
import { checkWebhookURL } from "../services/discord";

const checkRoute = new Hono();

checkRoute.post("/check", async (c) => {
  const data = await c.req.json();
  const result = await checkSchema.safeParseAsync(data);
  if (!result.success) return c.text("Invalid!", 400);
  const { webhook_url } = result.data;
  const state = await checkWebhookURL(webhook_url);
  if (state) return c.text("OK", 200);
  return c.text("Invalid!", 400);
});

export default checkRoute;
