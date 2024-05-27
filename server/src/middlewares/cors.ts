// Server configuration
const allowedOrigin = Bun.env.ORIGIN;

// Add CORS headers middleware
export const addCorsHeaders = (response: Response, origin: string) => {
  if (origin === allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, DELETE"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Webhook-URL"
    );
  }
};
