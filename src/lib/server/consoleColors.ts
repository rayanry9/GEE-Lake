import colors from "colors/safe"
export namespace Console {
	export const error = (str: string) => console.error(colors.bgRed(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const success = (str: string) => console.info(colors.bgGreen(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const info = (str: string) => console.info(colors.bgCyan(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
}
