<script lang="ts">
	import type { Action } from 'svelte/action';
	import { EELayerType, LakeData, LakesCode, LayersType } from '$lib/mapData';
	import DropdownWithCheckbox from '$lib/components/dropdownWithCheckbox.svelte';
	import {
		createMap,
		setCurrentLakeId,
		setCurrentLayerType,
		setEndDate,
		setStartDate
	} from '$lib/mapFunctions.svelte';

	let startDate = $state('2025-01-01');
	let endDate = $state('2025-01-12');
	let currentLakeId = $state<LakesCode>(LakesCode.Ammenpur);
	let currentLayerType = $state<EELayerType>(EELayerType.FinalClassification);

	$effect(() => {
		setCurrentLakeId(currentLakeId);
	});
	$effect(() => {
		setStartDate(startDate);
	});
	$effect(() => {
		setEndDate(endDate);
	});
	$effect(() => {
		setCurrentLayerType(currentLayerType);
	});

	const attachMap: Action = (node) => {
		createMap(node);
	};
	let sidebarShow = $state(true);
	console.log();
</script>

<div class="relative flex h-full flex-row overflow-x-clip">
	<div class="flex-grow content-center justify-items-center">
		<div id="map" class="h-full w-full" use:attachMap></div>
	</div>

	<div
		class="absolute transition-all duration-300 ease-in-out {sidebarShow
			? 'right-0'
			: 'right-[-25rem]'} top-4 z-[1000] flex w-[25rem] flex-col space-y-6 bg-stone-50 px-10 pb-10 outline outline-[1px] outline-gray-700"
	>
		<div
			onclick={() => {
				sidebarShow = !sidebarShow;
			}}
			class="absolute left-[-2.5rem] top-[calc(50%-3rem)] z-[1000] h-24 w-10 cursor-pointer rounded-l-lg bg-white outline outline-[1px]"
		></div>
		<div class="space-y-2">
			<p class="font-semibold">Lakes</p>
			<select class="w-full text-sm" bind:value={currentLakeId}>
				{#each LakeData as item, idx}
					<option value={idx}>{item.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-row space-x-6">
			<div class="grow space-y-2">
				<p class="font-semibold">Start Date</p>
				<input
					type="date"
					min="2018-01-01"
					max={endDate}
					bind:value={startDate}
					required
					class="w-full text-sm"
				/>
			</div>
			<div class="grow space-y-2">
				<p class="font-semibold">End Date</p>
				<input
					type="date"
					min="2018-01-01"
					max={new Date().toISOString().slice(0, 10)}
					required
					bind:value={endDate}
					class="w-full text-sm"
				/>
			</div>
		</div>

		<div class="grow space-y-2">
			<p class="font-semibold">Layer</p>
			<select bind:value={currentLayerType} class="w-full text-sm">
				{#each LayersType as item, idx}
					<option value={idx}>{item}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-2">
			<p class="font-semibold">Indices</p>
			<DropdownWithCheckbox />
		</div>
	</div>
</div>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
