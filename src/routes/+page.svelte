<script lang="ts">
	import type { Action } from 'svelte/action';
	import { LakeData } from '$lib/mapData.svelte';
	import DropdownWithCheckbox from '$lib/components/dropdownWithCheckbox.svelte';
	import { createMap } from '$lib/mapFunctions.svelte';
	const attachMap: Action = (node) => {
		createMap(node);
	};
	let sidebarShow = $state(true);
</script>

<div class="relative flex h-full flex-row overflow-x-clip">
	<div class="flex-grow content-center justify-items-center">
		<div id="map" class="h-full w-full" use:attachMap></div>
	</div>

	<div
		class="absolute transition-all duration-300 ease-in-out {sidebarShow
			? 'right-0'
			: 'right-[-25rem]'}  top-4 z-[1000] flex w-[25rem] flex-col space-y-8 bg-stone-50 px-10 py-8 outline outline-[1px] outline-gray-700"
	>
		<div
			onclick={() => {
				sidebarShow = !sidebarShow;
			}}
			class="absolute left-[-2.5rem] top-[calc(50%-3rem)] z-[1000] h-24 w-10 cursor-pointer rounded-l-lg bg-white outline outline-[1px]"
		></div>
		<div class="space-y-2">
			<p class="font-semibold">Lakes</p>
			<select class="w-full text-sm">
				{#each LakeData as item}
					<option>{item.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-row space-x-6">
			<div class="grow space-y-2">
				<p class="font-semibold">Start Date</p>
				<input type="date" class="w-full text-sm" />
			</div>
			<div class="grow space-y-2">
				<p class="font-semibold">End Date</p>
				<input type="date" class="w-full text-sm" />
			</div>
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
