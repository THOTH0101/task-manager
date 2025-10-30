<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Loader from '$lib/components/Loader.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { toast } from 'svelte-sonner';

	let errors = $state({ email: '', password: '' });
	let userInput = $state({ email: '', password: '' });
	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = async () => {
		isLoading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					goto('/dashboard');
					toast.success('Login successfully.');
					break;
				case 'failure':
					errors = result.data?.errors || {};
					userInput = result.data?.input || {};
					toast.error(result.data?.message ?? 'Invalid credentials.');
					break;
				default:
					break;
			}
			isLoading = false;
			await update();
		};
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-stone-200 lg:flex-row">
	<div
		class="flex w-full flex-col items-center justify-center gap-0 md:w-auto md:flex-row md:gap-40"
	>
		<!-- Left Side -->
		<div class="flex h-full w-full flex-col items-center justify-center lg:w-2/3">
			<div
				class="flex w-full flex-col items-center justify-center gap-5 md:max-w-lg md:gap-y-10 2xl:-mt-20 2xl:max-w-3xl"
			>
				<span
					class="flex gap-1 rounded-full border border-stone-300 px-3 py-1 text-sm text-stone-700 md:text-base"
				>
					Manage Your Projects And Be More Productive
				</span>
				<p
					class="flex flex-col gap-0 text-center text-4xl font-black text-blue-700 md:gap-4 md:text-6xl 2xl:text-7xl"
				>
					<span>TaskFlow</span>
				</p>
				<div class="cell">
					<div class="circle rotate-in-up-left"></div>
				</div>
			</div>
		</div>

		<!-- Right Side -->
		<div class="flex w-full flex-col items-center justify-center p-4 md:w-1/3 md:p-1">
			<form
				method="POST"
				action="?/login"
				class="container flex w-full flex-col gap-y-8 rounded-xl bg-stone-100 px-10 pt-14 pb-14 shadow-lg md:w-[400px]"
				use:enhance={handleSubmit}
			>
				<div>
					<p class="text-center text-3xl font-bold text-blue-600">Welcome Back!</p>
				</div>
				<div class="flex flex-col gap-y-5">
					<div>
						<Label>Email</Label>
						<Input
							bind:value={userInput.email}
							color="blue"
							placeholder="email@example.com"
							type="email"
							name="email"
							class="w-full rounded-full"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.email}</span>
						{/if}
					</div>
					<div>
						<Label>Password</Label>
						<Input
							bind:value={userInput.password}
							color="blue"
							placeholder="********"
							type="password"
							name="password"
							class="w-full rounded-full"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.password}</span>
						{/if}
					</div>

					<span class="cursor-pointer text-sm text-stone-500 hover:text-blue-600 hover:underline">
						Forget Password?
					</span>

					{#if isLoading}
						<Loader />
					{:else}
						<Button type="submit" color="blue" class="cursor-pointer text-stone-100">Submit</Button>
					{/if}
					<p class="mt-2 text-center text-sm text-blue-600">
						Or
						<a
							href="/signup"
							class="font-medium text-blue-600 transition duration-150 hover:text-blue-500"
						>
							create a new account
						</a>
					</p>
				</div>
			</form>
		</div>
	</div>
</div>
