<script lang="ts">
	import { summary } from '../../../assets/data';
	import Chart from '$lib/components/Chart.svelte';
	import TaskTable from '$lib/components/TaskTable.svelte';
	import UserTable from '$lib/components/UserTable.svelte';
	import {
		CheckCircleOutline,
		EditOutline,
		NewspaperOutline,
		OrderedListOutline
	} from 'flowbite-svelte-icons';
	import { Card } from 'flowbite-svelte';

	const totals = summary.tasks;

	const stats = [
		{
			_id: '1',
			label: 'TOTAL TASKS',
			total: summary.totalTasks || 0,
			icon: NewspaperOutline,
			bg: 'bg-[#1d4ed8]'
		},
		{
			_id: '2',
			label: 'COMPLETED TASKS',
			total: totals['completed'] || 0,
			icon: CheckCircleOutline,
			bg: 'bg-[#0f766e]'
		},
		{
			_id: '3',
			label: 'TASKS IN PROGRESS',
			total: totals['in progress'] || 0,
			icon: EditOutline,
			bg: 'bg-[#f59e0b]'
		},
		{
			_id: '4',
			label: 'TODOS',
			total: totals['todo'] || 0,
			icon: OrderedListOutline,
			bg: 'bg-[#be185d]'
		}
	];
</script>

<div class="h-full py-4">
	<div class="grid grid-cols-1 gap-5 md:grid-cols-4">
		{#each stats as { icon: Icon, bg, label, total }}
			<Card class="bg-stone-200 p-5 shadow-md">
				<div class="flex items-center justify-between">
					<div class="flex h-full flex-1 flex-col justify-between">
						<p class="text-base text-stone-600">{label}</p>
						<span class="text-2xl font-semibold">{total}</span>
						<span class="text-sm text-stone-400">{'110 last month'}</span>
					</div>

					<div class="flex h-10 w-10 items-center justify-center rounded-full text-stone-50 {bg}">
						<Icon class="h-6 w-6 shrink-0" />
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<div class="my-16 w-full rounded bg-stone-200 p-4 shadow-sm">
		<h4 class="text-xl font-semibold text-stone-600">Chart by Priority</h4>
		<Chart />
	</div>

	<div class="flex w-full flex-col gap-4 py-8 md:flex-row 2xl:gap-10">
		<!-- left -->
		<TaskTable tasks={summary.last10Task} />
		<!-- right -->
		<UserTable users={summary.users} />
	</div>
</div>
