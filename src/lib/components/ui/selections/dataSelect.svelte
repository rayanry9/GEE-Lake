<script lang="ts">
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import { computingImages, currentLakeId, endDate, startDate } from '$lib/mapState';
	import { get } from 'svelte/store';

	let { isInitial }: { isInitial: boolean } = $props();
	let value = $state('');
	if (isInitial) {
		let today = new Date();
		today = new Date(today.getFullYear() - 1, today.getMonth(), today.getDay());
		value = today.toISOString().substring(0, 10);
	} else {
		value = new Date().toISOString().substring(0, 10);
	}
	let max = $state(new Date().toISOString().substring(0, 10));
	if (isInitial) {
		endDate.subscribe((val) => {
			if (val == null || val == undefined || val == '') {
				return;
			}
			max = val;
		});
	}

	let compute = $state(true);
	computingImages.subscribe((val) => {
		compute = val;
	});
</script>

<div class="flex h-full flex-col justify-between">
	<div class="mb-1 px-2 text-sm text-black/50">
		{#if isInitial}First Date
		{:else}Second Date{/if}
	</div>
	<input
		class="rounded-lg px-5 py-1.5 outline outline-slate-300 hover:bg-sky-50 disabled:brightness-75"
		min="2018-01-01"
		{max}
		disabled={compute}
		onchange={() => {
			if (isInitial) {
				updateEEData(get(currentLakeId), value, get(endDate));
			} else {
				updateEEData(get(currentLakeId), get(startDate), value);
			}
		}}
		type="date"
		bind:value
	/>
</div>
