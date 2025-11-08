<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Modal } from 'flowbite-svelte';
	import { QuestionCircleSolid } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import Loader from './Loader.svelte';

	let { open = $bindable(), type = 'delete', msg = null, action, userId = null } = $props();

	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = async ({ formData }) => {
		isLoading = true;

		if (userId) formData.append('id', userId);

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(result.data?.message);
					open = false;
					break;
				case 'failure':
					toast.error(result.data?.message);
					open = false;
					break;
				default:
					break;
			}
			isLoading = false;
			await update();
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
			<p
				class={'rounded-full p-3  ' +
					(type === 'restore' || type === 'restoreAll'
						? 'bg-yellow-200 text-yellow-500'
						: 'bg-red-200 text-red-600')}
			>
				<QuestionCircleSolid class="h-10 w-10 shrink-0" />
			</p>
		</h3>

		<p class="text-center text-stone-500">
			{msg ?? 'Are you sure you want to delete the selected record?'}
		</p>

		<div class="gap-4 bg-stone-200 py-3 sm:flex sm:flex-row-reverse">
			{#if isLoading}
				<Loader
					color={type === 'restore' || type === 'restoreAll' ? 'bg-yellow-500' : 'bg-red-500'}
				/>
			{:else}
				<form {action} method="POST" use:enhance={handleSubmit}>
					<Button
						type="submit"
						color={type === 'restore' || type === 'restoreAll' ? 'yellow' : 'red'}
					>
						Yes, I'm sure
					</Button>
				</form>
				<Button type="submit" color="alternative" outline onclick={() => (open = false)}>
					No, cancel
				</Button>
			{/if}
		</div>
	</div>
</Modal>
