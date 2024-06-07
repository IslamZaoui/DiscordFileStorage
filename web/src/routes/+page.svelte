<script lang="ts">
    import FilesTable from "@/components/table/files-table.svelte";

    export let data;
    $: webhookUrl = data.webhookUrl;
    $: backendURL = data.backendURL;
</script>

<div
    class="w-full mx-auto gap-4 flex flex-col items-center justify-start max-w-4xl select-none"
>
    {#if !$backendURL}
        <div
            class="w-full flex flex-col justify-center items-center mx-auto h-[50px]"
        >
            <div class="w-full sapce-y-4">
                <h2 class="text-2xl font-bold">API URL not set</h2>
                <p>
                    Please set the API URL to be able to upload files to your
                    discord server.
                </p>
            </div>
        </div>
    {/if}
    {#if !$webhookUrl}
        <div
            class="w-full flex flex-col justify-center items-center mx-auto h-[50px]"
        >
            <div class="w-full sapce-y-4">
                <h2 class="text-2xl font-bold">webhook URL not set</h2>
                <p>
                    Please set the webhook URL to make the server able to save
                    files on your discord server.
                </p>
            </div>
        </div>
    {/if}
    {#if $backendURL && $webhookUrl}
        <section class="flex flex-col justify-center items-center w-full gap-4">
            <h2 class="text-2xl font-bold">Your files</h2>
            <FilesTable />
        </section>
    {/if}
</div>
