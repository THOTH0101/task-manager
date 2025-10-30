<script lang="ts">
	import { ICONS, PRIOTITYSTYLES } from '$lib';
	import moment from 'moment';
	import TaskColor from './TaskColor.svelte';
	import UserInfo from './UserInfo.svelte';
	let { tasks } = $props();
</script>

<div class="w-full rounded bg-stone-200 px-2 pt-4 pb-4 shadow-md md:w-2/3 md:px-4">
	<table class="w-full">
		<thead class="border-b border-stone-300">
			<tr class="text-left text-black">
				<th class="py-2">Task Title</th>
				<th class="py-2">Priority</th>
				<th class="py-2">Team</th>
				<th class="hidden py-2 md:block">Created At</th>
			</tr>
		</thead>
		<tbody>
			{#each tasks as task}
				{@const Icon = ICONS[task.priority]}
				<tr class="border-b border-stone-300 text-stone-600 hover:bg-stone-300/10">
					<td class="py-2">
						<div class="flex items-center gap-2">
							<TaskColor {task} />
							<p class="text-base text-black">{task.title}</p>
						</div>
					</td>
					<td class="py-2">
						<div class="flex items-center gap-1">
							<span class={'text-lg ' + PRIOTITYSTYLES[task.priority]}>
								<Icon class="h-6 w-6 shrink-0" />
							</span>
							<span class="capitalise">{task.priority}</span>
						</div>
					</td>
					<td class="py-2">
						<UserInfo team={task?.team} />
					</td>
					<td>
						<span>{moment(task.date).fromNow()}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
