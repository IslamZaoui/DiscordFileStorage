import { webhookUrl, backendURL } from "@/store";

export const ssr = false;
export const prerender = true;

export const load = () => {
    return {
        webhookUrl,
        backendURL,
    };
};
