<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { formatSize } from "..";
  import DeleteFileButton from "./delete-file-button.svelte";
  import DownloadFileButton from "./download-file-button.svelte";
  import { filesList } from "@/store";
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Filename</Table.Head>
      <Table.Head>Type</Table.Head>
      <Table.Head>Size</Table.Head>
      <Table.Head>Chunks</Table.Head>
      <Table.Head>Created</Table.Head>
      <Table.Head>Actions</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#if $filesList.length > 0}
      {#each $filesList as item, i}
        <Table.Row id="file-{i}">
          <Table.Cell class="font-medium">
            {item.filename}
          </Table.Cell>
          <Table.Cell>{item.filetype}</Table.Cell>
          <Table.Cell>{formatSize(item.size)}</Table.Cell>
          <Table.Cell>{item.chunks.length}</Table.Cell>
          <Table.Cell>{new Date(item.created).toLocaleString()}</Table.Cell>
          <Table.Cell class="space-x-2" colspan={2}>
            <DownloadFileButton file={item} />
            <DeleteFileButton file={item} />
          </Table.Cell>
        </Table.Row>
      {/each}
    {:else}
      <Table.Row>
        <Table.Cell class="font-medium text-center" colspan={7}>
          No files found
        </Table.Cell>
      </Table.Row>
    {/if}
  </Table.Body>
</Table.Root>
