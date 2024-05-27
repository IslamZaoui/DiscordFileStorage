import { persisted } from "svelte-persisted-store";
import type { Writable } from "svelte/store";

export const webhookUrl: Writable<string | undefined> = persisted(
  "webhook-url",
  undefined
);

export type WebhookUrl = typeof webhookUrl
