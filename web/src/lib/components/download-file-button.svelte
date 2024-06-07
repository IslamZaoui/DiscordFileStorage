<script lang="ts">
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import Button from "./ui/button/button.svelte";
    import Download from "lucide-svelte/icons/download";
    import Loading from "lucide-svelte/icons/loader-circle";
    import { joinURL } from "..";

    export let file: FileMeta;
    $: webhookUrl = $page.data.webhookUrl;
    $: backendURL = $page.data.backendURL;
    let downloading = false;

    async function fetchFile() {
        downloading = true;
        try {
            const response = await fetch(
                joinURL($backendURL as string, `/download`),
                {
                    method: "POST",
                    body: JSON.stringify({
                        file,
                        webhook_url: $webhookUrl,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = file.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            downloading = false;
        } catch (_) {
            downloading = false;
            throw new Error("Download failed");
        }
    }
    async function download() {
        toast.promise(fetchFile(), {
            loading: "Downloading file...",
            success: "File downloaded successfully",
            error: "Download failed",
        });
    }
</script>

<Button on:click={download} size="icon" disabled={downloading}>
    {#if downloading}
        <Loading class="animate-spin" />
    {:else}
        <Download />
    {/if}
</Button>
