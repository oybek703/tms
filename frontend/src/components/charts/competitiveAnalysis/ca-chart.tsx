import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTitle, formatNumber } from '../../../utils'
import rootColors from '../../../styles/palette'

function renderOptions(series: any, categories: string[], title: string, id: string) {
	const colors = [rootColors.primary, rootColors.lightBlue]
	const options = {
		series: [
			{
				name: 'Розничный',
				type: 'column',
				data: series.retail
			},
			{
				name: 'Корпоративный',
				type: 'column',
				data: series.corporate
			}
		],
		colors,
		chart: {
			height: 345,
			type: 'line',
			stacked: false,
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '30%'
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			width: [1, 1, 4]
		},
		title: {
			...chartTitle(title, { fontWeight: '600' })
		},
		subtitle: {
			text: '(Экв. нац. вал. млн.)',
			align: 'center',
			style: {
				fontStyle: 'italic'
			}
		},
		xaxis: {
			categories
		},
		yaxis: [
			{
				axisTicks: {
					show: true
				},
				tooltip: {
					enabled: true
				},
				labels: {
					formatter: function (val: number) {
						return formatNumber(val)
					}
				}
			}
		],
		tooltip: {
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60
			}
		},
		legend: {
			horizontalAlign: 'center',
			offsetY: 8,
			offsetX: 20
		}
	}

	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	chart.render()
}

interface CAChartProps {
	series: any
	categories: string[]
	title: string
	id: string
}

const CAChart: React.FC<CAChartProps> = ({ series = [], categories = [], title, id }) => {
	useEffect(() => {
		if (categories.length) {
			document.querySelector(`#${id}`)!.innerHTML = ''
			renderOptions(series, categories, title, id)
		}
	}, [id, title, series, categories])
	return (
		<Card>
			<CardContent>
				<div id={`${id}`} />
			</CardContent>
		</Card>
	)
}

export default CAChart
