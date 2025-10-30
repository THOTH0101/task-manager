<script>
	import { openSidebar } from '$lib/store/store';
	import { BarsOutline, SearchOutline } from 'flowbite-svelte-icons';
	import NotificationPanel from './NotificationPanel.svelte';
	import UserAvatar from './UserAvatar.svelte';

	const toggleSidebar = () => {
		openSidebar.update((isOpen) => !isOpen);
	};
</script>

<nav class="sticky top-0 z-30 flex items-center justify-between bg-stone-200 px-4 py-3">
	<div class="flex gap-4">
		<button on:click={toggleSidebar} class="p-2 text-2xl text-stone-500 lg:hidden">
			<BarsOutline class="h-6 w-6 shrink-0" />
		</button>

		<div
			class="flex w-60 items-center gap-2 rounded-full bg-stone-100 px-2 py-1 shadow 2xl:w-[300px]"
		>
			<SearchOutline class="h-6 w-6 shrink-0 text-stone-500" />
			<input
				type="text"
				placeholder="Search...."
				class="flex-1 border-0 bg-transparent text-stone-800 outline-none placeholder:text-stone-500"
			/>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<NotificationPanel />
		<UserAvatar />
	</div>
</nav>
