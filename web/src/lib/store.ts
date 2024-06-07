import { persisted } from "svelte-persisted-store";
import type { Writable } from "svelte/store";

export const backendURL: Writable<string | undefined> = persisted(
    "backend-url",
    undefined
);
export type BackendURL = typeof backendURL;

export const webhookUrl: Writable<string | undefined> = persisted(
    "webhook-url",
    undefined
);
export type WebhookUrl = typeof webhookUrl;

export const filesList: Writable<FileMeta[]> = persisted("files-list", []);
export type FilesList = typeof filesList;
