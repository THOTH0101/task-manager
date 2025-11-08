<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';

	let { open = $bindable(), notice } = $props();
</script>

<Modal title={notice?.task?.title} bind:open dismissable={false}>
	<div class="flex w-full flex-col items-center justify-center gap-4 py-4">
		<p class="text-start text-gray-500">{notice?.text}</p>

		<Button
			type="button"
			class="mt-3 border border-gray-300 bg-white px-8 text-sm font-semibold text-gray-900 sm:w-auto"
			onclick={() => (open = false)}
		>
			Ok
		</Button>
	</div>
</Modal>
