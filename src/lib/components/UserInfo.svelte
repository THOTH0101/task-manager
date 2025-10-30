<script lang="ts">
	import { BGS, getInitials } from '$lib';
	import { Avatar, Tooltip } from 'flowbite-svelte';

	let { team } = $props();
</script>

<div class="flex">
	{#each team as user, index}
		<Avatar
			data-name={user.name}
			class={'cursor-pointer text-stone-50 ' + BGS[index % BGS?.length]}
			stacked
		>
			<span>{getInitials(user?.name)}</span>
		</Avatar>
		<Tooltip
			trigger="click"
			arrow={false}
			type="light"
			placement="bottom"
			class="absolute mt-3 w-90 max-w-sm rounded-2xl bg-stone-100 px-4 shadow-sm sm:px-0"
		>
			<div class="flex items-center gap-4 p-4">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-stone-50"
				>
					<span>{getInitials(user?.name)}</span>
				</div>
				<div class="flex flex-col gap-y-1">
					<p class="text-xl font-bold text-stone-950">{user.name}</p>
					<span class="text-base text-stone-500">{user.title}</span>
					<span class="text-base text-blue-500">{user.email}</span>
				</div>
			</div>
		</Tooltip>
	{/each}
</div>
