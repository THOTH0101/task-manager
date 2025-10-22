<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
</script>

<main>
	<Toaster richColors />
	<slot />
</main>
