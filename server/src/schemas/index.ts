import { z } from "zod";

export const webhookUrlSchema = z.string().url();

const fileSchema = z.instanceof(File);

export const uploadSchema = z.object({
  webhook_url: webhookUrlSchema,
  file: fileSchema,
});
