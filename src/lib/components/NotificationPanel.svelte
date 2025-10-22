<script lang="ts">
	import { Popover } from 'flowbite-svelte';
	import { BellActiveAltOutline, BellOutline, MessageCaptionOutline } from 'flowbite-svelte-icons';
	import type { Component } from 'svelte';
	import { scale } from 'svelte/transition';

	let data: {
		id: string;
		team: string[];
		text: string;
		task: object;
		notiType: string;
		isRead: [];
		createdAt: string;
	}[] = [
		{
			id: '1',
			team: ['3'],
			text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi neque corrupti itaque officiis distinctio voluptatibus beatae consequuntur aliquam fugit eveniet!',
			task: {
				id: '1',
				title: 'New Task'
			},
			notiType: 'alert',
			isRead: [],
			createdAt: '2025-04-02'
		},
		{
			id: '1',
			team: ['3'],
			text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi neque corrupti itaque officiis distinctio voluptatibus beatae consequuntur aliquam fugit eveniet!',
			task: {
				id: '1',
				title: 'New Task'
			},
			notiType: 'alert',
			isRead: [],
			createdAt: '2025-04-02'
		}
	];

	const readHandler = (type: string, id: string) => {};
	const viewHandler = (item: any) => {};
	let isOpen = $state(false);

	const ICONS: Record<string, Component> = {
		alert: BellActiveAltOutline,
		message: MessageCaptionOutline
	};

	const callsToAction = [
		{ name: 'Cancel', href: '#', icon: '' },
		{ name: 'Mark as Read', href: '#', icon: '', onClick: () => readHandler('all', '') }
	];

	const closePopover = () => {
		isOpen = !isOpen;
	};
</script>

<div class="realtive">
	<button id="notif-btn" class="inline-flex cursor-pointer items-center outline-none">
		<div class="relative flex h-8 w-8 items-center justify-center text-stone-800">
			<BellOutline class="h-7 w-7 shrink-0" />
			{#if data?.length > 0}
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
		class="absolute -right-14 z-10 mt-3 flex w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-stone-50 px-4 text-sm leading-6 shadow-lg ring-1 ring-stone-900/5 md:-right-2"
		trigger="click"
		triggeredBy="#notif-btn"
	>
		<div class="p-2">
			{#each data.slice(0, 5) as item, index}
				{@const Icons = ICONS[item.notiType]}
				<div
					id={item.id + index}
					class="group relative flex gap-x-4 rounded-lg p-2 hover:bg-stone-100"
				>
					<div class="mt-1 flex h-12 w-24 items-center justify-center rounded-lg bg-stone-200 px-3">
						<Icons class="h-6 w-6 shrink-0 text-stone-600" />
					</div>

					<div>
						<button class="cursor-pointer" onclick={() => viewHandler(item)}>
							<div class="flex items-center gap-3 font-semibold text-stone-900 capitalize">
								<p>{item.notiType}</p>
								<span class="text-xs font-normal lowercase">
									{item.createdAt}
								</span>
							</div>
							<p class="mt-1 line-clamp-1 px-0 text-start text-stone-600">
								{item.text}
							</p>
						</button>
					</div>
				</div>
			{/each}

			<div class="grid grid-cols-2 divide-x divide-stone-900/5 bg-stone-50">
				{#each callsToAction as action}
					<a
						id={action.name}
						href={action.href}
						class="flex items-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-stone-100"
						onclick={action.onClick ? action.onClick : closePopover}>{action.name}</a
					>
				{/each}
			</div>
		</div>
	</Popover>
</div>
