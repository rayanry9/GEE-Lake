<script lang="ts">
	import { EELayerType, LakeCode } from '$lib/mapData';
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import DataSelect from './selections/dataSelect.svelte';
	import SelectImageType from './selections/selectImageType.svelte';
	import SelectLake from './selections/selectLake.svelte';
	import { computingImages } from '$lib/mapState';
	import VisParamsRange from './selections/visParamsRange.svelte';

	let lake = $state(LakeCode.Ammenpur);
	let initialDate = $state('');
	let finalDate = $state('');
	let compute = $state(false);

	let rgbMin = $state(0);
	let rgbMax = $state(0.25);
	computingImages.subscribe((val) => {
		compute = val;
	});

	// updateEEData(selectValue, get(startDate), get(endDate));
</script>

<div class="-my-4 flex w-full flex-row items-center justify-center space-x-12 py-4">
	<SelectLake bind:selectValue={lake} />
	<DataSelect isInitial={true} bind:value={initialDate} />
	<DataSelect isInitial={false} bind:value={finalDate} />
	<SelectImageType />
	<VisParamsRange bind:minValue={rgbMin} bind:maxValue={rgbMax} />
	<button
		disabled={compute}
		class="h-fit items-center justify-self-center rounded-lg px-4 py-2 ring ring-gray-300 disabled:bg-gray-300 disabled:ring-gray-600"
		onclick={() => {
			updateEEData(lake, initialDate, finalDate, rgbMin, rgbMax);
		}}>Submit</button
	>
</div>
