import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTitle, formatNumber } from '../../../utils'

function renderOptions(values: any, categories: any) {
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
			formatter: function (val: number, opt: any) {
				return formatNumber(val)
			},
			background: {
				enabled: true
			},
			style: {
				colors: ['#666']
			},
			offsetX: 0,
			dropShadow: {
				enabled: false,
				top: 1,
				left: 1,
				blur: 1,
				color: '#000',
				opacity: 0.45
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
			...chartTitle('Прогноз суммы отклонения(дефицита) ВЛА в национальной валюте')
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

	const chart = new ApexCharts(document.querySelector('#national_curreny_chart'), options)
	chart.render()
}

interface NationalCurrencyChartProps {
	series: any
	categories: any
}

const NationalCurrencyChart: React.FC<NationalCurrencyChartProps> = ({ series = [], categories = [] }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#national_curreny_chart')!.innerHTML = ''
			renderOptions(series, categories)
		}
	}, [series, categories])
	return (
		<Card style={{ width: '49%', height: '218px' }}>
			<CardContent style={{ padding: '0' }}>
				<div id="national_curreny_chart" />
			</CardContent>
		</Card>
	)
} /* Сумма отклонения(дефицит) на конец месяца (Нац.вал. (UZS)) */

export default NationalCurrencyChart
