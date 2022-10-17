import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTitle, formatNumber } from '../../../utils'

function renderOptions(values: any, categories: any, title: string, id: string) {
	const colors = [
		function ({ value }: { value: number }) {
			if (value > 0) {
				return '#4CB9E1'
			} else {
				return '#ff6363'
			}
		}
	]
	const options = {
		series: [
			{
				name: 'Значение',
				data: values.map((v: number) => (v === 0 ? null : v))
			}
		],
		colors,
		legend: {
			show: false,
			position: 'bottom',
			horizontalAlign: 'center',
			showForSingleSeries: true,
			fontSize: 15,
			markers: {
				fillColors: colors
			}
		},
		chart: {
			height: 210,
			type: 'bar',
			toolbar: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				columnWidth: '40%',
				distributed: true,
				dataLabels: {
					position: 'top' // top, center, bottom
				},
				height: 20
			}
		},
		dataLabels: {
			enabled: true,
			textAnchor: 'middle',
			style: {
				colors: ['#666']
			},
			formatter: function (val: number, opt: any) {
				return formatNumber(val)
			},
			offsetX: 0,
			dropShadow: {
				enabled: true
			},
			background: {
				enabled: true
			}
		},
		stroke: {
			curve: 'straight'
		},
		xaxis: {
			categories,
			tickPlacement: 'on'
		},
		title: {
			...chartTitle(title)
		},
		yaxis: {
			labels: {
				formatter: function (val: number) {
					return `${val}`
				},
				style: {
					fontWeight: '100'
				}
			}
		}
	}

	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	chart.render()
}

interface ForeignCurrencyChartProps {
	series: any
	categories: any
	title: string
	id: string
}

const DeficitChart: React.FC<ForeignCurrencyChartProps> = ({ series = [], categories = [], title, id }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector(`#${id}`)!.innerHTML = ''
			renderOptions(series, categories, title, id)
		}
	}, [id, title, series, categories])
	return (
		<Card>
			<CardContent sx={{ padding: '10px 5px 0px 5px', maxHeight: 185 }}>
				<div id={`${id}`} />
			</CardContent>
		</Card>
	)
}

export default DeficitChart
