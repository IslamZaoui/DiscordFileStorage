<script lang="ts">
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import Upload from "lucide-svelte/icons/upload";
    import Button from "./ui/button/button.svelte";
    import { filesList } from "@/store";
    import { joinURL } from "..";

    $: backendURL = $page.data.backendURL;
    $: webhookUrl = $page.data.webhookUrl;

    function selectFile(): void {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) {
                toast.error("No file selected");
                return;
            }
            toast.promise(uploadFile(file), {
                loading: "Uploading file...",
                success: "File uploaded successfully",
                error: "Upload failed",
            });
        };
        input.click();
    }

    async function uploadFile(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file);
            // @ts-ignore
            formData.append("webhook_url", $webhookUrl);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const res: FileMeta = JSON.parse(xhr.responseText);
                    $filesList = [...$filesList, res];
                    resolve();
                } else {
                    reject(
                        new Error(`Upload failed with status ${xhr.status}`)
                    );
                }
            };

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                }
            };

            xhr.onerror = () => {
                reject(new Error("Upload failed"));
            };

            xhr.open("POST", joinURL($backendURL as string, `/upload`), true);
            xhr.send(formData);
        });
    }

    let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<div class="flex justify-center items-center gap-1 flex-col">
    <Button
        class="flex gap-2"
        size={innerWidth < 768 ? "icon" : "default"}
        on:click={selectFile}
    >
        <Upload />
        <span class="md:block hidden">Upload File</span>
    </Button>
</div>
