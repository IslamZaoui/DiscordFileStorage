<script lang="ts">
    import DeleteFileButton from "../delete-file-button.svelte";
    import DownloadFileButton from "../download-file-button.svelte";

    export let file: FileMeta;
</script>

<div class="flex gap-2">
    <DownloadFileButton {file} />
    <DeleteFileButton {file} />
</div>
