export const cloudCover = 30

export const enum EELayerType {
	FinalClassification = 0,
	InitialClassification = 1,
	StartImage = 2,
	RecentImage = 3,
	FromWater = 4,
	ToWater = 5
}
export const LayersType = [
	"Final Classification",
	"Initial Classificaiton",
	"Start Image",
	"Recent Image",
	"From Water",
	"To Water"
]
export const enum LakesCode {
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


export interface TileResponseTypeAPI {
	urlFormat: string
}

export enum WaterDataType {
	ToWater = 0,
	FromWater = 1
}
