<script lang="ts">
	import Chart from '$lib/components/Chart.svelte';
	import TaskTable from '$lib/components/TaskTable.svelte';
	import UserTable from '$lib/components/UserTable.svelte';
	import { Card } from 'flowbite-svelte';
	import {
		CheckCircleOutline,
		EditOutline,
		NewspaperOutline,
		OrderedListOutline
	} from 'flowbite-svelte-icons';

	let { data } = $props();
	const totals = {
		todo: data.tasks?.filter((task) => task.stage === 'todo')?.length as number,
		'in progress': data.tasks?.filter((task) => task.stage === 'in_progress')?.length as number,
		completed: data.tasks?.filter((task) => task.stage === 'completed')?.length as number
	};

	const chartData = [
		{
			name: 'High',
			total: data.tasks?.filter((task) => task.priority === 'high')?.length as number
		},
		{
			name: 'Medium',
			total: data.tasks?.filter((task) => task.priority === 'medium')?.length as number
		},
		{
			name: 'Normal',
			total: data.tasks?.filter((task) => task.priority === 'normal')?.length as number
		},
		{
			name: 'Low',
			total: data.tasks?.filter((task) => task.priority === 'low')?.length as number
		}
	];

	const stats = [
		{
			_id: '1',
			label: 'TOTAL TASKS',
			total: data.tasks?.length || 0,
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
		<Chart {chartData} />
	</div>

	<div class="flex w-full flex-col gap-4 py-8 md:flex-row 2xl:gap-10">
		<!-- left -->
		<TaskTable tasks={data.tasks?.slice(0, 10)} />
		<!-- right -->
		<UserTable users={data.users?.slice(0, 10)} />
	</div>
</div>
