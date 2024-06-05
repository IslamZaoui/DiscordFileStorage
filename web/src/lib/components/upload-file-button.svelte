<script lang="ts">
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";
  import Upload from "lucide-svelte/icons/upload";
  import Loading from "lucide-svelte/icons/loader-circle";
  import Button from "./ui/button/button.svelte";
  import { Progress } from "./ui/progress";
  import { filesList } from "@/store";

  const URL = $page.data.backend_url;
  $: webhookUrl = $page.data.webhookUrl;
  let uploading = false;
  let progress = 0;

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

  function triggerRefresh() {
    const event = new CustomEvent("refreshFiles", {
      detail: {},
    });
    window.dispatchEvent(event);
  }

  async function uploadFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      uploading = true;
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
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
        uploading = false;
        triggerRefresh();
      };

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progress = Math.round(percentComplete);
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed"));
      };

      xhr.open("POST", `${URL}/upload`, true);
      xhr.send(formData);
    });
  }
</script>

<div class="flex justify-center items-center gap-1 flex-col">
  <Button disabled={uploading} class="flex gap-2" on:click={selectFile}>
    {#if !uploading}
      <Upload />
    {:else}
      <Loading class="animate-spin" />
    {/if}
    <span>Upload File</span>
  </Button>
  {#if uploading}
    <Progress class="h-[10px]" value={progress} max={100} />
  {/if}
</div>
