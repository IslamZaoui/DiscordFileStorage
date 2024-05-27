type Chunk = {
  attachment: import("discord.js").BufferResolvable;
  name: string;
};

type ChunkMeta = {
  url: string;
  order: number;
  message_id: string;
};

type UploadRequestPayload = {
  webhook_url: string;
  file: File;
};

type CheckRequestPayload = {
  webhook_url: string;
};

type FilesListResponsePayload = {
  id: number;
  filename: string;
  filetype: string;
  size: number;
  chunks: number;
  created: Date;
};
