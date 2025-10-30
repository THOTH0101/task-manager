<script lang="ts">
	import { BG_STYLES, formatDate, PRIOTITYSTYLES, TASK_STYLES, TASK_TYPE, type Task } from '$lib';
	import AddSubTask from '$lib/components/AddSubTask.svelte';
	import AddTask from '$lib/components/AddTask.svelte';
	import TaskDialog from '$lib/components/TaskDialog.svelte';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { Card } from 'flowbite-svelte';
	import {
		ListOutline,
		MessageCaptionOutline,
		PaperClipOutline,
		PlusOutline
	} from 'flowbite-svelte-icons';

	let { data } = $props();

	let boardData = $state<{ title: string; tasks: Task[] }[]>();

	$effect(() => {
		const todoTasks = data.tasks.filter((task) => task.stage === 'todo');
		const inProgressTasks = data.tasks.filter((task) => task.stage === 'in_progress');
		const completedTasks = data.tasks.filter((task) => task.stage === 'completed');

		boardData = [
			{
				title: 'todo',
				tasks: todoTasks
			},
			{
				title: 'in progress',
				tasks: inProgressTasks
			},
			{
				title: 'completed',
				tasks: completedTasks
			}
		];
	});

	let openTask = $state(false);
	let openSubTask = $state(false);
</script>

<div class="mb-6 min-h-screen px-0 md:px-1">
	<h1 class="mb-6 text-3xl font-bold text-stone-900">Tasks</h1>

	<div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
		{#each boardData as { title, tasks }}
			<div
				class="min-h-[300px] w-full flex-1 rounded-3xl bg-stone-200 p-2 shadow-sm first:ml-0 last:mr-0 md:mx-2"
			>
				<div
					class={'mb-4 flex items-center justify-between rounded-full p-2 text-xl font-semibold text-stone-900 ' +
						TASK_TYPE[title]}
				>
					<p class="item-center flex gap-2">
						<span
							class={'rounded-3xl bg-stone-100 px-4 py-2 text-sm font-medium ' + TASK_STYLES[title]}
						>
							{tasks.length}
						</span>
						<span class="text-stone-50">{title}</span>
					</p>
					<button class="cursor-pointer text-stone-100" onclick={() => (openTask = true)}>
						<PlusOutline class="m-0 h-6 w-6 p-0" />
					</button>
				</div>

				<div class="space-y-4">
					{#if tasks.length > 0}
						{#each tasks as task (task.id)}
							<Card
								size="lg"
								class="mb-4 gap-y-3 rounded-3xl bg-stone-100 p-4 transition-shadow duration-200 hover:shadow-lg"
							>
								<div class="flex w-full justify-between">
									<div
										class={`flex flex-1 items-center gap-1 text-sm font-medium ${PRIOTITYSTYLES[task?.priority]}`}
									>
										<span class={'rounded-full px-2 py-1 uppercase ' + BG_STYLES[task.priority]}
											>{task?.priority} Priority</span
										>
									</div>

									<TaskDialog {task} />
								</div>

								<div class="flex items-center gap-2">
									<h5 class="text-lg font-bold tracking-tight text-stone-600">
										{task.title}
									</h5>
								</div>
								<span class="text-sm text-stone-600">{formatDate(new Date(task?.date))}</span>

								<div class="mb-2 flex items-center justify-between border-b border-stone-300">
									<div class="flex items-center gap-3">
										<div class="flex cursor-pointer items-center gap-1 text-stone-600">
											<MessageCaptionOutline class="h-6 w-6 shrink-0" />
											<span>{task?.activities?.length}</span>
										</div>
										<div class="flex cursor-pointer items-center gap-1 text-stone-600">
											<PaperClipOutline class="h-6 w-6 shrink-0" />
											<span>{task?.assets?.length}</span>
										</div>
										<div class="flex cursor-pointer items-center gap-1 text-stone-600">
											<ListOutline class="h-6 w-6 shrink-0" />
											<span>0/{task?.subTasks?.length}</span>
										</div>
									</div>

									<UserInfo team={task?.team} />
								</div>

								<div>
									<!-- Sub-tasks -->
									{#if task.subTasks.length > 0}
										{#each task?.subTasks as { title, tag, date }}
											<div
												class="mt-2 flex items-center justify-between rounded-3xl border border-stone-300 px-2 py-4 shadow-sm hover:shadow-md"
											>
												<h5 class="line-clamp-1 text-base text-stone-950">
													{title}
												</h5>

												<div class="flex-col">
													<span
														class="line-clamp-1 w-full rounded-full bg-blue-600/10 px-3 py-1 font-medium text-blue-700"
													>
														{tag}
													</span>
													<span class="flex w-full justify-center text-sm text-stone-600"
														>{formatDate(new Date(date))}</span
													>
												</div>
											</div>
										{/each}
									{:else}
										<div class="flex justify-center py-4">
											<span class="text-stone-500">No Sub Task</span>
										</div>
									{/if}
								</div>

								<button
									class="flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-stone-500 disabled:cursor-not-allowed disabled:text-stone-300"
									onclick={() => (openSubTask = true)}
								>
									<PlusOutline class="m-0 flex h-6 w-6 p-0" />
									<span>ADD SUBTASK</span>
								</button>
							</Card>
						{/each}
					{:else}
						<div class="flex justify-center border-t border-stone-300 py-4">
							<span class="text-stone-500">No Task Found</span>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<AddTask bind:open={openTask} />
<AddSubTask bind:open={openSubTask} />
