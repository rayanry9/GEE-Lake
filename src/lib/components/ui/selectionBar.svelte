<script lang="ts">
	import { EELayerType, LakeCode } from '$lib/mapData';
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import DataSelect from './selections/dataSelect.svelte';
	import SelectImageType from './selections/selectImageType.svelte';
	import SelectLake from './selections/selectLake.svelte';
	import { computingImages } from '$lib/mapState';

	let lake = $state(LakeCode.Ammenpur);
	let initialDate = $state('');
	let finalDate = $state('');
	let compute = $state(false);
	computingImages.subscribe((val) => {
		compute = val;
	});

	// updateEEData(selectValue, get(startDate), get(endDate));
</script>

<div class="flex w-full flex-row justify-center space-x-12">
	<SelectLake bind:selectValue={lake} />
	<DataSelect isInitial={true} bind:value={initialDate} />
	<DataSelect isInitial={false} bind:value={finalDate} />
	<SelectImageType />
	<button
		disabled={compute}
		class="mt-auto h-fit items-center justify-self-center rounded-lg px-4 py-2 ring ring-gray-300 disabled:bg-gray-300 disabled:ring-gray-600"
		onclick={(ev) => {
			updateEEData(lake, initialDate, finalDate);
		}}>Submit</button
	>
</div>
