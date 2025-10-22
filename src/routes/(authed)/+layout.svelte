<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount, setContext } from 'svelte';
	import {
		CheckCircleOutline,
		ClipboardListOutline,
		ClockOutline,
		GridOutline,
		ListOutline,
		TrashBinSolid,
		UsersGroupSolid
	} from 'flowbite-svelte-icons';

	let { data, children } = $props();

	setContext('user', data);

	let links = $state([
		{
			label: 'Dashboard',
			icon_src: GridOutline,
			path: '/dashboard'
		},
		{
			label: 'Tasks',
			icon_src: ListOutline,
			path: '/tasks'
		},
		{
			label: 'Completed',
			icon_src: CheckCircleOutline,
			path: '/completed'
		},
		{
			label: 'In Progress',
			icon_src: ClockOutline,
			path: '/in-progress'
		},
		{
			label: 'To Do',
			icon_src: ClipboardListOutline,
			path: '/to-do'
		},
		{
			label: 'Team',
			icon_src: UsersGroupSolid,
			path: '/team'
		},
		{
			label: 'Trash',
			icon_src: TrashBinSolid,
			path: '/trash'
		}
	]);

	onMount(() => {
		if (!data.user?.isAdmin) {
			links = links.filter((link) => link.label !== 'Team');
		}
	});
</script>

<main>
	<div>
		<Sidebar {links} />

		<div class="flex min-h-screen flex-col lg:ml-[20%]">
			<Navbar />
			<div class="flex flex-1">
				<div class="flex-1 bg-stone-100 p-6">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
</main>
