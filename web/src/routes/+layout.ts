import { PUBLIC_API_URL } from "$env/static/public";
import { webhookUrl } from "@/store";

export const ssr = false;
export const prerender = true;

export const load = () => {
  return {
    webhookUrl: webhookUrl,
    backend_url: PUBLIC_API_URL,
  };
};
