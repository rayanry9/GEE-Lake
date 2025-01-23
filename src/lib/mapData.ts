export const cloudCover = 30


export interface EEStat {
	building: number,
	soil: number,
	treeCover: number,
	waterBody: number
}
export enum EEStatType {
	Initial = 0,
	Final = 1,
	Change = 2
}

export interface EEResponseData {
	tile: Array<string>,
	data: Array<EEStat>,
	satInitialDate: string,
	satFinalDate: string
}

export enum WaterDataType {
	ToWater = 0,
	FromWater = 1
}

export const enum EELayerType {
	FinalClassification = 0,
	InitialClassification = 1,
	RecentImage = 2,
	StartImage = 3,
	FromWater = 4,
	ToWater = 5
}
export const LayerType = [
	"Final Classification",
	"Initial Classificaiton",
	"Recent Image",
	"Start Image",
	"From Water",
	"To Water"
]

export const enum LakeCode {
	Ammenpur = 0,
	Shabunikunta = 1,
}
export const LakeData = [
	{
		name: "Ameenpur Lake",
		browserPath: "shapeFiles/Ameenpur_Lake_Shapefile.zip",
		geeAssetPath: "projects/ee-ma24btech11018/assets/Ameenpur_Lake_Shapefile"
	},
	{
		name: "Shabunikunta Lake",
		browserPath: "shapeFiles/Shabunikunta_Lake_Shapefile.zip",
		geeAssetPath: "projects/ee-ma24btech11018/assets/Shabunikunta_Lake_Shapefile"
	}
]
export const enum IndicesCode {
	NDVI = 0,
	mNDWI = 1,
	AWEIsh = 2,
	AWEInsh = 3,
	NDBI = 4,
	BSI = 5
}

export const IndicesData = [
	"NDVI",
	"NDWI",
	"AWEIsh",
	"AWEInsh",
	"NDBI",
	"BSI"
]


