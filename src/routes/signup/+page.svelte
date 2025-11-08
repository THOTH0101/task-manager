<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Loader from '$lib/components/Loader.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { LockSolid } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';

	let errors = $state({
		name: '',
		title: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	});
	let usersInput = $state({
		name: '',
		title: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	});
	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = async () => {
		isLoading = true;

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					goto('/login');
					toast.success('Account created successfully.');
					break;
				case 'failure':
					usersInput = result.data?.input ?? {};
					errors = result.data?.errors ?? {};
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

<div class="flex min-h-screen items-center justify-center bg-stone-200 p-4">
	<div class="w-full max-w-md">
		<div class="mb-8 text-center">
			<a href="/" class="mb-2 flex items-center justify-center space-x-2">
				<span class="text-2xl font-bold tracking-tight text-blue-600">TaskFlow</span>
				<div class="h-6 w-6" aria-hidden="true">
					<LockSolid class="shink-0 h-6 w-6" />
				</div>
			</a>

			<h2 class="mt-6 text-3xl font-extrabold text-stone-900">Create your TaskFlow account</h2>

			<p class="mt-2 text-sm text-blue-600">
				Or <a
					href="/login"
					class="font-medium text-blue-600 transition duration-150 hover:text-blue-500"
				>
					log in to your existing account
				</a>
			</p>
		</div>

		<!-- Sign Up Form Card -->
		<div class="rounded-3xl border border-stone-100 bg-white p-8 shadow-2xl sm:p-10">
			<form method="POST" action="?/register" class="space-y-6" use:enhance={handleSubmit}>
				<div class="flex flex-col gap-y-4">
					<div>
						<Label>Full Name</Label>
						<Input
							bind:value={usersInput.name}
							placeholder={'John Doe'}
							type={'text'}
							name={'name'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.name}</span>
						{/if}
					</div>
					<div>
						<Label>Title</Label>
						<Input
							bind:value={usersInput.title}
							placeholder={'e.g., Software Engineer'}
							type={'text'}
							name={'title'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.title}</span>
						{/if}
					</div>
					<div>
						<Label>Email</Label>
						<Input
							bind:value={usersInput.email}
							placeholder={'e.g., johndoe@example.com'}
							type={'email'}
							name={'email'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.email}</span>
						{/if}
					</div>
					<div>
						<Label>Role</Label>
						<Input
							bind:value={usersInput.role}
							placeholder={'e.g., Development'}
							type={'text'}
							name={'role'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.role}</span>
						{/if}
					</div>
					<div>
						<Label>Password</Label>
						<Input
							bind:value={usersInput.password}
							placeholder={'••••••••'}
							type={'password'}
							name={'password'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.password}</span>
						{/if}
					</div>
					<div>
						<Label>Confirm Password</Label>
						<Input
							bind:value={usersInput.confirmPassword}
							placeholder={'••••••••'}
							type={'password'}
							name={'confirmPassword'}
							class={'w-full rounded'}
							color="blue"
						/>
						{#if errors}
							<span class="mt-0.5 text-xs text-[#f64949fe]">{errors.confirmPassword}</span>
						{/if}
					</div>
				</div>

				<div class="mt-4 gap-4 py-3 sm:flex sm:flex-row-reverse">
					{#if isLoading}
						<Loader />
					{:else}
						<Button type="submit" color="blue" class="px-8 text-sm font-semibold sm:w-auto">
							Sign Up
						</Button>
					{/if}
				</div>
			</form>
		</div>

		<p class="mt-8 text-center text-xs text-stone-500">
			By clicking "Sign Up", you agree to the <a href="#" class="font-medium hover:underline"
				>Terms of Service</a
			>.
		</p>
	</div>
</div>
