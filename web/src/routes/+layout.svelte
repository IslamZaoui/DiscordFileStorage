<script>
  import Button from "@/components/ui/button/button.svelte";
  import "../app.pcss";
  import SetupWebhookDialog from "@/components/setup-webhook-dialog.svelte";
  import UploadFileDialog from "@/components/upload-file-button.svelte";
  import { Toaster } from "$lib/components/ui/sonner";

  export let data;

  $: webhookUrl = data.webhookUrl;
</script>

<Toaster richColors />
<main class="size-screen">
  <nav class="sticky top-0 w-full p-6 bg-background">
    <div class="max-w-[900px] mx-auto flex justify-between items-center gap-8">
      <h1 class="text-2xl font-bold"><a href="/">Discord File Storage</a></h1>
      <div>
        {#if !$webhookUrl}
          <SetupWebhookDialog />
        {:else}
          <UploadFileDialog />
        {/if}
      </div>
    </div>
  </nav>
  <slot />
</main>
