<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import Trash_2 from "lucide-svelte/icons/trash-2";
  import Loading from "lucide-svelte/icons/loader-circle";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";

  export let id: number;
  export let reloader: () => void = () => {};
  const URL = $page.data.webhookUrl;
  let deleting = false;

  function triggerRefresh() {
    const event = new CustomEvent("refreshFiles", {
      detail: {},
    });
    window.dispatchEvent(event);
  }

  async function deleteFile(): Promise<void> {
    deleting = true;
    const response = await fetch(
      `${$page.data.backend_url}/handleFile?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Webhook-URL": $URL ?? "",
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      toast.success("File deleted successfully");
      reloader();
    } else {
      toast.error("Failed to delete file");
    }
    deleting = false;
    triggerRefresh();
  }
</script>

<Button
  size="icon"
  disabled={deleting}
  variant="destructive"
  on:click={deleteFile}
>
  {#if !deleting}
    <Trash_2 />
  {:else}
    <Loading class="animate-spin" />
  {/if}
</Button>
