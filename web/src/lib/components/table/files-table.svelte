<script lang="ts">
    import {
        createTable,
        Render,
        Subscribe,
        createRender,
    } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import DataTableActions from "./table-actions.svelte";
    import { addSortBy, addTableFilter } from "svelte-headless-table/plugins";
    import chevronUp from "lucide-svelte/icons/chevron-up";
    import chevronDown from "lucide-svelte/icons/chevron-down";
    import * as Table from "$lib/components/ui/table";
    import { filesList } from "@/store";
    import { Input } from "$lib/components/ui/input";
    import { formatSize } from "@/index";
    import Button from "../ui/button/button.svelte";

    let table = createTable(readable($filesList), {
        sort: addSortBy(),
        filter: addTableFilter({
            fn: ({ filterValue, value }) =>
                value.toLowerCase().includes(filterValue.toLowerCase()),
        }),
    });

    const cols = [
        table.column({
            header: "Filename",
            accessor: "filename",
            id: "filename",
        }),
        table.column({
            header: "Type",
            accessor: "filetype",
            id: "filetype",
            plugins: {
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            header: "Size",
            accessor: "size",
            cell: ({ value }) => formatSize(value),
            plugins: {
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            header: "Chunks",
            accessor: "chunks",
            cell: ({ value }) => value.length,
            plugins: {
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            header: "Created",
            accessor: "created",
            cell: ({ value }) => new Date(value).toLocaleString(),
            plugins: {
                filter: {
                    exclude: true,
                },
            },
        }),
        table.column({
            accessor: (file) => file,
            header: "Actions",
            cell: ({ value }) => {
                return createRender(DataTableActions, { file: value });
            },
            id: "actions",
            plugins: {
                filter: {
                    exclude: true,
                },
            },
        }),
    ];

    let columns = table.createColumns(cols);

    let { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
        table.createViewModel(columns);
    let { filterValue } = pluginStates.filter;

    $: filesList.subscribe((filesList) => {
        table = createTable(readable(filesList), {
            sort: addSortBy(),
            filter: addTableFilter({
                fn: ({ filterValue, value }) =>
                    value.toLowerCase().includes(filterValue.toLowerCase()),
            }),
        });

        columns = table.createColumns(cols);
        ({ headerRows, pageRows, tableAttrs, tableBodyAttrs } =
            table.createViewModel(columns));

        ({ filterValue } = pluginStates.filter);
    });
</script>

<div class="w-full space-y-4">
    <div class="flex items-center gap-3">
        <Input
            class="max-w-sm"
            placeholder="search by filename"
            type="text"
            bind:value={$filterValue}
        />
    </div>
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe
                                attrs={cell.attrs()}
                                let:attrs
                                let:props
                                props={cell.props()}
                            >
                                <Table.Head {...attrs}>
                                    {#if !props.sort.disabled && cell.id !== "actions"}
                                        <div
                                            class="flex items-center gap-2 justify-between"
                                        >
                                            <Render of={cell.render()} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                on:click={props.sort.toggle}
                                            >
                                                <svelte:component
                                                    this={props.sort.order ===
                                                    "asc"
                                                        ? chevronUp
                                                        : chevronDown}
                                                    size={16}
                                                />
                                            </Button>
                                        </div>
                                    {:else}
                                        <Render of={cell.render()} />
                                    {/if}
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell
                                    {...attrs}
                                    class={cell.id === "filename"
                                        ? "font-bold truncate max-w-[150px]"
                                        : cell.id === "filetype"
                                          ? "truncate max-w-[150px]"
                                          : ""}
                                >
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
