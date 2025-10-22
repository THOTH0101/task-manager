<script lang="ts">
	import moment from 'moment';
	import { getInitials } from '$lib';

	let { users } = $props();
</script>

<div class="h-fit w-full rounded bg-stone-200 px-2 py-4 shadow-md md:w-1/3 md:px-6">
	<table class="mb-5 w-full">
		<thead class="border-b border-stone-300">
			<tr class="text-left text-black">
				<th class="py-2">Full Name</th>
				<th class="py-2">Status</th>
				<th class="hidden py-2 md:block">Created At</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user}
				<tr class="border-b border-stone-200 text-stone-600 hover:bg-stone-400/10">
					<td class="py-2">
						<div class="flex items-center gap-3">
							<div
								class="flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-sm text-stone-50"
							>
								<span class="text-center">{getInitials(user?.name)}</span>
							</div>
							<div>
								<p>{user.name}</p>
								<span class="text-sm text-stone-950">{user?.name}</span>
							</div>
						</div>
					</td>
					<td>
						<p
							class={'w-fit rounded-full px-3 py-1 text-sm ' +
								(user?.isActive ? 'bg-blue-400' : 'bg-yellow-100')}
						>
							{user.isActive ? 'Active' : 'Disabled'}
						</p>
					</td>
					<td class="py-2 text-sm">{moment(user?.createdAt).fromNow()}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
