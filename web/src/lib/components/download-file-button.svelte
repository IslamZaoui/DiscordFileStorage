<script lang="ts">
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import Button from "./ui/button/button.svelte";
  import Download from "lucide-svelte/icons/download";
  import Loading from "lucide-svelte/icons/loader-circle";

  export let id: number;
  export let filename: string;
  $: webhookUrl = $page.data.webhookUrl;
  let downloading = false;

  async function fetchFile(link: string) {
    downloading = true;
    try {
      const response = await fetch(link, {
        headers: {
          "Webhook-URL": $webhookUrl ?? "",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
    downloading = false;
  }
  async function download() {
    const href = `${$page.data.backend_url}/download?id=${id}`;
    toast.promise(fetchFile(href), {
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
