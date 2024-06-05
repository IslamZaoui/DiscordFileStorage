<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import Trash_2 from "lucide-svelte/icons/trash-2";
  import Loading from "lucide-svelte/icons/loader-circle";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import { filesList } from "@/store";

  export let file: FileMeta;
  const URL = $page.data.webhookUrl;
  let deleting = false;

  async function deleteFile(): Promise<void> {
    deleting = true;
    const response = await fetch(`${$page.data.backend_url}/delete`, {
      method: "DELETE",
      body: JSON.stringify({
        file,
        webhook_url: $URL,
      }),
    });
    if (response.status === 200) {
      $filesList = $filesList.filter((f) => f.created !== file.created);
      toast.success("File deleted successfully");
    } else {
      toast.error("Failed to delete file");
    }
    deleting = false;
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
