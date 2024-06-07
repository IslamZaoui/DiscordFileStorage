import { z } from "zod";
import { MAX_FILE_SIZE } from "../config";

export const backendschema = z.object({
    backend_url: z
        .string({ required_error: "Backend URL is required" })
        .url({ message: "Invalid backend URL" }),
});

export const webhookSchema = z.object({
    webhook_url: z
        .string({ required_error: "Webhook URL is required" })
        .url({ message: "Invalid webhook URL" }),
});

export const uploadSchema = z.object({
    file: z
        .instanceof(File, { message: "Invalid file" })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 5MB",
        }),
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

export function joinURL(host: string, pathname: string): string {
    const trimmedHost = host.endsWith("/") ? host.slice(0, -1) : host;
    const url = new URL(pathname, trimmedHost);
    return url.toString();
}
