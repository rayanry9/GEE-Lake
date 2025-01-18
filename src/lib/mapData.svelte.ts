export const enum EETileLayerType {
	StartImaage = 0,
	FinalImage = 1,
	InitialClassification = 2,
	FinalClassification = 3
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

export const IndicesData = [
	"NDVI",
	"NDWI",
	"AWEIsh",
	"AWEInsh",
	"NDBI",
	"BSI"
]
