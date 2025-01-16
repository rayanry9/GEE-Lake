import ee from "@google/earthengine"

var AOI

export function getAOI() {
	return AOI
}
export function setAOI(aoi) {
	AOI = aoi
}

export const cloudCover = 30
export const cloudCoverA = 10
export const dateStart = '2025-01-01'
export const dateEnd = '2025-01-12'
export const today = ee.Date(new Date());
export const startDate = ee.Date('2006-01-01') //Start Date
export const endDate = today.advance(1, 'day');
