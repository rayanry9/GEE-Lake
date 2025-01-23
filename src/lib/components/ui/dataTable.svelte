<script lang="ts">
	import { type EEStat } from '$lib/mapData';
	import { currentLakeId, dateChangeObs, EEResponseStatData } from '$lib/mapState';
	let initial = $state<EEStat>({ waterBody: 0, treeCover: 0, soil: 0, building: 0 });
	let final = $state<EEStat>({ waterBody: 0, treeCover: 0, soil: 0, building: 0 });
	let change = $state<EEStat>({ waterBody: 0, treeCover: 0, soil: 0, building: 0 });

	currentLakeId.subscribe(() => {
		if (EEResponseStatData == null || EEResponseStatData == undefined) {
			return;
		}
		initial = EEResponseStatData[0];
		final = EEResponseStatData[1];
		change = EEResponseStatData[2];
	});
	dateChangeObs.subscribe(() => {
		if (EEResponseStatData == null || EEResponseStatData == undefined) {
			return;
		}
		initial = EEResponseStatData[0];
		final = EEResponseStatData[1];
		change = EEResponseStatData[2];
	});
</script>

<div class="h-fit w-full px-6 pb-4">
	<table class="w-full table-fixed border-collapse border-2 border-black">
		<thead class="border border-black bg-sky-100 text-lg">
			<tr class="*:py-2">
				<th scope="col">Type</th>
				<th scope="col">Building</th>
				<th scope="col">Soil</th>
				<th scope="col">Tree cover</th>
				<th scope="col">Water Body</th>
			</tr>
		</thead>
		<tbody class=" *:text-center even:*:bg-slate-100">
			<tr class="*:py-2">
				<th scope="row">Initial</th>
				<td>{initial.building.toFixed(2)}</td>
				<td>{initial.soil.toFixed(2)}</td>
				<td>{initial.treeCover.toFixed(2)}</td>
				<td>{initial.waterBody.toFixed(2)}</td>
			</tr>
			<tr class="*:py-2">
				<th scope="row">Final</th>
				<td>{final.building.toFixed(2)}</td>
				<td>{final.soil.toFixed(2)}</td>
				<td>{final.treeCover.toFixed(2)}</td>
				<td>{final.waterBody.toFixed(2)}</td>
			</tr>
			<tr class="*:py-2">
				<th scope="row">Change</th>
				<td class={change.building < 0 ? 'text-green-500' : 'text-red-400'}
					>{change.building.toFixed(2)}</td
				>
				<td class={change.soil > 0 ? 'text-green-500' : 'text-red-400'}>{change.soil.toFixed(2)}</td
				>
				<td class={change.treeCover > 0 ? 'text-green-500' : 'text-red-400'}
					>{change.treeCover.toFixed(2)}</td
				>
				<td class={change.waterBody > 0 ? 'text-green-500' : 'text-red-400'}
					>{change.waterBody.toFixed(2)}</td
				>
			</tr>
		</tbody>
	</table>
</div>
