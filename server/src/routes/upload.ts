import { Hono } from "hono";
import { uploadSchema } from "../schemas";
import { chunkFile, combineChunks } from "../utils";
import { uploadChunks } from "../services/discord";

const uploadRoute = new Hono();

uploadRoute.post("/upload", async (c) => {
    const fromData = await c.req.parseBody();
    const result = await uploadSchema.safeParseAsync(fromData);
    if (!result.success) return c.text("Invalid!", 400);
    const { webhook_url, file } = result.data;

    let chunks: Chunk[] = [];
    try {
        chunks = await chunkFile(file);
    } catch (err) {
        return c.text("Failed to split file", 500);
    }

    const meta = await uploadChunks(chunks, webhook_url);

    if (!meta) return c.text("Failed to upload file", 500);

    return c.json({
        filename: file.name,
        filetype: file.type,
        size: file.size,
        chunks: meta,
        created: new Date(),
    });
});

export default uploadRoute;
