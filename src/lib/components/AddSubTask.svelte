<script lang="ts">
	import { Button, Input, Label, Modal } from 'flowbite-svelte';

	let { open = $bindable() } = $props();

	let userInput = { title: '', date: '', tag: '' };
	let errors = { title: '', date: '', tag: '' };
</script>

<Modal bind:open dismissable={false} class="bg-stone-200">
	<form>
		<h2 class="mb-4 text-base leading-6 font-bold text-stone-900">ADD SUB-TASK</h2>
		<div class="mt-2 flex flex-col gap-6">
			<Label class="mb-2">Title</Label>
			<Input placeholder={'Sub-Task title'} type={'text'} name={'title'} class={'w-full rounded'} />

			<div class="flex items-center gap-4">
				<Label class="mb-2">Task Date</Label>
				<Input placeholder={'Date'} type={'date'} name={'date'} class={'w-full rounded'} />
				<Label class="mb-2">Tag</Label>
				<Input placeholder={'Tag'} type={'text'} name={'tag'} class={'w-full rounded'} />
			</div>
		</div>
		<div class="mt-4 flex gap-4 py-3 sm:flex-row-reverse">
			<Button
				color="blue"
				type="submit"
				class="cursor-pointer bg-blue-600 px-8 text-sm font-semibold text-stone-50 hover:bg-blue-700 sm:w-auto"
			>
				Submit
			</Button>

			<Button
				color="light"
				type="button"
				class="cursor-pointer bg-stone-100 px-5 text-sm font-semibold text-stone-900 sm:w-auto"
				onclick={() => {
					userInput = { title: '', date: '', tag: '' };
					errors = { title: '', date: '', tag: '' };
					open = false;
				}}
			>
				Cancel
			</Button>
		</div>
	</form>
</Modal>
