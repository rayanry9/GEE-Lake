export function addNDVI(image: any) {
	let ndvi = image.normalizedDifference(['nir', 'red']).rename('ndvi');
	return image.addBands(ndvi);
}

// NDWI Calculation
export function addmNDWI(image: any) {
	let ndwi = image.normalizedDifference(['green', 'swirI']).rename('mndwi');
	return image.addBands(ndwi);
}

// AWEIsh Calculation
export function addAWEIsh(image: any) {
	let aweish = image.expression(
		'BLUE + 2.5 * GREEN - 1.5 * (NIR + SWIR1) - 0.25 * SWIR2', {
		'BLUE': image.select('blue'),
		'GREEN': image.select('green'),
		'NIR': image.select('nir'),
		'SWIR1': image.select('swirI'),
		'SWIR2': image.select('swirII')
	}).rename('AWEIsh');
	return image.addBands(aweish);
}

export function addAWEInsh(image: any) {
	let aweinsh = image.expression(
		'4 * (GREEN - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)', {
		'GREEN': image.select('green'),
		'NIR': image.select('nir'),
		'SWIR1': image.select('swirI'),
		'SWIR2': image.select('swirII')
	}).rename('AWEInsh');
	return image.addBands(aweinsh);
}
// NDBI Calculation
export function addNDBI(image: any) {
	let ndbi = image.normalizedDifference(['swirI', 'nir']).rename('ndbi');
	return image.addBands(ndbi);
}

// BSI Calculation
export function addBSI(image: any) {
	let bsi = image.expression(
		'((SWIR2+RED) - (NIR + BLUE))/((SWIR2+RED) + (NIR + BLUE))', {
		'RED': image.select('red'),
		'NIR': image.select('nir'),
		'BLUE': image.select('blue'),
		'SWIR2': image.select('swirII')
	}).rename('bsi');
	return image.addBands(bsi);
}

