<script lang="ts">
    import SetupBackendDialog from "../setup-backend-dialog.svelte";
    import SetupWebhookDialog from "../setup-webhook-dialog.svelte";
    import SettingsButton from "../settings-button.svelte";
    import UploadFileDialog from "@/components/upload-file-button.svelte";

    export let backendURL;
    export let webhookUrl;

    let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<header class="sticky top-0 w-full p-6 bg-background select-none z-20 mb-8">
    <div
        class="max-w-4xl w-full mx-auto flex justify-between items-center gap-8"
    >
        <h1 class="text-2xl font-bold">
            <a href="/">Discord {innerWidth < 768 ? "FS" : "File Storage"}</a>
        </h1>
        <nav class="flex items-center justify-end gap-2">
            {#if !$backendURL}
                <SetupBackendDialog />
            {/if}
            {#if !$webhookUrl}
                <SetupWebhookDialog />
            {/if}
            {#if $backendURL && $webhookUrl}
                <UploadFileDialog />
                <SettingsButton />
            {/if}
        </nav>
    </div>
</header>
