<script lang="ts">
	import { getInitials } from '$lib';
	import { Popover } from 'flowbite-svelte';

	let { user } = $props();

	let isOpen = $state(false);

	const toggle = () => {
		isOpen = !isOpen;
	};
</script>

<div class="px-4">
	<div class="relative">
		<button onclick={toggle} class="group inline-flex items-center outline-none">
			<span>{getInitials(user?.name)}</span>
		</button>
		<Popover
			bind:isOpen
			arrow={false}
			trigger="click"
			placement="top"
			class="transform-x-1/2 absolute left-1/2 z-10 mt-3 w-90 max-w-sm -translate-x-1/2 transform rounded-lg bg-stone-50 px-4 shadow-lg sm:px-0"
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
		</Popover>
	</div>
</div>
