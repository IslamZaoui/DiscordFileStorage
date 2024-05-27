declare global {
  type FilesMetadata = {
    id: number;
    filename: string;
    filetype: string;
    size: number;
    chunks: number;
    created: Date;
  };

  namespace App {
    interface Error {
      message: string;
      details?: string;
    }
    interface PageData {
      webhookUrl: import("@/store").WebhookUrl;
      backend_url: string;
    }
  }
}

export {};
