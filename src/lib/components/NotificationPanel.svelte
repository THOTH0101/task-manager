<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { Notice } from '$lib';
	import { Popover, Spinner } from 'flowbite-svelte';
	import { BellActiveAltOutline, BellOutline, MessageCaptionOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';
	import type { Component } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { scale } from 'svelte/transition';
	import ViewNotification from './ViewNotification.svelte';

	let data = $state<Notice[]>();

	$effect(() => {
		data = page.data?.notices;
	});

	let isOpen = $state(false);
	let open = $state(false);
	let isLoading = $state(false);
	let selected = $state<Notice>();

	const ICONS: Record<string, Component> = {
		alert: BellActiveAltOutline,
		message: MessageCaptionOutline
	};

	const closePopover = () => {
		isOpen = !isOpen;
	};
</script>

<div class="realtive">
	<button id="notif-btn" class="inline-flex cursor-pointer items-center outline-none">
		<div class="relative flex h-8 w-8 items-center justify-center text-stone-800">
			<BellOutline class="h-7 w-7 shrink-0" />
			{#if (data?.length as number) > 0}
				<span
					class="absolute top-0 right-1 rounded-full bg-red-600 px-1 text-xs font-semibold text-stone-50"
					>{data?.length}</span
				>
			{/if}
		</div>
	</button>

	<Popover
		bind:isOpen
		transition={scale}
		arrow={false}
		class="mt-3 flex w-screen max-w-md flex-auto overflow-hidden rounded-lg bg-stone-50 px-4 text-sm leading-6 shadow-lg ring-1 ring-stone-900/5 md:-right-2"
		trigger="click"
		triggeredBy="#notif-btn"
	>
		<div class="justify-center p-2">
			{#if (data?.length as number) > 0}
				{#each data?.slice(0, 5) as item}
					{@const Icons = ICONS[item.notiType.toLowerCase() as string]}
					<div class="group relative flex gap-x-4 rounded-lg p-2 hover:bg-stone-100">
						<div
							class="mt-1 flex h-12 w-24 items-center justify-center rounded-lg bg-stone-200 px-3"
						>
							<Icons class="h-6 w-6 shrink-0 text-stone-600" />
						</div>

						<div>
							<form
								method="POST"
								action="/notice?/readNotice"
								use:enhance={() => {
									open = true;
									selected = item;

									return async ({ update }) => {
										await update({ invalidateAll: true });
									};
								}}
							>
								<input type="hidden" name="id" value={item.id} />
								<button class="cursor-pointer">
									<div class="flex items-center gap-3 font-semibold text-stone-900 capitalize">
										<p>{item.notiType}</p>
										<span class="text-xs font-normal lowercase">
											{moment(item.createdAt).fromNow()}
										</span>
									</div>
									<p class="mt-1 line-clamp-1 px-0 text-start text-stone-600">
										{item.text}
									</p>
								</button>
							</form>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex justify-center py-4">
					<span class="text-stone-500">No Unread notification</span>
				</div>
			{/if}

			<div class="grid grid-cols-2 divide-x divide-stone-900/5 bg-stone-50">
				<button
					class="flex items-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-stone-100"
					onclick={closePopover}
				>
					Cancel
				</button>

				<form
					method="POST"
					action="/notice?/readAllNotice"
					use:enhance={() => {
						isLoading = true;

						return async ({ result, update }) => {
							if (result.type === 'success') {
								isOpen = false;
								toast.success('All notification read.');
							}
							isLoading = false;
							await update();
						};
					}}
				>
					<button
						class="flex items-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-stone-100"
					>
						{#if isLoading}
							<Spinner color="blue" size="4" class="me-1" />
							Loading ...
						{:else}
							Mark as Read
						{/if}
					</button>
				</form>
			</div>
		</div>
	</Popover>
</div>

<ViewNotification bind:open notice={selected} />
