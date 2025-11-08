<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { getInitials } from '$lib';
	import { Dropdown, DropdownItem, Spinner } from 'flowbite-svelte';
	import { toast } from 'svelte-sonner';
	import { scale } from 'svelte/transition';

	import {
		ArrowRightToBracketOutline,
		LockOutline,
		UserCircleOutline
	} from 'flowbite-svelte-icons';
	import ChangePassword from './ChangePassword.svelte';
	import EditProfile from './EditProfile.svelte';
	import { page } from '$app/state';

	type User = {
		id: string;
		email: string;
		name: string;
		title: string;
		role: string;
		isAdmin: boolean;
		isActive: boolean;
	};

	let open = $state(false);
	let isOpen = $state(false);
	let isLoading = $state(false);
	let userModal = $state(false);

	let user = $state<User>();
	let selectedUser = $state<User>();

	// keep user in sync with page data
	$effect(() => {
		user = page.data.user;
		selectedUser;
	});
</script>

<div class="relative inline-block text-left">
	<button
		id="user-menu"
		class="h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 2xl:h-12 2xl:w-12"
	>
		<span class="font-semibold text-stone-50">{user ? getInitials(user?.name) : 'User'}</span>
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
				onclick={() => {
					userModal = true;
					selectedUser = user;
				}}
			>
				<UserCircleOutline class="mr-2 h-7 w-7 shrink-0" />
				Profile
			</DropdownItem>

			<DropdownItem
				class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-base text-stone-700 hover:underline"
				onclick={() => (open = true)}
			>
				<LockOutline class="mr-2 h-7 w-7 shrink-0" />
				Change Password
			</DropdownItem>

			<form
				method="POST"
				action="/logout?"
				use:enhance={() => {
					isLoading = true;
					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success('Logged out successfully');
							isLoading = false;
							isOpen = false;
							await update();

							goto('/login');
						}
					};
				}}
			>
				<DropdownItem
					class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-base text-red-500 hover:underline"
				>
					<button class="flex cursor-pointer">
						{#if isLoading}
							<Spinner color="red" size="4" class="me-1" />
							Loading ...
						{:else}
							<ArrowRightToBracketOutline class="mr-2 h-7 w-7 shrink-0" />
							Logout
						{/if}
					</button>
				</DropdownItem>
			</form>
		</div>
	</Dropdown>
</div>

<ChangePassword bind:open email={user?.email} />
<EditProfile bind:open={userModal} user={selectedUser} />
