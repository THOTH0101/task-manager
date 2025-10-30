<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import { toast } from 'svelte-sonner';
	import Loader from './Loader.svelte';

	let { open = $bindable(), email } = $props();

	let errors = $state({
		password: '',
		confirmPassword: ''
	});

	let userInput = $state({
		password: '',
		confirmPassword: ''
	});

	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = async () => {
		isLoading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success('Password changed successfully.');
					open = false;
					break;
				case 'failure':
					userInput = result.data?.input || {};
					errors = result.data?.errors || {};
					toast.error(result.data?.message ?? 'Invalid credentials.');
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
	dismissable={false}
	title="Create New Password"
	bind:open
	class="relative w-full transform overflow-hidden rounded-lg bg-stone-200 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6 sm:pb-4"
>
	<form method="POST" action="/team?/changePassword" class="space-y-6" use:enhance={handleSubmit}>
		<div class="flex flex-col gap-y-4">
			<input type="hidden" name="email" value={email} />
			<div>
				<Label>New Password</Label>
				<Input
					bind:value={userInput.password}
					placeholder={'Enter your new password'}
					type={'password'}
					name={'password'}
					class={'w-full rounded'}
					color="blue"
				/>
				{#if errors}
					<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.password}</span>
				{/if}
			</div>
			<div>
				<Label>Confirm Password</Label>
				<Input
					bind:value={userInput.confirmPassword}
					placeholder={'Enter your new password'}
					type={'password'}
					name={'confirmPassword'}
					class={'w-full rounded'}
					color="blue"
				/>
				{#if errors}
					<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.confirmPassword}</span>
				{/if}
			</div>
		</div>
		<div class="mt-4 gap-4 py-3 sm:flex sm:flex-row-reverse">
			{#if isLoading}
				<Loader />
			{:else}
				<Button type="submit" color="blue" class="px-8 text-sm font-semibold sm:w-auto">
					Create
				</Button>

				<Button
					color="light"
					type="button"
					class="cursor-pointer bg-stone-100 px-5 text-sm font-semibold text-stone-900 sm:w-auto"
					onclick={() => {
						userInput = { password: '', confirmPassword: '' };
						errors = { password: '', confirmPassword: '' };
						open = false;
					}}
				>
					Cancel
				</Button>
			{/if}
		</div>
	</form>
</Modal>
