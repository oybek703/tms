import { WorkSheet } from 'sheetjs-style'

const headerCellStyles = {
	fill: {
		fgColor: {
			rgb: 'ff7794aa'
		}
	},
	font: {
		color: {
			rgb: 'ffffffff'
		},
		bold: true
	},
	alignment: {
		horizontal: 'center'
	}
}
const simpleCellStyles = {
	font: {},
	alignment: {
		horizontal: 'center'
	}
}

export class ExcelProcessor {
	constructor(private readonly workSheet: WorkSheet, private readonly data?: Record<string, unknown>) {}

	keyIndicatorsBaseProcessor(boldCells: number[]) {
		for (const workSheetKey in this.workSheet) {
			const headerCells = ['A2', 'C2', 'D2', 'E2', 'F2', 'G2']
			if (['E2', 'D2', 'C2'].includes(workSheetKey)) {
				this.workSheet[workSheetKey].t = 's'
				this.workSheet['C2'].v = this.data!.yearFirstDate
				this.workSheet['D2'].v = this.data!.monthFirstDate
				this.workSheet['E2'].v = this.data!.selectedDate
			}
			if (workSheetKey === 'B2') {
				this.workSheet[workSheetKey].s = { ...headerCellStyles, alignment: 'left' }
				continue
			}
			if (headerCells.includes(workSheetKey)) {
				this.workSheet[workSheetKey].s = headerCellStyles
				continue
			}
			if (!workSheetKey.startsWith('B') && workSheetKey !== '!ref' && workSheetKey !== 'G1') {
				this.workSheet[workSheetKey].t = 's'
				this.workSheet[workSheetKey].v = String(this.workSheet[workSheetKey].v).replace('.', ',').replace(/[()]/g, '')
				this.workSheet[workSheetKey].s = simpleCellStyles
			}
			for (const boldCell of boldCells) {
				if (new RegExp(String.raw`[A-Z]${boldCell}$`, 'g').test(workSheetKey)) {
					this.workSheet[workSheetKey].s = {
						alignment: {
							horizontal: workSheetKey.startsWith('B') ? 'left' : 'center'
						},
						font: {
							bold: true
						}
					}
				}
			}
			if (workSheetKey === 'G1') {
				this.workSheet['G1'].s = {
					font: {
						bold: true,
						italic: true
					},
					alignment: {
						horizontal: 'right'
					}
				}
			}
		}
		this.workSheet['!cols'] = [
			{ wpx: 20 },
			{ wpx: 280 },
			{ wpx: 100 },
			{ wpx: 100 },
			{ wpx: 100 },
			{ wpx: 150 },
			{ wpx: 180 }
		]
	}

	mainIndicators() {
		this.keyIndicatorsBaseProcessor([3, 6, 9, 12, 15, 16, 17, 18, 19, 20, 23, 27, 28, 29, 30, 31, 32, 33, 34])
	}

	profitAndLost() {
		this.keyIndicatorsBaseProcessor([7, 11, 12, 14, 18, 19, 28, 29, 30, 31])
	}
}
