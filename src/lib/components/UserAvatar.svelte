<script lang="ts">
	import { getInitials } from '$lib';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { scale } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import {
		ArrowRightToBracketOutline,
		LockOutline,
		UserCircleOutline
	} from 'flowbite-svelte-icons';

	let isOpen = $state(false);

	type UserContext = { user: { name: string } };

	const { user } = getContext<UserContext>('user');
</script>

<div class="relative inline-block text-left">
	<button
		id="user-menu"
		class="h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 2xl:h-12 2xl:w-12"
	>
		<span class="font-semibold text-stone-50">{user ? getInitials(user.name) : 'User'}</span>
	</button>

	<Dropdown
		bind:isOpen
		transition={scale}
		arrow={false}
		simple
		triggeredBy="#user-menu"
		trigger="click"
		class="absolute right-0 mt-2 w-56 origin-top-right divide-stone-100 rounded-md bg-stone-50 shadow-2xl ring-1 ring-black/5 focus:outline-none"
	>
		<div class="p-4">
			<DropdownItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-base text-stone-700 hover:underline"
			>
				<UserCircleOutline class="mr-2 h-7 w-7 shrink-0" />
				Profile
			</DropdownItem>
			<DropdownItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-base text-stone-700 hover:underline"
			>
				<LockOutline class="mr-2 h-7 w-7 shrink-0" />
				Change Password
			</DropdownItem>
			<DropdownItem
				class="w-full cursor-pointer rounded-md px-2 py-2 text-base text-red-500 hover:underline"
			>
				<form
					method="POST"
					action="/logout"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								toast.success('Logged out successfully');
								goto('/login');
								isOpen = false;
								await update();
							}
						};
					}}
				>
					<button class="flex items-center">
						<ArrowRightToBracketOutline class="mr-2 h-7 w-7 shrink-0" />
						Logout
					</button>
				</form>
			</DropdownItem>
		</div>
	</Dropdown>
</div>
