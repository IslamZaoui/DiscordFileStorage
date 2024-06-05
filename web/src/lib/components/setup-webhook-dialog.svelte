<script lang="ts">
  import * as AlertDialog from "@/components/ui/alert-dialog/index";
  import Button from "@/components/ui/button/button.svelte";
  import { superForm, defaults } from "sveltekit-superforms";
  import { toast } from "svelte-sonner";
  import { zod } from "sveltekit-superforms/adapters";
  import * as Form from "@/components/ui/form/index";
  import { webhookSchema } from "@/index";
  import { Input } from "@/components/ui/input";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";

  let formElement: HTMLFormElement;
  const url = $page.data.backend_url;
  $: webhookUrl = $page.data.webhookUrl;

  let message = writable<string | undefined>(undefined);

  const form = superForm(defaults(zod(webhookSchema)), {
    SPA: true,
    validators: zod(webhookSchema),
    async onUpdate({ form }) {
      $message = undefined;
      if (form.valid) {
        try {
          const response = await fetch(`${url}/check`, {
            method: "POST",
            body: JSON.stringify({
              webhook_url: form.data.webhook_url,
            }),
          });
          if (response.status === 200) {
            $webhookUrl = form.data.webhook_url;
            open = false;
            toast.success("Webhook setup successfully");
          } else if (response.status === 400) {
            $message = "Invalid webhook URL";
          } else {
            toast.error("Failed to setup webhook");
          }
          formElement.reset();
        } catch (err) {
          toast.error("Failed to setup webhook");
        }
      }
    },
  });

  const { form: formData, errors, enhance, delayed } = form;

  let open = false;
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger asChild>
    <Button variant="outline" on:click={() => (open = true)}>
      Setup Webhook
    </Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Enter your webhook url</AlertDialog.Title>
      <AlertDialog.Description>
        you dont have one? chech this <a class="link" href="/guide">link</a>
        to know how to get it.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <form use:enhance bind:this={formElement}>
      <Form.Field {form} name="webhook_url">
        <Form.Control let:attrs>
          <Form.Label />
          <Input
            {...attrs}
            type="password"
            bind:value={$formData.webhook_url}
          />
        </Form.Control>
        {#if $message}
          <span class="py-3">{$message}</span>
        {/if}
        <Form.FieldErrors />
      </Form.Field>
    </form>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button disabled={$delayed} on:click={() => form.submit(formElement)}>
          Submit
        </Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
