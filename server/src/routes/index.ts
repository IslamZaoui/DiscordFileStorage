import { validateWebhookURL } from "../handlers/validator";
import {
  uploadFile,
  downloadFile,
  deleteFile,
  returnFilesList,
} from "../handlers/file";

export const router = {
  async handle(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;

    if (request.method === "GET" && path === "/health") {
      return new Response("OK", { status: 200 });
    }

    if (path === "/check") {
      if (request.method === "POST") return await validateWebhookURL(request);

      return new Response("Method not allowed", { status: 405 });
    }

    if (path.startsWith("/handleFile")) {
      switch (request.method) {
        case "POST":
          return await uploadFile(request);
        case "GET":
          return await returnFilesList();
        case "DELETE":
          return await deleteFile(request);
        default:
          return new Response("Method not allowed", { status: 405 });
      }
    }

    if (request.method === "GET" && path.startsWith("/download")) {
      return await downloadFile(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
