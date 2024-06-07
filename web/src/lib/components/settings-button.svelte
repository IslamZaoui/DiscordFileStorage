<script>
    import SetupBackendDialog from "./setup-backend-dialog.svelte";
    import SetupWebhookDialog from "./setup-webhook-dialog.svelte";
    import Settings from "lucide-svelte/icons/settings";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    let open = false;
</script>

<DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger
        class="p-[8px] border rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
    >
        <Settings />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>Client Settings</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <SetupBackendDialog />
            <div class="my-1" />
            <SetupWebhookDialog />
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
