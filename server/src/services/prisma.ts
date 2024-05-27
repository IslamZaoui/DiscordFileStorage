import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

export async function cacheFiles(
  file: File,
  chunks: (ChunkMeta | undefined)[]
): Promise<void> {
  await prisma.files.create({
    data: {
      filename: file.name,
      filetype: file.type,
      size: file.size,
      chunks: {
        create: chunks.filter((c) => c !== undefined) as ChunkMeta[],
      },
    },
  });
}

export async function checkFileExists(id: number): Promise<
  | {
      chunks: ChunkMeta[];
      filename: string;
      filetype: string;
    }
  | undefined
> {
  const file = await prisma.files.findUnique({
    where: {
      id,
    },
    include: {
      chunks: true,
    },
  });

  if (!file) return undefined;

  return {
    chunks: file.chunks,
    filename: file.filename,
    filetype: file.filetype,
  };
}

export async function deleteCachedFile(id: number): Promise<void> {
  await prisma.files.delete({
    where: {
      id,
    },
  });
}

export async function getFilesList(): Promise<FilesListResponsePayload[]> {
  const files = await prisma.files.findMany({
    include: {
      chunks: true,
    },
  });
  return files.map((file) => ({
    id: file.id,
    filename: file.filename,
    filetype: file.filetype,
    size: file.size,
    chunks: file.chunks.length,
    created: file.created_at,
  }));
}
