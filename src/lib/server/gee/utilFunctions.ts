export function s2scale(image: any) {
	return image.divide(10000).copyProperties(image, ["system:time_start"]);
}

export function applyScaleFactors(image: any) {
	var opticalBands = image.multiply(0.0000275).add(-0.2).copyProperties(image, ["system:time_start"]);
	return opticalBands
}

export function clipToAOI(AOI: any, image: any) {
	return image.clip(AOI);
}

export function resample10m(image: any) {
	return image.resample('bicubic').reproject({
		crs: 'EPSG:32644',
		scale: 10 // Resampling to 10m
	});
}
