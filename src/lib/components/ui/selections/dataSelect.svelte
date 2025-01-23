<script lang="ts">
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import { currentLakeId, endDate, startDate } from '$lib/mapState';
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
</script>

<div>
	<input
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
