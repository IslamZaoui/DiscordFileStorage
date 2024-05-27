import { checkWebhookURL } from "../services/discord";

export async function validateWebhookURL(request: Request): Promise<Response> {
  const webhookURL = request.headers.get("Webhook-URL");

  if (!webhookURL) return new Response("Invalid webhook URL", { status: 400 });

  switch (await checkWebhookURL(webhookURL)) {
    case true:
      return new Response("OK", { status: 200 });
    case false:
      return new Response("Invalid webhook URL", { status: 400 });
  }
}
