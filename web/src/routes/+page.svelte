<script lang="ts">
  import FilesTable from "@/components/files-table.svelte";

  export let data;
  $: webhookUrl = data.webhookUrl;
</script>

<div
  class="container mx-auto flex min-h-screen flex-col items-center justify-start p-4"
>
  <div class="max-w-[900px]">
    {#if !$webhookUrl}
      <p>Please setup webhook to be able to store your files.</p>
    {:else}
      <section class="flex flex-col justify-center items-center w-full gap-4">
        <h2 class="text-2xl font-bold">Your files</h2>
        <FilesTable />
      </section>
    {/if}
  </div>
</div>
