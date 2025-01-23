<script lang="ts">
	import type { EELayerType } from '$lib/mapData';
	import { addEETileLayer, addLakeShapeToMap, createMap } from '$lib/mapFunctions.svelte';
	import {
		acquiredFinalDate,
		acquiredStartDate,
		currentLakeId,
		currentLayerType,
		dateChangeObs,
		EEResponseTileData,
		getSudoMap,
		mapOrigin,
		mapZoom,
		setSudoMap
	} from '$lib/mapState';
	import type { Action } from 'svelte/action';
	import { get } from 'svelte/store';

	let mapContainer: any;
	let localLakeShape: any = null;
	let localGeeTileLayer: any = null;
	let { isInitialMap = false }: { isInitialMap: boolean } = $props();

	const eeResponseFunc = (type: EELayerType) => {
		type = isInitialMap ? type + 1 : type;
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
		if (isInitialMap) {
			mapOrigin.set(mapContainer.getCenter());
			mapZoom.set(mapContainer.getZoom());
		}

		dateChangeObs.subscribe((_) => {
			eeResponseFunc(get(currentLayerType));
		});

		mapContainer.on('mouseover', () => {
			if (isInitialMap) {
				setSudoMap(0);
			} else {
				setSudoMap(1);
			}
		});

		mapContainer.on('move', () => {
			if (getSudoMap() == 0 && isInitialMap) {
				mapOrigin.set(mapContainer.getCenter());
				mapZoom.set(mapContainer.getZoom());
			} else if (getSudoMap() == 1 && !isInitialMap) {
				mapOrigin.set(mapContainer.getCenter());
				mapZoom.set(mapContainer.getZoom());
			}
		});
		mapContainer.on('zoom', () => {
			if (getSudoMap() == 0 && isInitialMap) {
				mapOrigin.set(mapContainer.getCenter());
				mapZoom.set(mapContainer.getZoom());
			} else if (getSudoMap() == 1 && !isInitialMap) {
				mapOrigin.set(mapContainer.getCenter());
				mapZoom.set(mapContainer.getZoom());
			}
		});
		mapOrigin.subscribe((val) => {
			if (isInitialMap && getSudoMap() == 1) {
				mapContainer.setView(val, get(mapZoom));
			} else if (!isInitialMap && getSudoMap() == 0) {
				mapContainer.setView(val, get(mapZoom));
			}
		});
		mapZoom.subscribe((val) => {
			if (isInitialMap && getSudoMap() == 1) {
				mapContainer.setZoom(val);
			} else if (!isInitialMap && getSudoMap() == 0) {
				mapContainer.setZoom(val);
			}
		});
	};

	let acquiredDate = $state('');
	if (isInitialMap) {
		acquiredStartDate.subscribe((val) => {
			acquiredDate = val;
		});
	} else {
		acquiredFinalDate.subscribe((val) => {
			acquiredDate = val;
		});
	}
	let legendState = $state(true);
</script>

<div class="relative h-full grow overflow-clip">
	<div
		class="absolute bottom-0 left-28 z-[1000] rounded-t-md bg-white px-3 py-1 text-sm font-semibold text-black"
	>
		{acquiredDate}
	</div>
	<div use:attachMap class="h-full w-full"></div>
	<div
		class="absolute bottom-4 right-0 border-l border-t border-black transition-all duration-300 ease-in-out {legendState
			? 'translate-x-0'
			: 'translate-x-[100%]'}  z-[1000] flex flex-col items-center rounded-tl-md bg-white px-6 py-3"
	>
		<div
			class="absolute left-[calc(-1rem)] top-[calc(50%-1.5rem)] z-[900] flex h-12 w-4 flex-row items-center border-b border-l border-t border-black bg-white py-4 pl-1"
			role="button"
			tabindex="0"
			onkeydown={() => {}}
			onclick={() => {
				legendState = !legendState;
			}}
		>
			<div class="h-full w-1 rounded-sm bg-slate-300 py-4"></div>
		</div>
		<div class="mb-4 text-lg font-bold">Legend</div>
		<div class="flex flex-col space-y-3 *:items-center *:space-x-3">
			<div class="flex flex-row">
				<div class="size-5 !bg-red-500"></div>
				<p>Building</p>
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-green-500"></div>
				<p>Tree Cover</p>
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-yellow-500"></div>
				<p>Soil</p>
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-blue-500"></div>
				<p>Water</p>
			</div>
		</div>
	</div>
</div>
