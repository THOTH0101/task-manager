<script lang="ts">
	import { enhance } from '$app/forms';
	import { LISTS, PRIORITY } from '$lib';
	import { currentTeam } from '$lib/store/store';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { SelectOptionType } from 'flowbite-svelte';
	import { Button, Input, Label, Modal, MultiSelect } from 'flowbite-svelte';
	import { ImageOutline } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';
	import { get } from 'svelte/store';
	import Loader from './Loader.svelte';

	export let open: boolean = false;
	export let task: { title?: string; date?: string } | null = null;

	let isLoading = false;

	let users = get(currentTeam) ?? [];
	let selectedUsers: string[] = [];

	let listOption: SelectOptionType<string>[] = users.map((user) => ({
		value: JSON.stringify(user),
		name: user.name
	}));

	let userInput = {
		title: task?.title ?? '',
		dateInput: task?.date ?? ''
	};
	let errors = { title: '', dateInput: '' };

	// keep userInput in sync when the `task` prop changes (doesn't react to userInput changes)
	$: if (task !== undefined) {
		userInput = {
			title: task?.title ?? '',
			dateInput: task?.date ?? ''
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
					selectedUsers = [];
					break;
				case 'failure':
					userInput = result.data?.input;
					errors = result.data?.errors;
					toast.error(result.data?.message ?? 'Invalid credentials.');
					await update();
					break;
			}

			isLoading = false;
		};
	};
</script>

<Modal
	bind:open
	dismissable={false}
	class="relative w-full transform overflow-hidden rounded-lg bg-stone-200 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6 sm:pb-4"
	title={task ? 'UPDATE TASK' : 'ADD TASK'}
>
	<form
		action={task ? '/tasks?/updateTask' : '/tasks?/addTask'}
		method="POST"
		use:enhance={handleSubmit}
	>
		<div class="mt-2 flex flex-col gap-6">
			<div>
				<Label class="mb-2">Task Title</Label>
				<Input
					bind:value={userInput.title}
					color="blue"
					class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
					type="text"
					name="title"
					placeholder="Full Name"
				/>
				{#if errors}
					<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.title}</span>
				{/if}
			</div>

			<div class="relative mt-1">
				<Label class="mb-2">Assign Task To:</Label>

				<MultiSelect
					placeholder="Select users ..."
					items={listOption}
					bind:value={selectedUsers}
					size="md"
					name="users"
				/>
			</div>

			<div class="flex items-center gap-4">
				<div class="w-full">
					<Label class="mb-2">Task Stage</Label>
					<select
						name="stage"
						class="rounded-lg border border-stone-300 bg-stone-200 px-3 py-2.5 pr-10 pl-3 text-left sm:text-sm 2xl:py-3"
					>
						{#each LISTS as list}
							<option value={list}>
								{list}
							</option>
						{/each}
					</select>
				</div>

				<div class="w-full">
					<Label class="mb-2">Task Date</Label>
					<Input
						bind:value={userInput.dateInput}
						color="blue"
						class="w-full rounded border border-stone-300 bg-transparent px-2 py-0.5 text-base placeholder-stone-400 ring-blue-100 outline-none focus:ring-2 2xl:py-1"
						type="date"
						name="date"
						placeholder="Full Name"
					/>
					{#if errors}
						<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.dateInput}</span>
					{/if}
				</div>
			</div>

			<div class="flex gap-4">
				<div class="w-full">
					<Label class="mb-2">Priority Level</Label>
					<select
						name="priority"
						class="rounded-lg border border-stone-300 bg-stone-200 px-3 py-2.5 pr-10 pl-3 text-left sm:text-sm 2xl:py-3"
					>
						{#each PRIORITY as list}
							<option value={list}>
								{list}
							</option>
						{/each}
					</select>
				</div>

				<div class="mt-4 flex w-full items-center justify-center">
					<label
						class="text-ascent-1 hover:text-ascent-2 my-4 flex cursor-pointer items-center gap-1 text-base"
						for="imgUpload"
					>
						<input
							id="imgUpLoad"
							accept=".jpg, .png, .jpeg"
							type="file"
							class="hidden"
							multiple={true}
						/>

						<ImageOutline class="h-6 w-6 shrink-0" />
						<span>Add Assets</span>
					</label>
				</div>
			</div>

			<div class="gap-4 sm:flex sm:flex-row-reverse">
				{#if isLoading}
					<Loader />
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
								userInput = { title: '', dateInput: '' };
								errors = { title: '', dateInput: '' };
								open = false;
							}}
						>
							Cancel
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</form>
</Modal>
