import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTitle } from '../../../utils'
import rootColors from '../../../styles/palette'

function renderOptions(values: any, categories: any, title: string, id: string) {
	const colors = [rootColors.primary, rootColors.lightBlue]
	const options = {
		series: [
			{
				name: 'Income',
				type: 'column',
				data: [1.4, 2, 2.5, 1.5]
			},
			{
				name: 'Cashflow',
				type: 'column',
				data: [1.1, 3, 3.1, 4]
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
			categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
		},
		yaxis: [
			{
				axisTicks: {
					show: true
				},
				tooltip: {
					enabled: true
				}
			},
			{
				seriesName: 'Income',
				opposite: true
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
			offsetX: 40
		}
	}

	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	chart.render()
}

interface CAChartProps {
	series: any
	categories: any
	title: string
	id: string
}

const CAChart: React.FC<CAChartProps> = ({ series = [], categories = [], title, id }) => {
	useEffect(() => {
		// if (series.length) {
		document.querySelector(`#${id}`)!.innerHTML = ''
		renderOptions(series, categories, title, id)
		// }
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
