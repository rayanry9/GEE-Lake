<script lang="ts">
	import { EELayerType } from '$lib/mapData';
	import { currentLayerType } from '$lib/mapState';
	let selectValue = $state<EELayerType>(EELayerType.FinalClassification);
</script>

<div class="flex flex-col">
	<div>Select Lake</div>
	<select
		bind:value={selectValue}
		onchange={(_) => {
			currentLayerType.set(selectValue);
		}}
		class="rounded-md bg-sky-100 px-3 py-2 text-black *:my-2"
	>
		<option value={EELayerType.FinalClassification}>Classified Image</option>
		<option value={EELayerType.RecentImage}>True Color Image</option>
		<option value={EELayerType.FromWater}>Change Map</option>
	</select>
</div>
