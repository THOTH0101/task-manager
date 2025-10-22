<script lang="ts">
	import { chartData } from '../../assets/data';
	import { echarts } from '$lib/echarts';

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

<div class="rounded-full mt-3">
	<div class="container h-[500px] w-full" use:echarts={option}></div>
</div>
