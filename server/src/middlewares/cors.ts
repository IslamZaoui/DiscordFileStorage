import { cors } from "hono/cors";

export const corsMiddleware = cors({
    origin: process.env.ORIGIN ?? "http://localhost:5173",
    allowHeaders: ["Content-Type", "Webhook-URL"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
    maxAge: 86400,
    credentials: true,
});
