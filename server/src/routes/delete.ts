import { Hono } from "hono";
import { downloadSchema } from "../schemas";
import { deleteChunks } from "../services/discord";

const deleteRoute = new Hono();

deleteRoute.delete("/delete", async (c) => {
  const data = await c.req.json();
  const result = await downloadSchema.safeParseAsync(data);
  if (!result.success) return c.text("Invalid!", 400);
  const { webhook_url, file } = result.data;
  try {
    await deleteChunks(file.chunks, webhook_url);
  } catch (err) {
    return c.text("Failed to delete file", 500);
  }
  return c.text("File deleted successfully", 200);
});

export default deleteRoute;
