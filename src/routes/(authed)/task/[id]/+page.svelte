<script lang="ts">
	import { getInitials, ICONS, PRIOTITYSTYLES } from '$lib';
	import TaskColor from '$lib/components/TaskColor.svelte';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import {
		BugOutline,
		CheckCircleOutline,
		ClockArrowOutline,
		ClockOutline,
		ListOutline,
		MessagesOutline,
		ThumbsUpOutline,
		UserOutline
	} from 'flowbite-svelte-icons';
	import moment from 'moment';

	let { data } = $props();

	const bgColor: any = {
		high: 'bg-red-200',
		medium: 'bg-yellow-200',
		low: 'bg-blue-200'
	};

	const TASKTYPEICON: any = {
		commented: {
			className:
				'w-10 h-10 rounded-full bg-stone-500 flex items-center justify-center text-stone-50',
			icon: MessagesOutline
		},
		started: {
			className:
				'w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-stone-50',
			icon: ThumbsUpOutline,
			size: '20'
		},
		assigned: {
			className: 'w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-stone-50',
			icon: UserOutline,
			size: '14'
		},
		bug: {
			className: 'text-red-600',
			icon: BugOutline,
			size: '24'
		},
		completed: {
			className:
				'w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-stone-50 ',
			icon: CheckCircleOutline,
			size: '24'
		},
		'in progress': {
			className:
				'w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-stone-50',
			icon: ClockOutline,
			size: '16'
		}
	};

	const act_types = ['Started', 'Completed', 'In Progress', 'Commented', 'Bug', 'Assigned'];

	let isLoading = $state(false);
	let selectedAction = $state(act_types[0]);
</script>

<div class="mb-4 flex w-full flex-col gap-3 overflow-y-hidden">
	<h1 class="text-2xl font-bold text-stone-600">{data.task?.title}</h1>

	<Tabs tabStyle="underline">
		<TabItem class="bg-stone-200">
			{#snippet titleSlot()}
				<div class="flex items-center gap-2">
					<ListOutline size="md" />
					Task Detail
				</div>
			{/snippet}
			{@const Icon = ICONS[data.task?.priority]}
			<div class="flex w-full flex-col gap-5 overflow-y-auto p-8 md:flex-row 2xl:gap-8">
				<div class="w-full space-y-8 md:w-1/2">
					<!-- RIGHT -->
					<div class="flex items-center gap-5">
						<div
							class={`flex items-center gap-1 rounded-full px-3 py-1 text-base font-semibold  ${PRIOTITYSTYLES[data.task?.priority]} ${bgColor[data.task?.priority]}`}
						>
							<span class="text-lg"><Icon class="h-6 w-6 shrink-0" /></span>
							<span class="uppercase">{data.task?.priority} priority</span>
						</div>

						<div class="flex items-center gap-2">
							<TaskColor task={data.task} />
							<span class="text-stone-950 uppercase">{data.task?.stage}</span>
						</div>
					</div>

					<p class="text-stone-500">Created At: {new Date(data.task?.date).toDateString()}</p>

					<div class="flex items-center gap-8 border-y border-stone-300 p-4">
						<div class="space-x-2">
							<span class="font-semibold">Assets :</span>
							<span>{data.task?.assets?.length}</span>
						</div>
						<span class="text-stone-400">|</span>
						<div class="space-x-2">
							<span class="font-semibold">Sub-Task :</span>
							<span>{data.task?.subTasks?.length}</span>
						</div>
					</div>

					<div class="space-y-4 py-6">
						<p class="text-sm font-semibold text-stone-600 uppercase">Task Team</p>
						<div class="space-y-3">
							{#each data.task?.team as m}
								<div class="flex items-center gap-4 border-t border-stone-300 py-2">
									<div
										class="-mr-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm text-stone-100"
									>
										<span class="text-center">{getInitials(m?.name)}</span>
									</div>

									<div>
										<p class="text-lg font-semibold">{m?.name}</p>
										<span class="text-stone-500">{m?.title}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
					<div class="space-y-4 py-6">
						<p class="text-sm font-semibold text-stone-500">SUB-TASKS</p>
						<div class="space-y-8">
							{#each data.task?.subTasks as el}
								<div class="flex gap-3">
									<div
										class="bg-violet-50-200 flex h-10 w-10 items-center justify-center rounded-full text-violet-600"
									>
										<CheckCircleOutline class="h-10 w-10 shrink-0" />
									</div>

									<div class="space-y-1">
										<div class="flex items-center gap-2">
											<span class="text-sm text-stone-500">{new Date(el?.date).toDateString()}</span
											>
											<span
												class="rounded-full bg-violet-100 px-2 py-0.5 text-center text-sm font-semibold text-violet-700"
												>{el?.tag}</span
											>
										</div>

										<p class="text-stone-700">{el?.title}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
					<!-- RIGHT ENDS -->
					<!-- LEFT -->
					<div class="w-full space-y-8 md:w-1/3">
						<p class="text-lg font-semibold">ASSETS</p>

						<div class="grid w-full grid-cols-2 gap-4">
							{#each data.task?.assets as el}
								<img
									class="h-28 w-full cursor-pointer rounded transition-all duration-700 hover:z-50 hover:scale-125 md:h-36 2xl:h-52"
									src={el}
									alt={data.task?.title}
								/>
							{/each}
						</div>
					</div>
					<!-- LEFT ENDS -->
				</div>
			</div>
		</TabItem>
		<TabItem>
			{#snippet titleSlot()}
				<div class="flex items-center gap-2">
					<ClockArrowOutline size="md" />
					Activities/Timeline
				</div>
			{/snippet}
			<div
				class="flex min-h-screen w-full justify-between gap-10 overflow-y-auto px-10 py-8 2xl:gap-20"
			>
				<div class="w-full md:w-1/2">
					<h4 class="mb-5 text-lg font-semibold text-stone-600">Activities</h4>
					<div class="w-full">
						{#each data.task?.activities as el, index}
							{@const Icon = TASKTYPEICON[el?.type].icon}
							{@const size = TASKTYPEICON[el?.type].size}
							<div class="flex space-x-4">
								<div class="flex shrink-0 flex-col items-center">
									<div class="flex h-10 w-10 items-center justify-center">
										<div class={TASKTYPEICON[el?.type].className}>
											<Icon />
										</div>
									</div>
									<div class="flex w-full items-center">
										<div class="h-full w-0.5 bg-stone-500"></div>
									</div>
								</div>

								<div class="mb-8 flex flex-col gap-y-1">
									<p class="font-semibold">{el?.by?.name}</p>
									<div class="space-y-2 text-stone-500">
										<span class="capitalize">{el?.type}</span>
										<span class="text-sm">{moment(el?.date).fromNow()}</span>
									</div>
									<div class="text-stone-700">{el?.activity}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="w-full md:w-1/3">
					<h4 class="mb-5 text-lg font-semibold text-stone-600">Add Activity</h4>
					<div class="flex w-full flex-wrap gap-5">
						{#each act_types as item}
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									class="h-4 w-4"
									checked={selectedAction === item ? true : false}
									onclick={() => {
										selectedAction = item;
									}}
								/>
								<p>{item}</p>
							</div>
						{/each}
						<textarea
							rows={10}
							value="Text"
							placeholder="Type......"
							class="mt-10 w-full rounded-md border border-stone-300 bg-stone-100 p-4 ring-blue-500 outline-none focus:ring-2"
						></textarea>

						{#if isLoading}
							<!-- <loading/> -->
						{:else}
							<Button color="blue" type={'button'} class={'rounded bg-blue-600 text-white'}>
								Submit
							</Button>
						{/if}
					</div>
				</div>
			</div>
		</TabItem>
	</Tabs>
</div>
