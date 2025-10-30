<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Modal } from 'flowbite-svelte';
	import { QuestionCircleSolid } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';

	let { open = $bindable(), user } = $props();

	const handleSubmit: SubmitFunction = async () => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
				open = false;
				toast.success(result.data?.message);
			}
		};
	};
</script>

<Modal
	bind:open
	transition={slide}
	permanent
	class="relative w-full transform overflow-hidden rounded-lg bg-stone-200 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6 sm:pb-4"
>
	<div class="flex w-full flex-col items-center justify-center gap-4 py-4">
		<h3>
			<p class="rounded-full bg-red-200 p-3 text-red-600">
				<QuestionCircleSolid class="h-10 w-10 shrink-0" />
			</p>
		</h3>

		<p class="text-center text-gray-500">
			{'Are you sure you want to activate or deactive this account?'}
		</p>

		<div class="gap-4 bg-stone-200 py-3 sm:flex sm:flex-row-reverse">
			<form method="POST" action="/team?/activeUser" use:enhance={handleSubmit}>
				<input type="hidden" name="email" value={user?.email} />
				<input type="checkbox" name="isActive" checked={user?.isActive} class="peer sr-only" />
				<Button type="submit" color="red">Yes, I'm sure</Button>
			</form>

			<Button type="submit" color="alternative" outline onclick={() => (open = false)}>
				No, cancel
			</Button>
		</div>
	</div>
</Modal>
