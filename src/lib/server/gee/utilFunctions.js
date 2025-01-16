import { getAOI } from "./inputs";

export function s2scale(image) {
	return image.divide(10000).copyProperties(image, ["system:time_start"]);
}

export function applyScaleFactors(image) {
	var opticalBands = image.multiply(0.0000275).add(-0.2).copyProperties(image, ["system:time_start"]);
	return opticalBands
}

export function clipToAOI(image) {
	return image.clip(getAOI());
}

export function resample10m(image) {
	return image.resample('bicubic').reproject({
		crs: 'EPSG:32644',
		scale: 10 // Resampling to 10m
	});
}
