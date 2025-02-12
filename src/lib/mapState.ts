import { writable } from "svelte/store"
import { EELayerType, LakeCode, type EEResponseData, type EEStat } from "./mapData"

export const currentLakeId = writable<LakeCode>(0)
export const currentLayerType = writable<EELayerType>(EELayerType.FinalClassification)
export const dateChangeObs = writable(false)
let today = new Date()
today = new Date(today.setFullYear(today.getFullYear() - 1, today.getMonth(), today.getDate()))
export const startDate = writable(today.toISOString().substring(0, 10).toString())
export const endDate = writable(new Date().toISOString().substring(0, 10).toString())

export const acquiredStartDate = writable(new Date().toDateString())
export const acquiredFinalDate = writable(new Date().toDateString())

export let EEResponseTileData = new Array<Array<string>>
export function setEEResponseTileData(val: Array<Array<string>>) {
	EEResponseTileData = val
}

export let EEResponseStatData: Array<EEStat>
export function setEEResponseStatData(val: Array<EEStat>) {
	EEResponseStatData = val
}

export let builtUpLayer = writable(false);
export let vegetationLayer = writable(false);
export let soilLayer = writable(false);
export let waterLayer = writable(false);

export let computingImages = writable(true)

export const mapOrigin = writable<any>()
export const mapZoom = writable<any>()
let sudoMap = -1
export function setSudoMap(val: number) {
	sudoMap = val
}
export function getSudoMap() {
	return sudoMap
}
