<script>
    import Footer from "./footer.svelte";
    import Header from "./feader.svelte";

    export let data;

    $: webhookUrl = data.webhookUrl;
    $: backendURL = data.backendURL;
</script>

<div class="flex flex-col min-h-screen">
    <Header {backendURL} {webhookUrl} />
    <main class="flex-1 overflow-y-auto px-4">
        <slot />
    </main>
    <Footer />
</div>
