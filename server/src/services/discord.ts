import { WebhookClient } from "discord.js";

function initWebhook(webhookUrl: string) {
  return new WebhookClient({ url: webhookUrl });
}

export async function checkWebhookURL(webhookUrl: string) {
  const client = initWebhook(webhookUrl);
  const message = await client.send({
    content: "OK",
  });

  if (message.content === "OK") {
    await client.deleteMessage(message.id);
    return true;
  }
  return false;
}

export async function uploadChunks(
  chunks: Chunk[],
  webhookUrl: string
): Promise<(ChunkMeta | undefined)[]> {
  const client = initWebhook(webhookUrl);

  const uploadPromises = chunks.map(async (chunk, index) => {
    try {
      const message = await client.send({ files: [chunk], content: "" });
      const url = message.attachments[0]?.url;
      const order = index + 1;
      const message_id = message.id;
      return { url: url ?? "", order, message_id };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  });

  return await Promise.all(uploadPromises);
}

export async function deleteChunks(
  chunksMeta: ChunkMeta[],
  webhookUrl: string
) {
  const client = initWebhook(webhookUrl);
  const deletePormises = chunksMeta.map(async ({ message_id }) => {
    await client.deleteMessage(message_id);
  });

  await Promise.all(deletePormises);
}

async function convertArrayBufferToBuffer(response: Response): Promise<Buffer> {
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

export async function downloadChunks(
  chunksMeta: ChunkMeta[],
  webhookUrl: string
) {
  const client = initWebhook(webhookUrl);
  const downloadPromises = chunksMeta.map(async ({ message_id }) => {
    const message = await client.fetchMessage(message_id);
    const url = message.attachments[0].url;
    const response = await fetch(url);
    return convertArrayBufferToBuffer(response);
  });
  return await Promise.all(downloadPromises);
}
