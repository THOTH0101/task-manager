<script lang="ts">
	import { page } from '$app/state';
	import { openSidebar } from '$lib/store/store';
	import { CloseOutline, CogSolid, CubeSolid } from 'flowbite-svelte-icons';

	let { links } = $props();

	let isOpen: boolean = $state(false);

	openSidebar.subscribe((value) => {
		isOpen = value;
	});

	const closeSidebar = () => {
		openSidebar.set(false);
	};
</script>

<!-- Overlay for mobile -->
<div
	class={'fixed inset-0 z-40 bg-black p-4 transition-opacity duration-300 lg:hidden ' + isOpen
		? 'block'
		: 'hidden'}
></div>
<!-- Sidebar drawer -->
<aside
	class={'fixed top-0 left-0 z-50 h-full w-64 transform bg-stone-200 p-4 transition-transform duration-300 ease-in-out lg:block lg:w-1/7 lg:translate-x-0 ' +
		(isOpen ? 'translate-x-0' : '-translate-x-full')}
>
	<div class="flex h-full flex-col">
		<div class="flex items-center justify-between">
			<h1 class="item-center flex gap-1">
				<span class="p-2 text-2xl font-bold text-blue-800">TaskFlow</span>
			</h1>

			{#if isOpen}
				<button onclick={closeSidebar} class="lg:hidden">
					<CloseOutline class="h-6 w-6 shrink-0" />
				</button>
			{/if}
		</div>

		<div class="flex flex-1 flex-col gap-y-5 py-8">
			{#each links as link}
				<a
					class={'flex w-full items-center gap-2 rounded-full px-3 py-2 text-base hover:bg-[#2564ed2d] lg:w-7/8 ' +
						(page.url.pathname === link.path ? 'bg-blue-700 text-stone-200' : 'text-stone-700')}
					href={link.path}
					onclick={closeSidebar}
				>
					<link.icon_src class="h-6 w-6 shrink-0" />
					<span class="hover:text-[#2564ed]">{link.label}</span>
				</a>
			{/each}
		</div>
		<button
			class="bottom-0 flex w-full cursor-pointer items-center gap-2 p-2 text-lg text-stone-800"
		>
			<CogSolid class="h-6 w-6 shrink-0" />
			<span>Settings</span>
		</button>
	</div>
</aside>
