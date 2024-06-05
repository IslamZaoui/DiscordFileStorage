import { z } from "zod";

const webhook_url = z
  .string({ required_error: "Webhook URL is required" })
  .url({ message: "Invalid webhook URL" });

export const uploadSchema = z.object({
  webhook_url,
  file: z.instanceof(File, { message: "Invalid file" }),
});

export const checkSchema = z.object({
  webhook_url,
});

const chunkSchema = z.object({
  order: z.number().int(),
  message_id: z.string(),
});

const fileSchema = z.object({
  filename: z.string(),
  filetype: z.string(),
  size: z.number().int(),
  chunks: z.array(chunkSchema),
  created: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const downloadSchema = z.object({
  webhook_url,
  file: fileSchema,
});
