import { Hono } from "hono";
import { downloadSchema } from "../schemas";
import { downloadChunks } from "../services/discord";
import { combineChunks } from "../utils";

const downloadRoute = new Hono();

downloadRoute.post("/download", async (c) => {
    const data = await c.req.json();
    const result = await downloadSchema.safeParseAsync(data);
    if (!result.success) return c.text("Invalid!", 400);
    const { webhook_url, file } = result.data;

    let chunks: Buffer[] = [];
    try {
        chunks = await downloadChunks(file.chunks, webhook_url);
    } catch (err) {
        return c.text("Failed to download file", 500);
    }

    let fileTOSend: Blob;
    try {
        fileTOSend = combineChunks(chunks, file.filetype);
    } catch (err) {
        return c.text("Failed to combine chunks", 500);
    }

    return c.body(fileTOSend.stream(), {
        headers: {
            "Content-Type": file.filetype,
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        },
    });
});

export default downloadRoute;
