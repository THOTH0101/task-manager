<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { QuestionCircleSolid } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';

	let { open = $bindable(), type = 'delete', msg = null, action, userId } = $props();
</script>

<Modal
	bind:open
	transition={slide}
	permanent
	class="relative w-full transform overflow-hidden rounded-lg bg-stone-200 px-4 pt-5 pb-0 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6 sm:pb-4"
>
	<div class="flex w-full flex-col items-center justify-center gap-4 py-4">
		<h3>
			<p class="rounded-full bg-red-200 p-3 text-red-600">
				<QuestionCircleSolid class="h-10 w-10 shrink-0" />
			</p>
		</h3>

		<p class="text-center text-stone-500">
			{msg ?? 'Are you sure you want to delete the selected record?'}
		</p>

		<div class="gap-4 bg-stone-200 py-3 sm:flex sm:flex-row-reverse">
			<form {action} method="POST">
				<input type="hidden" name="id" value={userId} />
				<Button type="submit" color={type === 'restore' || type === 'restoreAll' ? 'yellow' : 'red'}
					>Yes, I'm sure</Button
				>
			</form>
			<Button type="submit" color="alternative" outline onclick={() => (open = false)}
				>No, cancel</Button
			>
		</div>
	</div>
</Modal>
