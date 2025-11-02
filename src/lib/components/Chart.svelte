<script lang="ts">
	import { echarts } from '$lib/echarts';

	export let chartData: { name: string; total: number }[];

	const priority = chartData.map((data) => data.name);
	const total = chartData.map((data) => data.total);

	const option = {
		xAxis: {
			type: 'category',
			data: priority
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: total,
				type: 'bar'
			}
		]
	};
</script>

<div class="mt-3 rounded-full">
	<div class="container h-[500px] w-full" use:echarts={option}></div>
</div>
