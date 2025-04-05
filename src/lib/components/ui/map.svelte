<script lang="ts">
	import { EELayerType } from '$lib/mapData';
	import { addEETileLayer, addLakeShapeToMap, createMap } from '$lib/mapFunctions.svelte';
	import {
		acquiredFinalDate,
		acquiredStartDate,
		builtUpLayer,
		currentLakeId,
		currentLayerType,
		dateChangeObs,
		EEResponseTileData,
		getSudoMap,
		lakeShapeLayer,
		mapOrigin,
		mapZoom,
		setSudoMap,
		soilLayer,
		vegetationLayer,
		waterLayer
	} from '$lib/mapState';
	import type { Action } from 'svelte/action';
	import { get } from 'svelte/store';

	let mapContainer: any;
	let localLakeShape: any = null;
	let localGeeTileLayerBuiltUp: any = null;
	let localGeeTileLayerVegetation: any = null;
	let localGeeTileLayerSoil: any = null;
	let localGeeTileLayerWater: any = null;
	let localGeeTileLayerSatelliteImage: any = null;

	let checkedBuiltUp = $state(false);
	let checkedVegetation = $state(false);
	let checkedSoil = $state(false);
	let checkedWater = $state(false);
	let checkedLakeShape = $state(false);

	let currLayer = $state<EELayerType>(0);
	currentLayerType.subscribe((val) => {
		currLayer = val;
	});

	let { isInitialMap = false }: { isInitialMap: boolean } = $props();

	const eeResponseFunc = () => {
		if (EEResponseTileData == undefined || EEResponseTileData == null) {
			return;
		}
		if (EEResponseTileData[currLayer] == undefined) {
			return;
		}
		if (localGeeTileLayerSatelliteImage != null) {
			mapContainer.removeLayer(localGeeTileLayerSatelliteImage);
		}
		if (localGeeTileLayerBuiltUp != null) {
			mapContainer.removeLayer(localGeeTileLayerBuiltUp);
		}
		if (localGeeTileLayerVegetation != null) {
			mapContainer.removeLayer(localGeeTileLayerVegetation);
		}
		if (localGeeTileLayerSoil != null) {
			mapContainer.removeLayer(localGeeTileLayerSoil);
		}
		if (localGeeTileLayerWater != null) {
			mapContainer.removeLayer(localGeeTileLayerWater);
		}

		if (currLayer == EELayerType.RecentImage) {
			if (isInitialMap) {
				localGeeTileLayerSatelliteImage = addEETileLayer(
					EEResponseTileData[currLayer][0],
					mapContainer
				);
			} else {
				localGeeTileLayerSatelliteImage = addEETileLayer(
					EEResponseTileData[currLayer][1],
					mapContainer
				);
			}
		} else if (currLayer == EELayerType.FinalClassification) {
			builtUpLayer.set(false);
			waterLayer.set(false);
			soilLayer.set(false);
			vegetationLayer.set(false);
			builtUpLayer.set(true);
			waterLayer.set(true);
			soilLayer.set(true);
			vegetationLayer.set(true);
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
				checkedLakeShape = true;
			});
			eeResponseFunc();
		});

		lakeShapeLayer.subscribe((val) => {
			if (val && localLakeShape != null) {
				mapContainer.addLayer(localLakeShape);
				checkedLakeShape = true;
			} else if (localLakeShape != null) {
				mapContainer.removeLayer(localLakeShape);
				checkedLakeShape = false;
			}
		});

		currentLayerType.subscribe(eeResponseFunc);
		if (isInitialMap) {
			mapOrigin.set(mapContainer.getCenter());
			mapZoom.set(mapContainer.getZoom());
		}

		dateChangeObs.subscribe((_) => {
			eeResponseFunc();
		});

		builtUpLayer.subscribe((val) => {
			if (EEResponseTileData.length == 0) return;
			checkedBuiltUp = val;
			if (currLayer == EELayerType.FinalClassification) {
				let currType = EELayerType.FinalClassification;
				if (isInitialMap) {
					currType = EELayerType.InitialClassification;
				}

				if (val && localGeeTileLayerBuiltUp == null) {
					localGeeTileLayerBuiltUp = addEETileLayer(EEResponseTileData[currType][0], mapContainer);
				} else if (!val && localGeeTileLayerBuiltUp != null) {
					mapContainer.removeLayer(localGeeTileLayerBuiltUp);
					localGeeTileLayerBuiltUp = null;
				}
			}
		});
		vegetationLayer.subscribe((val) => {
			if (EEResponseTileData.length == 0) return;
			checkedVegetation = val;
			if (currLayer == EELayerType.FinalClassification) {
				let currType = EELayerType.FinalClassification;
				if (isInitialMap) {
					currType = EELayerType.InitialClassification;
				}

				if (val && localGeeTileLayerVegetation == null) {
					localGeeTileLayerVegetation = addEETileLayer(
						EEResponseTileData[currType][1],
						mapContainer
					);
				} else if (!val && localGeeTileLayerVegetation != null) {
					mapContainer.removeLayer(localGeeTileLayerVegetation);
					localGeeTileLayerVegetation = null;
				}
			}
		});
		soilLayer.subscribe((val) => {
			if (EEResponseTileData.length == 0) return;
			checkedSoil = val;
			if (currLayer == EELayerType.FinalClassification) {
				let currType = EELayerType.FinalClassification;
				if (isInitialMap) {
					currType = EELayerType.InitialClassification;
				}

				if (val && localGeeTileLayerSoil == null) {
					localGeeTileLayerSoil = addEETileLayer(EEResponseTileData[currType][2], mapContainer);
				} else if (!val && localGeeTileLayerSoil != null) {
					mapContainer.removeLayer(localGeeTileLayerSoil);
					localGeeTileLayerSoil = null;
				}
			}
		});
		waterLayer.subscribe((val) => {
			if (EEResponseTileData.length == 0) return;
			checkedWater = val;
			if (currLayer == EELayerType.FinalClassification) {
				let currType = EELayerType.FinalClassification;
				if (isInitialMap) {
					currType = EELayerType.InitialClassification;
				}

				if (val && localGeeTileLayerWater == null) {
					localGeeTileLayerWater = addEETileLayer(EEResponseTileData[currType][3], mapContainer);
				} else if (!val && localGeeTileLayerWater != null) {
					mapContainer.removeLayer(localGeeTileLayerWater);
					localGeeTileLayerWater = null;
				}
			}
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
			: 'translate-x-[100%]'} {isInitialMap
			? 'hidden'
			: 'visible'} z-[1000] flex flex-col items-center rounded-tl-md bg-white px-6 py-3"
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
				<div class="size-5 !bg-white"></div>
				<p class="grow">Boundary</p>
				{#if currLayer == EELayerType.FinalClassification}
					<input
						oninput={(ev: any) => {
							if (ev.target.checked) {
								lakeShapeLayer.set(true);
							} else {
								lakeShapeLayer.set(false);
							}
						}}
						class=""
						bind:checked={checkedLakeShape}
						type="checkbox"
					/>
				{/if}
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-[#A0522D]"></div>
				<p class="grow">Soil</p>
				{#if currLayer == EELayerType.FinalClassification}
					<input
						oninput={(ev: any) => {
							vegetationLayer.set(ev.target.checked);
						}}
						class=""
						bind:checked={checkedVegetation}
						type="checkbox"
					/>
				{/if}
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-[#808000]"></div>
				<p class="grow">Vegetation</p>
				{#if currLayer == EELayerType.FinalClassification}
					<input
						oninput={(ev: any) => {
							builtUpLayer.set(ev.target.checked);
						}}
						bind:checked={checkedBuiltUp}
						type="checkbox"
					/>
				{/if}
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-[#FFA500]"></div>
				<p class="grow">Built Up</p>
				{#if currLayer == EELayerType.FinalClassification}
					<input
						oninput={(ev: any) => {
							soilLayer.set(ev.target.checked);
						}}
						bind:checked={checkedSoil}
						type="checkbox"
					/>
				{/if}
			</div>
			<div class="flex flex-row">
				<div class="size-5 !bg-[#6495ED]"></div>
				<p class="grow">Water</p>

				{#if currLayer == EELayerType.FinalClassification}
					<input
						oninput={(ev: any) => {
							waterLayer.set(ev.target.checked);
						}}
						bind:checked={checkedWater}
						type="checkbox"
					/>
				{/if}
			</div>
		</div>
	</div>
</div>
