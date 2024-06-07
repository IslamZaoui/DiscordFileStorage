declare global {
    type FileMeta = {
        filename: string;
        filetype: string;
        size: number;
        chunks: chunk[];
        created: string;
    };

    type chunk = {
        message_id: string;
        order: number;
    };

    namespace App {
        interface Error {
            message: string;
            details?: string;
        }
        interface PageData {
            backendURL: import("@/store").BackendURL;
            webhookUrl: import("@/store").WebhookUrl;
        }
    }
}

export {};
