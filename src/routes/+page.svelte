<script lang="ts">
	import { createMap } from '$lib/mapFunctions.svelte';
	import type { Action } from 'svelte/action';

	const attachMap: Action = (node) => {
		createMap(node);
	};
</script>

<div class="flex h-full flex-row">
	<div class="flex-grow content-center justify-items-center">
		<div id="map" class="h-[60rem] w-full" use:attachMap></div>
	</div>
	<div class="flex h-full w-[30rem] flex-col bg-slate-50"></div>
</div>
<link
	rel="stylesheet"
	href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
	integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
	crossorigin=""
/>
