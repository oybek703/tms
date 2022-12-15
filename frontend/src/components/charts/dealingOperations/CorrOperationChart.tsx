import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { ITransactionData } from '../../../interfaces/corrOperations.interfaces'
import { chartTitle, formatNumber } from '../../../utils'
import palette from '../../../styles/palette'
import { Card } from '@mui/material'

function renderOptions(
	data1: number[],
	data2: number[],
	categories: any,
	title: string,
	id: string,
	vertical?: boolean
) {
	const options = {
		series: [
			{
				name: 'Приток',
				data: data1
			},
			{
				name: 'Отток',
				data: data2
			}
		],
		colors: [palette.primary, palette.lightBlue],
		chart: {
			height: 500,
			width: '100%',
			type: 'bar',
			toolbar: {
				show: true,
				tools: {
					download: false,
					selection: true,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: true
				}
			}
		},
		plotOptions: {
			bar: {
				horizontal: !vertical,
				dataLabels: {
					position: 'top'
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: function (val: number) {
				return val === 0 ? '' : formatNumber(val)
			},
			style: {
				fontSize: '13px',
				fontWeight: 'bold',
				marginTop: '20px'
			},
			offsetX: vertical ? 0 : 45,
			offsetY: vertical ? 45 : 0,
			background: {
				enabled: true,
				foreColor: '#000',
				borderRadius: 2,
				padding: 2,
				opacity: 0,
				borderWidth: 1,
				borderColor: palette.primary
			}
		},
		stroke: {
			show: true,
			width: 1,
			colors: ['#fff']
		},
		tooltip: {
			shared: true,
			intersect: false,
			followCursor: true
		},
		title: {
			...chartTitle(title),
			fontWeight: 'bold'
		},
		xaxis: {
			categories: categories,
			labels: {
				formatter: function (val: number) {
					return vertical ? val : `${val.toFixed(2)}`
				},
				style: {
					fontWeight: '600'
				}
			}
		}
	}
	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	chart.render()
}

interface ForeignCurrencyChartProps {
	data: ITransactionData[]
	id: string
	title: string
	vertical?: boolean
}

const CorrOperationChart: React.FC<ForeignCurrencyChartProps> = ({ data, title, id, vertical }) => {
	const seriesData1 = data.map(({ debit }) => +(debit || 0).toFixed(2))
	const seriesData2 = data.map(({ credit }) => +(credit || 0).toFixed(2))
	const categories = data.map(({ bankNameOrYear }) => bankNameOrYear)
	const isReadyToRender = seriesData1.length || seriesData2.length
	useEffect(() => {
		if (isReadyToRender) {
			document.querySelector(`#${id}`)!.innerHTML = ''
			renderOptions(seriesData1, seriesData2, categories, title, id, vertical)
		}
	}, [vertical, isReadyToRender, id, title, data, seriesData2, seriesData1, categories])
	return (
		<Card sx={{ border: '1px solid #000', mt: 1, mr: 1 }}>
			{!isReadyToRender ? title : ''}
			<div id={`${id}`} />
		</Card>
	)
}

export default CorrOperationChart
