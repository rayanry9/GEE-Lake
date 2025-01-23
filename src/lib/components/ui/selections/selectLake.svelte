<script lang="ts">
	import { LakeCode, LakeData } from '$lib/mapData';
	import { updateEEData } from '$lib/mapFunctions.svelte';
	import { endDate, startDate } from '$lib/mapState';
	import { get } from 'svelte/store';
	let selectValue = $state(LakeCode.Ammenpur);
	updateEEData(selectValue, get(startDate), get(endDate));
</script>

<div class="flex flex-col">
	<div>Select Lake</div>
	<select
		bind:value={selectValue}
		onchange={(_) => {
			updateEEData(selectValue, get(startDate), get(endDate));
		}}
		class="rounded-md bg-sky-100 px-3 py-2 text-black *:my-2"
	>
		{#each LakeData as lake, idx}
			<option value={idx}>{lake.name}</option>
		{/each}
	</select>
</div>
