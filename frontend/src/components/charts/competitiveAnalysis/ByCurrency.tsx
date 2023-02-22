import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { chartTitle, formatNumber } from '../../../utils'
import rootColors from '../../../styles/palette'
import { ICANationalForeign } from '../../../interfaces/ca.interface'

function renderOptions(series: ICANationalForeign, categories: string[], title: string, id: string) {
	const colors = [rootColors.primary, rootColors.lightBlue]
	const options = {
		series: [
			{
				name: 'В нац. валюте',
				type: 'column',
				data: series.national
			},
			{
				name: 'В ин. валюте',
				type: 'column',
				data: series.foreign
			}
		],
		colors,
		chart: {
			height: 300,
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

interface ByCurrencyProps {
	series: ICANationalForeign
	categories: string[]
	title: string
	id: string
}

const ByCurrency: React.FC<ByCurrencyProps> = ({ series, categories = [], title, id }) => {
	useEffect(() => {
		if (categories.length) {
			document.querySelector(`#${id}`)!.innerHTML = ''
			renderOptions(series, categories, title, id)
		}
	}, [id, title, series, categories])
	return (
		<Card>
			<div id={`${id}`} />
		</Card>
	)
}

export default ByCurrency
