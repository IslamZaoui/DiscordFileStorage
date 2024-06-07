<script>
    import "../app.pcss";
    import MainLayout from "@/components/layout/main-layout.svelte";
    import { Toaster } from "$lib/components/ui/sonner";

    export let data;
</script>

<Toaster richColors expand={true} />
<MainLayout {data}>
    <slot />
</MainLayout>
