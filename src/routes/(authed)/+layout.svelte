<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';

	import {
		ListOutline,
		ObjectsColumnOutline,
		TrashBinSolid,
		UsersGroupSolid
	} from 'flowbite-svelte-icons';

	let { data, children } = $props();

	let links = $state([
		{
			label: 'Dashboard',
			icon_src: ObjectsColumnOutline,
			path: '/dashboard'
		},
		{
			label: 'Tasks',
			icon_src: ListOutline,
			path: '/tasks'
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

		<div class="flex min-h-screen flex-col lg:ml-[14%]">
			<Navbar />
			<div class="flex flex-1">
				<div class="flex-1 bg-stone-100 p-6">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
</main>
