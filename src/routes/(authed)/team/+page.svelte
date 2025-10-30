<script lang="ts">
	import { getInitials } from '$lib';
	import AddUser from '$lib/components/AddUser.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import UserAction from '$lib/components/UserAction.svelte';
	import { currentTeam } from '$lib/store/store.js';
	import {
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { EditOutline, PlusOutline, TrashBinOutline } from 'flowbite-svelte-icons';

	const { data } = $props();

	$effect(() => {
		$currentTeam = data.team?.filter((user) => user.isActive);
	});

	let defaultModal = $state(false);
	let popupModal = $state(false);
	let userModal = $state(false);

	let selected = $state('');
	let selectedUser: object | undefined = $state({});

	const editClick = (user: { name: string; title: string; role: string; email: string }) => {
		selectedUser = user;
		defaultModal = true;
	};

	const userAction = (user: { email: string; isActive: boolean }) => {
		selectedUser = user;
		userModal = true;
	};

	const deleteClick = (userId: string) => {
		selected = userId;
		popupModal = true;
	};
</script>

<div class="mb-6 w-full px-0 md:px-1">
	<div class="mb-8 flex items-center justify-between">
		<h2 class="text-2xl font-semibold capitalize">team members</h2>

		<Button
			onclick={() => {
				defaultModal = true;
				selectedUser = undefined;
			}}
			color="blue"
			class="mb-8 flex cursor-pointer flex-row-reverse items-center justify-between gap-1 rounded-md bg-blue-600 text-stone-50 2xl:py-2.5"
		>
			<PlusOutline class="h-6 w-6 shrink-0" />
			<span>Create New User</span>
		</Button>
	</div>
	<Table hoverable={true} shadow border={false}>
		<TableHead>
			<TableHeadCell>Full Name</TableHeadCell>
			<TableHeadCell>Title</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Role</TableHeadCell>
			<TableHeadCell>Active</TableHeadCell>
			<TableHeadCell>Action</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each data.team as { name, title, role, isActive, id, email }}
				<TableBodyRow>
					<TableBodyCell>
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm text-stone-50"
							>
								<span class="text-center text-xs md:text-sm">{getInitials(name)}</span>
							</div>
							<span>{name}</span>
						</div>
					</TableBodyCell>

					<TableBodyCell>{title}</TableBodyCell>
					<TableBodyCell>{email || 'user.emal.com'}</TableBodyCell>
					<TableBodyCell>{role}</TableBodyCell>

					<TableBodyCell>
						<button
							class={'w-fit cursor-pointer rounded-full px-4 py-1 ' +
								(isActive ? 'bg-blue-200' : 'bg-yellow-100')}
							onclick={() => userAction({ email, isActive: !isActive })}
						>
							{isActive ? 'Active' : 'Disabled'}
						</button>
					</TableBodyCell>

					<TableBodyCell>
						<Button
							type="button"
							size="sm"
							class="cursor-pointer"
							onclick={() => editClick({ name, title, role, email })}
						>
							<EditOutline class="me-2 h-4 w-4" />
							Edit user
						</Button>

						<Button
							type="submit"
							size="sm"
							color="red"
							class="cursor-pointer"
							onclick={() => deleteClick(id)}
						>
							<TrashBinOutline class="me-2 h-4 w-4" />
							Delete user
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<AddUser bind:open={defaultModal} user={selectedUser} />
<Prompt action={'/team?/deleteUser'} userId={selected} bind:open={popupModal} />
<UserAction bind:open={userModal} user={selectedUser} />
