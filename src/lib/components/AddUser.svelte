<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';
	import Loader from './Loader.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	export let open: boolean = false;
	export let user: { name?: string; title?: string; email?: string; role?: string } | null = null;

	let isLoading = false;
	let userInput = {
		name: user?.name ?? '',
		title: user?.title ?? '',
		email: user?.email ?? '',
		role: user?.role ?? ''
	};
	let errors = { name: '', title: '', email: '', role: '' };

	// keep userInput in sync when the `user` prop changes (doesn't react to userInput changes)
	$: if (user !== undefined) {
		userInput = {
			name: user?.name ?? '',
			title: user?.title ?? '',
			email: user?.email ?? '',
			role: user?.role ?? ''
		};
	}

	const handleSubmit: SubmitFunction = async () => {
		isLoading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					open = false;
					toast.success(result.data?.message);
					await update({ reset: true });
					break;
				case 'failure':
					userInput = result.data?.input ?? {};
					errors = result.data?.errors ?? {};
					toast.error(result.data?.message ?? 'Invalid credentials.');
					await update();
					break;
			}

			isLoading = false;
		};
	};
</script>

<div>
	<Modal
		dismissable={false}
		title={user ? 'Edit Profile' : 'Create New User'}
		bind:open
		class="relative w-full transform overflow-hidden rounded-lg bg-stone-200 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6 sm:pb-4"
	>
		<div class="sm:flex sm:items-start">
			<form
				action={user ? '/team?/updateUser' : '/team?/addUser'}
				method="POST"
				use:enhance={handleSubmit}
				class="mt-3 w-full sm:mt-0 sm:ml-4 sm:text-left"
			>
				<div class="mt-2 flex flex-col gap-6">
					<div>
						<Label for="last_name" class="mb-2">Full Name</Label>
						<Input
							bind:value={userInput.name}
							color="blue"
							class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
							type="text"
							name="name"
							placeholder="Full Name"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.name}</span>
						{/if}
					</div>
					<div>
						<Label for="last_name" class="mb-2">Title</Label>
						<Input
							bind:value={userInput.title}
							color="blue"
							class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
							type="text"
							name="title"
							placeholder="Title"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.title}</span>
						{/if}
					</div>
					<div>
						<Label for="last_name" class="mb-2">Email</Label>
						<Input
							bind:value={userInput.email}
							color="blue"
							class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
							type="email"
							name="email"
							placeholder="email"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.email}</span>
						{/if}
					</div>
					<div>
						<Label for="last_name" class="mb-2">Role</Label>
						<Input
							bind:value={userInput.role}
							color="blue"
							class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
							type="text"
							name="role"
							placeholder="role"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.role}</span>
						{/if}
					</div>
				</div>

				{#if isLoading}
					<div class="py-5">
						<Loader />
					</div>
				{:else}
					<div class="mt-4 gap-4 py-3 sm:flex sm:flex-row-reverse">
						<Button
							color="blue"
							type="submit"
							class="cursor-pointer bg-blue-600 px-8 text-sm font-semibold text-stone-50 hover:bg-blue-700 sm:w-auto"
						>
							Submit
						</Button>

						<Button
							color="light"
							type="button"
							class="cursor-pointer bg-stone-100 px-5 text-sm font-semibold text-stone-900 sm:w-auto"
							onclick={() => {
								userInput = { name: '', email: '', title: '', role: '' };
								errors = { name: '', title: '', email: '', role: '' };
								open = false;
							}}
						>
							Cancel
						</Button>
					</div>
				{/if}
			</form>
		</div>
	</Modal>
</div>
