<script lang="ts">
	import { LakeData } from '$lib/mapData';
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import { computingImages, endDate, startDate } from '$lib/mapState';
	import { get } from 'svelte/store';
	let { selectValue = $bindable(), ...props } = $props();

	// let selectValue = $state(LakeCode.Ammenpur);
	// updateEEData(selectValue, get(startDate), get(endDate));

	let compute = $state(true);
	computingImages.subscribe((val) => {
		compute = val;
	});
</script>

<div class="flex flex-col">
	<div class="mb-1 px-2 text-sm text-black/50">Select Lake</div>
	<select
		bind:value={selectValue}
		disabled={compute}
		onchange={(_) => {
			// updateEEData(selectValue, get(startDate), get(endDate));
		}}
		class="rounded-md bg-white px-3 py-2 pr-12 text-black outline outline-slate-300 hover:bg-sky-50 disabled:brightness-75"
	>
		{#each LakeData as lake, idx}
			<option value={idx}>{lake.name}</option>
		{/each}
	</select>
</div>
