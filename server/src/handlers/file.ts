import { uploadSchema, webhookUrlSchema } from "../schemas";
import {
  uploadChunks,
  deleteChunks,
  downloadChunks,
} from "../services/discord";
import {
  cacheFiles,
  checkFileExists,
  deleteCachedFile,
  getFilesList,
} from "../services/prisma";
import { chunkFile, combineChunks } from "../utils";
import logger from "../utils/logger";

export async function uploadFile(request: Request): Promise<Response> {
  logger.info("a user is uploading a file...");
  const res = await request.formData();
  const data = {
    webhook_url: res.get("webhook_url") as string,
    file: res.get("file") as File,
  };
  const result = await uploadSchema.safeParseAsync(data);
  if (!result.success) {
    return new Response(JSON.stringify(result.error.message), { status: 400 });
  }
  const { webhook_url, file } = result.data;
  let chunks: Chunk[];
  try {
    chunks = await chunkFile(file);
  } catch (error) {
    logger.error("upload failed at file chunking", error);
    return new Response("Failed to upload file", { status: 500 });
  }
  let meta: (ChunkMeta | undefined)[] = [];
  try {
    meta = await uploadChunks(chunks, webhook_url);
  } catch (error) {
    logger.error("upload failed at chunks uploading", error);
    for (const m of meta) {
      if (m && m.message_id !== "") {
        try {
          await deleteChunks([m], webhook_url);
        } catch {}
      }
    }
    return new Response("Failed to upload file", { status: 500 });
  }
  try {
    await cacheFiles(file, meta);
  } catch (error) {
    logger.error("upload failed at file caching", error);
    return new Response("Failed to upload file", { status: 500 });
  }
  return new Response("File uploaded successfully", { status: 200 });
}

export async function deleteFile(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("Invalid ID", { status: 400 });
  let ID = 0;
  try {
    ID = parseInt(id, 10);
  } catch (error) {
    return new Response("Invalid ID", { status: 400 });
  }
  const webhook_url = request.headers.get("Webhook-URL");
  if (!webhook_url) return new Response("Invalid webhook URL", { status: 400 });
  const result = await webhookUrlSchema.safeParseAsync(webhook_url);
  if (!result.success)
    return new Response("Invalid webhook URL", { status: 400 });
  const file = await checkFileExists(ID);
  if (!file) return new Response("File not found", { status: 404 });
  try {
    await deleteChunks(file.chunks, webhook_url);
  } catch (error) {
    logger.error("delete failed at chunks deleting", error);
  }
  try {
    await deleteCachedFile(ID);
  } catch (error) {
    logger.error("delete failed at file deleting", error);
    return new Response("Failed to delete file", { status: 500 });
  }
  return new Response("File deleted successfully", { status: 200 });
}

export async function downloadFile(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("Invalid ID", { status: 400 });
  const ID = parseInt(id, 10);
  const webhook_url = request.headers.get("Webhook-URL");
  if (!webhook_url) return new Response("Invalid webhook URL", { status: 400 });
  const result = await webhookUrlSchema.safeParseAsync(webhook_url);
  if (!result.success)
    return new Response("Invalid webhook URL", { status: 400 });
  const fileMeta = await checkFileExists(ID);
  if (!fileMeta) return new Response("File not found", { status: 404 });
  const { filename, filetype, chunks: chunksInfo } = fileMeta;
  const chunks = await downloadChunks(chunksInfo, webhook_url);
  const file = combineChunks(chunks, filename, filetype);
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": filetype,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function returnFilesList(): Promise<Response> {
  const files = await getFilesList();
  return new Response(JSON.stringify(files), { status: 200 });
}
