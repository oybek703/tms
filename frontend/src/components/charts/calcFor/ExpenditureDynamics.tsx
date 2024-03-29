import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTooltip, formatNumber } from '../../../utils'

function renderOptions(values: any, categories: any) {
	const options = {
		series: [
			{
				name: 'Значение',
				data: values.map((v: number) => +v.toFixed(2)).map((v: number) => (v === 0 ? null : v))
			}
		],
		chart: {
			height: 350,
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		tooltip: { ...chartTooltip() },
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'straight'
		},
		title: {
			text: 'Динамика перерасхода по ФОР',
			align: 'center',
			style: {
				fontWeight: 100,
				fontSize: 19
			}
		},
		grid: {
			row: {
				colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
				opacity: 0.5
			}
		},
		xaxis: {
			labels: {
				rotate: -45,
				rotateAlways: true
			},
			categories
		},
		yaxis: {
			labels: {
				formatter: function (val: number) {
					return formatNumber(val)
				}
			}
		}
	}

	const chart = new ApexCharts(document.querySelector('#expenditure_dynamics'), options)
	chart.render()
}

interface ExpenditureDynamicsProps {
	series: any
	categories: any
}

const ExpenditureDynamics: React.FC<ExpenditureDynamicsProps> = ({ series = [], categories = [] }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#expenditure_dynamics')!.innerHTML = ''
			renderOptions(series, categories)
		}
	}, [series, categories])
	return (
		<Card>
			<CardContent>
				<div id="expenditure_dynamics" />
			</CardContent>
		</Card>
	)
} /* Динамика перерасхода по ФОР */

export default ExpenditureDynamics
