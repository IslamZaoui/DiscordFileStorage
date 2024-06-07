<script lang="ts">
    import * as AlertDialog from "@/components/ui/alert-dialog/index";
    import Button from "@/components/ui/button/button.svelte";
    import { superForm, defaults } from "sveltekit-superforms";
    import { toast } from "svelte-sonner";
    import { zod } from "sveltekit-superforms/adapters";
    import * as Form from "@/components/ui/form/index";
    import { backendschema } from "@/index";
    import { Input } from "@/components/ui/input";
    import { backendURL } from "@/store";

    let formElement: HTMLFormElement;

    const form = superForm(defaults(zod(backendschema)), {
        SPA: true,
        validators: zod(backendschema),
        async onUpdate({ form }) {
            try {
                const rep = await fetch(form.data.backend_url);
                if (
                    rep.status === 200 &&
                    (await rep.json())?.message ===
                        "Discord File Storage API online ✔"
                ) {
                    backendURL.set(form.data.backend_url);
                    open = false;
                    toast.success("Backend setup successfully");
                } else {
                    $errors.backend_url = ["Invalid backend URL"];
                }
            } catch (err) {
                toast.error("Failed to setup backend");
            }
        },
    });

    const { form: formData, errors, enhance, delayed } = form;

    let open = false;
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Trigger asChild>
        <Button variant="outline" class="w-full" on:click={() => (open = true)}>
            Setup API URL
        </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Enter your API url</AlertDialog.Title>
            <AlertDialog.Description>
                you dont have one? chech this <a
                    class="link"
                    on:click={() => (open = false)}
                    href="/guide"
                >
                    link
                </a>
                to know how to get it.
            </AlertDialog.Description>
        </AlertDialog.Header>
        <form use:enhance bind:this={formElement}>
            <Form.Field {form} name="backend_url">
                <Form.Control let:attrs>
                    <Form.Label />
                    <Input
                        {...attrs}
                        type="password"
                        bind:value={$formData.backend_url}
                    />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </form>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action asChild>
                <Button
                    disabled={$delayed}
                    on:click={() => form.submit(formElement)}
                >
                    Submit
                </Button>
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
