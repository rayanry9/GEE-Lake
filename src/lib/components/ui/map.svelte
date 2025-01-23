<script lang="ts">
	import type { EELayerType } from '$lib/mapData';
	import { addEETileLayer, addLakeShapeToMap, createMap } from '$lib/mapFunctions.svelte';
	import {
		currentLakeId,
		currentLayerType,
		dateChangeObs,
		EEResponseTileData
	} from '$lib/mapState';
	import type { Action } from 'svelte/action';
	import { get } from 'svelte/store';
	let mapContainer: any;
	let localLakeShape: any = null;
	let localGeeTileLayer: any = null;

	const eeResponseFunc = (type: EELayerType) => {
		if (EEResponseTileData == undefined || EEResponseTileData == null) {
			return;
		}
		let url = EEResponseTileData[type];
		if (url != undefined) {
			if (localGeeTileLayer !== null) {
				mapContainer.removeLayer(localGeeTileLayer);
			}
			localGeeTileLayer = addEETileLayer(url, mapContainer);
		}
	};

	const attachMap: Action = (node) => {
		mapContainer = createMap(node);
		currentLakeId.subscribe((id) => {
			if (localLakeShape !== null) {
				mapContainer.removeLayer(localLakeShape);
			}
			addLakeShapeToMap(id, mapContainer).then((val) => {
				localLakeShape = val;
			});
			eeResponseFunc(get(currentLayerType));
		});

		currentLayerType.subscribe(eeResponseFunc);

		dateChangeObs.subscribe((_) => {
			eeResponseFunc(get(currentLayerType));
		});
	};
</script>

<div class="relative h-full grow">
	<div class="absolute">Nearest First Date of Acquisition</div>
	<div use:attachMap class="h-full w-full"></div>
	<div class="absolute bottom-10 right-10 z-[1000]">Legend</div>
</div>
