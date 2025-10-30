<script lang="ts">
	import { ICONS, PRIOTITYSTYLES } from '$lib';
	import Prompt from '$lib/components/Prompt.svelte';
	import TaskColor from '$lib/components/TaskColor.svelte';
	import { Button } from 'flowbite-svelte';
	import { RefreshOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	let { data } = $props();

	let type = $state('delete');
	let msg: string | null = $state('');
	let action = $state('');

	let isOpen = $state(false);

	const deleteAllClick = () => {
		type = 'deleteAll';
		msg = 'Do you want to permenantly delete all items?';
		isOpen = true;
		action = '/tasks?/deleteTasks';
	};

	const restoreAllClick = () => {
		type = 'restoreAll';
		msg = 'Do you want to restore all items in the trash?';
		isOpen = true;
		action = '/tasks?/restoreTasks';
	};

	const deleteClick = (id: string) => {
		type = 'delete';
		msg = null;
		isOpen = true;
		action = `/task/${id}?/deleteTask`;
	};

	const restoreClick = (id: string) => {
		type = 'restore';
		msg = 'Do you want to restore the selected item?';
		isOpen = true;
		action = `/task/${id}?/restoreTask`;
	};
</script>

<div class="mb-6 w-full px-0 md:px-1">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-2xl font-semibold capitalize">Trashed Tasks</h2>

		<div class="flex items-center gap-2 md:gap-4">
			<div>
				<Button
					color="light"
					class={'flex flex-row-reverse items-center gap-1 rounded-md  bg-stone-200 text-sm text-stone-950 md:text-base 2xl:py-2.5'}
					onclick={restoreAllClick}
				>
					<RefreshOutline class="hidden text-lg md:flex" />
					Restore All
				</Button>
			</div>

			<div>
				<Button
					color="light"
					class={'flex flex-row-reverse items-center gap-1 rounded-md bg-stone-200 text-sm text-red-600 md:text-base 2xl:py-2.5'}
					onclick={deleteAllClick}
				>
					<TrashBinOutline class="hidden text-lg md:flex" />
					Delete All
				</Button>
			</div>
		</div>
	</div>
	{#if data.tasks.length > 0}
		<div class="rounded bg-stone-200 px-2 py-4 shadow-md md:px-6">
			<div class="overflow-x-auto">
				<table class="mb-5 w-full">
					<thead class="border-b border-stone-300">
						<tr class="text-left text-black">
							<th class="py-2">Task Title</th>
							<th class="py-2">Priority</th>
							<th class="py-2">Stage</th>
							<th class="line-clamp-1 py-2">Modified On</th>
						</tr>
					</thead>
					<tbody>
						{#each data.tasks as task}
							{@const Icon = ICONS[task?.priority]}
							<tr class="border-b border-stone-200 text-stone-600 hover:bg-stone-400/10">
								<td class="py-2">
									<div class="flex items-center gap-2">
										<TaskColor {task} />
										<p class="line-clamp-2 w-full text-base text-black">
											{task?.title}
										</p>
									</div>
								</td>

								<td class="py-2 capitalize">
									<div class={'flex items-center gap-1'}>
										<span class={'text-lg ' + PRIOTITYSTYLES[task?.priority]}>
											<Icon class="h-6 w-6 shrink-0" />
										</span>
										<span class="">{task?.priority}</span>
									</div>
								</td>

								<td class="py-2 text-center capitalize md:text-start">
									{task?.stage}
								</td>
								<td class="py-2 text-sm">{new Date(task?.date).toDateString()}</td>

								<td class="flex justify-end gap-1 py-2">
									<Button
										color="light"
										class="text-stone-500"
										onclick={() => restoreClick(task.id)}
									>
										<RefreshOutline class="hidden text-lg md:flex" />
										Restore
									</Button>
									<Button color="light" class="text-red-600" onclick={() => deleteClick(task.id)}>
										<TrashBinOutline class="hidden text-lg md:flex" />
										Delete
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<div class="flex justify-center py-4">
			<span class="text-stone-500">No Task Found</span>
		</div>
	{/if}
</div>

<Prompt {msg} bind:open={isOpen} {type} {action} />
