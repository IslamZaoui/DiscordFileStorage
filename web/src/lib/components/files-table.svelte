<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import * as Table from '$lib/components/ui/table'
  import Button from './ui/button/button.svelte'
  import Loading from 'lucide-svelte/icons/loader-circle'
  import DeleteFileButton from './delete-file-button.svelte'
  import RefreshIcon from 'lucide-svelte/icons/refresh-ccw'
  import DownloadFileButton from './download-file-button.svelte'

  let filesPromise: Promise<FilesMetadata[]>
  let refreshing = false

  async function getFilesList(): Promise<FilesMetadata[]> {
    refreshing = true
    const response = await fetch(`${$page.data.backend_url}/handleFile`)
    if (!response.ok) {
      throw new Error('Failed to fetch files')
    }
    refreshing = false
    return await response.json()
  }

  function refresh() {
    filesPromise = getFilesList()
  }

  onMount(() => {
    refresh()
    window.addEventListener('refreshFiles', refresh)

    return () => {
      window.removeEventListener('refreshFiles', refresh)
    }
  })
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
      <Table.Head>
        <Button
          size="sm"
          variant="outline"
          disabled={refreshing}
          on:click={refresh}>
          <RefreshIcon size="20" class="mr-2 {refreshing && 'animate-spin'}" />
          Refresh
        </Button>
      </Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#await filesPromise}
      <Table.Row>
        <Table.Cell class="font-medium" colspan={7}>
          <div class="flex items-center gap-2 justify-center">
            <Loading size="20" class="animate-spin" />
            <span>Loading...</span>
          </div>
        </Table.Cell>
      </Table.Row>
    {:then files}
      {#if files && files.length > 0}
        {#each files as item, i}
          <Table.Row itemid={item.id.toString()} id="file-{i}">
            <Table.Cell class="font-medium">{item.filename}</Table.Cell>
            <Table.Cell>{item.filetype}</Table.Cell>
            <Table.Cell>{item.size}</Table.Cell>
            <Table.Cell>{item.chunks}</Table.Cell>
            <Table.Cell>{item.created}</Table.Cell>
            <Table.Cell class="space-x-2" colspan={2}>
              <DownloadFileButton id={item.id} filename={item.filename} />
              <DeleteFileButton id={item.id} />
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
    {:catch error}
      <Table.Row>
        <Table.Cell class="font-medium text-center text-red-500" colspan={7}>
          Error loading files: {error.message}
        </Table.Cell>
      </Table.Row>
    {/await}
  </Table.Body>
</Table.Root>
