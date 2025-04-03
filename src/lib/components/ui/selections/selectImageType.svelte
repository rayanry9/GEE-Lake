<script lang="ts">
	import { EELayerType } from '$lib/mapData';
	import { computingImages, currentLayerType } from '$lib/mapState';

	let selectValue = $state<EELayerType>(EELayerType.FinalClassification);
	let compute = $state(true);
	computingImages.subscribe((val) => {
		compute = val;
	});
</script>

<div class="flex flex-col">
	<div class="mb-1 px-2 text-sm text-black/50">Select Image Type</div>
	<select
		bind:value={selectValue}
		disabled={compute}
		onchange={(_) => {
			currentLayerType.set(selectValue);
		}}
		class="rounded-md bg-white py-2 pl-3 pr-24 text-black outline outline-slate-300 *:my-2 hover:bg-sky-50 disabled:brightness-75"
	>
		<option value={EELayerType.FinalClassification}>Feature Image</option>
		<option value={EELayerType.RecentImage}>Original Satellite Image</option>
		<option value={EELayerType.FromWater}>Change Map</option>
	</select>
</div>
