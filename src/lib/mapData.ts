export const enum EETileLayerType {
	StartImage = 0,
	RecentImage = 1,
	InitialClassification = 2,
	FinalClassification = 3
}
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
