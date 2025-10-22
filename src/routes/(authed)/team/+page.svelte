<script lang="ts">
	import AddUser from '$lib/components/AddUser.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import UserAction from '$lib/components/UserAction.svelte';
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	const { data } = $props();

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
	<div class="rounded bg-stone-200 px-2 py-4 shadow-md md:px-4">
		<div class="overflow-x-auto">
			<table class="mb-5 w-full">
				<thead class="border-b border-stone-300">
					<tr class="text-left text-stone-950">
						<th class="py-2">Full Name</th>
						<th class="py-2">Title</th>
						<th class="py-2">Email</th>
						<th class="py-2">Role</th>
						<th class="py-2">Active</th>
					</tr>
				</thead>
				<tbody>
					{#each data.team as { name, title, role, isActive, id, email }}
						<tr class="border-b border-stone-200 text-stone-600 hover:bg-stone-400/10"
							><td class="p-2">
								<div class="flex items-center gap-3">
									<div
										class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm text-stone-50"
									>
										<!-- <span class="text-center text-xs md:text-sm">{getInitials(user.name)}</span> -->
									</div>
								</div>
							</td>

							<td class="p-2">{title}</td>
							<td class="p-2">{email || 'user.emal.com'}</td>
							<td class="p-2">{role}</td>

							<td>
								<button
									class={'w-fit cursor-pointer rounded-full px-4 py-1 ' +
										(isActive ? 'bg-blue-200' : 'bg-yellow-100')}
									onclick={() => userAction({ email, isActive: !isActive })}
								>
									{isActive ? 'Active' : 'Disabled'}
								</button>
							</td>

							<td class="flex justify-end gap-4 p-2">
								<Button
									type="button"
									outline
									color="blue"
									class="cursor-pointer"
									onclick={() => editClick({ name, title, role, email })}
								>
									Edit
								</Button>

								<Button
									type="submit"
									outline
									color="red"
									class="cursor-pointer"
									onclick={() => deleteClick(id)}
								>
									Delete
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<AddUser bind:open={defaultModal} user={selectedUser} />
<Prompt action={'/team?/deleteUser'} userId={selected} bind:open={popupModal} />
<UserAction bind:open={userModal} user={selectedUser} />
