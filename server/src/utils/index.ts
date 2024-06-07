import { MAX_CHUNK_SIZE } from "../config";

export async function chunkFile(file: File) {
    const reader = file.stream().getReader();
    let chunks = [];
    let totalSize = 0;
    let chunkData = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        totalSize += value.length;
        chunkData.push(Buffer.from(value));

        if (totalSize >= MAX_CHUNK_SIZE) {
            chunks.push(concatBuffers(chunkData));
            chunkData = [];
            totalSize = 0;
        }
    }

    if (totalSize > 0) {
        chunks.push(concatBuffers(chunkData));
    }

    return chunks.map((chunk, index) => ({
        attachment: chunk,
        name: `${file.name}.chunk${index}`,
    }));
}

export function combineChunks(chunks: Buffer[], filetype: string): Blob {
    if (chunks.length === 0) {
        throw new Error("No valid chunks to combine");
    }

    const combinedBlob = new Blob(chunks, { type: filetype });
    return combinedBlob;
}

function concatBuffers(buffers: Buffer[]): Buffer {
    return Buffer.concat(buffers);
}

function copyFile(originalFile: File): File {
    return new File([originalFile], originalFile.name, {
        type: originalFile.type,
    });
}
