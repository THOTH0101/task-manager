<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Dropdown, DropdownDivider, DropdownItem, Spinner } from 'flowbite-svelte';
	import {
		DotsHorizontalOutline,
		EditOutline,
		FolderOpenOutline,
		PlusOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';
	import AddSubTask from './AddSubTask.svelte';
	import AddTask from './AddTask.svelte';
	import type { Task } from '$lib';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	const { task } = $props();

	let isOpen = $state(false);
	let openTask = $state(false);
	let openSubtask = $state(false);
	let selectedTask = $state<Task>();

	let isLoading = $state(false);

	let items = $state([
		{
			label: 'Open Task',
			icon: FolderOpenOutline,
			className: 'mr-2 h-5 w-5',
			onClick: () => goto(`task/${task.id}`)
		},
		{
			label: 'Edit',
			icon: EditOutline,
			className: 'mr-2 h-5 w-5',
			onClick: () => {
				openTask = true;
				selectedTask = task;
			}
		},
		{
			label: 'Add Sub-Task',
			icon: PlusOutline,
			className: 'mr-2 h-5 w-5',
			onClick: () => (openSubtask = true)
		}
	]);

	onMount(() => {
		if (page.data?.user?.isAdmin === false) {
			items = items.filter((item) => item.label !== 'Edit');
		}
	});
</script>

<div class="relative inline-block p-2 text-left">
	<button
		class="inline-flex w-full cursor-pointer justify-center rounded-md text-sm font-medium text-stone-400"
	>
		<DotsHorizontalOutline class="h-6 w-6 shrink-0" />
	</button>

	<Dropdown bind:isOpen simple class="relative inline-block px-2 py-1 text-left">
		{#each items as { onClick, className, icon: Icon, label }}
			<DropdownItem
				onclick={onClick}
				class="group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm hover:bg-blue-400 hover:text-stone-50"
			>
				<Icon class={className} />
				{label}
			</DropdownItem>
		{/each}

		<DropdownDivider />
		<form
			action={`/task/${task.id}?/trashTask`}
			method="POST"
			use:enhance={() => {
				isLoading = true;

				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success(result.data?.message as string);
					}
					isOpen = false;
					isLoading = false;
					await update({ reset: true });
				};
			}}
		>
			<DropdownItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm text-red-400 hover:bg-blue-400 hover:text-stone-50"
			>
				<button class="flex cursor-pointer items-center">
					{#if isLoading}
						<Spinner color="red" size="4" class="me-1" />
						Loading ...
					{:else}
						<TrashBinOutline class="h-6 w-6 shrink-0" />
						Delete
					{/if}
				</button>
			</DropdownItem>
		</form>
	</Dropdown>
</div>

<AddTask bind:open={openTask} task={selectedTask} />
<AddSubTask bind:open={openSubtask} {task} />
