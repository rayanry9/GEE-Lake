import { getFinalClassification, getInitialClassification } from "./classification";
import { getRecentImage, getStartImage } from "./imageCollections";
import { dataVisParams, rgbVisParams } from "./visParams";

export function getStartImgFormatUrl() {
	return getStartImage().getMapId(rgbVisParams).urlFormat
}
export function getInitialClassificationFormatUrl() {
	return getInitialClassification().getMapId(dataVisParams).urlFormat
}
export function getRecentImgFormatUrl() {
	return getRecentImage().getMapId(rgbVisParams).urlFormat
}
export function getFinalClassificationFormatUrl() {
	return getFinalClassification().getMapId(dataVisParams).urlFormat
}
