import { serve } from "bun";
import logger from "./utils/logger";
import { router } from "./routes";
import { addCorsHeaders } from "./middlewares/cors";

// Create and start the server
const server = serve({
  port: 8080,
  fetch: async (request: Request) => {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      const response = new Response(null, { status: 204 });
      addCorsHeaders(response, origin);
      return response;
    }

    try {
      const response = await router.handle(request);
      addCorsHeaders(response, origin);
      return response;
    } catch (error) {
      const errorResponse = new Response(JSON.stringify(error), {
        status: 500,
      });
      addCorsHeaders(errorResponse, origin);
      return errorResponse;
    }
  },
});

console.log(
  `Discord File Storage API running on http://${server.hostname}:${server.port}`
);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.message });
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});
