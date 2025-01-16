<script lang="ts">
	import { createMap } from '$lib/mapFunctions.svelte';
	import { Datepicker, Select } from 'flowbite-svelte';
	import type { Action } from 'svelte/action';

	const attachMap: Action = (node) => {
		createMap(node);
	};
	let lakes = [
		{ name: 'Ameenpur Lake', value: 'lake' },
		{ name: 'Lake', value: 'lake' },
		{ name: 'Lake', value: 'lake' },
		{ name: 'Lake', value: 'lake' },
		{ name: 'Lake', value: 'lake' },
		{ name: 'Lake', value: 'lake' }
	];
</script>

<div class="flex h-full flex-row">
	<div class="flex-grow content-center justify-items-center">
		<div id="map" class="h-[60rem] w-full" use:attachMap></div>
	</div>

	<div
		class="z-10 flex h-full w-[30rem] flex-col space-y-8 border-l-2 border-l-primary-500 bg-slate-50 px-10 pt-8"
	>
		<div class="space-y-2">
			<p class="text-lg font-bold">Lakes</p>
			<Select items={lakes} />
		</div>

		<div class="flex flex-row space-x-6">
			<div class="grow">
				<p class="text-lg font-bold">Start Date</p>
				<input type="date" class="w-full" />
			</div>
			<div class="grow">
				<p class="text-lg font-bold">End Date</p>
				<input type="date" class="w-full" />
			</div>
		</div>
	</div>
</div>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
