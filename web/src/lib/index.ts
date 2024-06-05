import { z } from "zod";

export const webhookSchema = z.object({
  webhook_url: z
    .string({ required_error: "Webhook URL is required" })
    .url({ message: "Invalid webhook URL" }),
});

export const uploadSchema = z.object({
  file: z.instanceof(File, { message: "Invalid file" }),
});

export function formatSize(size: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}