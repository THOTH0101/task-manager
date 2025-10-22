<script lang="ts">
	import { BellSolid, ChartLineUpOutline, CheckCircleSolid } from 'flowbite-svelte-icons';

	const features = [
		{
			icon: CheckCircleSolid, // Represents the icon visually
			title: 'Simple Task Creation',
			description: 'Log new tasks in seconds and assign due dates.',
			color: 'text-green-500',
			strokeColor: '#10B981' // Green-500
		},
		{
			icon: ChartLineUpOutline,
			title: 'Progress Overview',
			description: 'Visualize your daily and weekly task completion rates.',
			color: 'text-blue-500',
			strokeColor: '#3B82F6' // Blue-500
		},
		{
			icon: BellSolid,
			title: 'Smart Reminders',
			description: 'Get notified just in time, without the unnecessary noise.',
			color: 'text-yellow-500',
			strokeColor: '#F59E0B' // Yellow-500
		}
	];
</script>

<div class="flex min-h-screen w-full flex-col bg-stone-200">
	<!-- Navigation Bar -->
	<header class="sticky top-0 z-40 bg-stone-200/95 shadow-md backdrop-blur-sm">
		<div
			class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
		>
			<a
				href="/"
				class="text-2xl font-bold tracking-tight text-blue-600 transition duration-150 hover:text-blue-700"
			>
				TaskFlow
			</a>
			<nav class="flex items-center space-x-3">
				<a
					href="/login"
					class="rounded-lg border border-blue-200 px-4 py-2 font-medium text-blue-600 transition duration-150 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Log In
				</a>
				<a
					href="/signup"
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-stone-100 shadow-md transition duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Sign Up
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
		<div class="text-center">
			<!-- Headline -->
			<h1 class="mb-6 text-5xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
				The simplest way to <span class="text-blue-600">tackle your day.</span>
			</h1>

			<!-- Subtitle/Description -->
			<p class="mx-auto mt-3 mb-10 max-w-2xl text-xl text-stone-500">
				Stop juggling sticky notes and spreadsheets. TaskFlow is the intuitive task manager built to
				clear your mind and boost your productivity, guaranteed.
			</p>

			<!-- Call-to-Action (CTA) -->
			<div class="mt-8 flex justify-center">
				<!-- CTA Button -->
				<a
					href="/tasks"
					class="transform rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.03] hover:bg-green-700 hover:shadow-xl focus:ring-4 focus:ring-green-500/50"
				>
					Get Started — It's Free
				</a>
			</div>
		</div>
	</main>

	<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-800">Built for Clarity and Speed</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			{#each features as { color, title, icon: Icon, strokeColor, description } (title)}
				<div
					class="rounded-2xl border border-stone-100 bg-white p-8 shadow-lg transition duration-300 hover:shadow-2xl"
				>
					<!-- Icon placeholder replaced by inline SVG (using @html to render the function output) -->
					<div class="{color} mb-4" role="img" aria-label="{title} icon">
						<Icon class="h-10 w-10 shrink-0" color={strokeColor} />
					</div>
					<h3 class="mb-3 text-xl font-semibold text-gray-900">{title}</h3>
					<p class="text-gray-500">{description}</p>
				</div>
			{/each}
		</div>
	</section>

	<footer class="mx-auto mt-16 max-w-7xl border-t border-gray-200 px-4 py-8 sm:px-6 lg:px-8">
		<p class="text-center text-sm text-gray-500">
			&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
		</p>
	</footer>
</div>
