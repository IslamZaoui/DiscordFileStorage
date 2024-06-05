type Chunk = {
  attachment: import("discord.js").BufferResolvable;
  name: string;
};

type ChunkMeta = {
  order: number;
  message_id: string;
};
