import { z } from "zod";

export const webhookSchema = z.object({
  webhook_url: z
    .string({ required_error: "Webhook URL is required" })
    .url({ message: "Invalid webhook URL" }),
});

export const uploadSchema = z.object({
  file: z.instanceof(File, { message: "Invalid file" }),
});
