<script>
	import { TASK_TYPE } from '$lib';

	let { task } = $props();
</script>

<div class={'h-4 w-4 rounded-full ' + TASK_TYPE[task.stage]}></div>
