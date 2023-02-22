import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTooltip, formatNumber } from '../../../../utils'

function renderOptions(values: any, categories: any, cbNormative: number) {
	const options = {
		series: [
			{
				name: 'Остаток на корсчете',
				data: values.map((v: number) => (v === 0 ? null : v))
			},
			{
				name: 'Норматив ЦБ',
				data: values.map((v: number) => cbNormative)
			}
		],
		colors: ['#00B050', '#ff6363'],
		chart: {
			type: 'area',
			height: 450,
			toolbar: {
				show: false
			}
		},
		tooltip: { ...chartTooltip() },
		stroke: {
			curve: 'straight'
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: true,
			onItemHover: {
				highlightDataSeries: true
			}
		},
		title: {
			text: 'Отклонение от норматива ЦБ',
			align: 'center',
			style: {
				fontWeight: 100,
				fontSize: 19
			}
		},
		markers: {
			hover: {
				sizeOffset: 4
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

	const chart = new ApexCharts(document.querySelector('#deviation'), options)
	chart.render()
}

interface DeviationProps {
	series: any
	categories: any
	cbNormative: number
}

const Deviation: React.FC<DeviationProps> = ({ series = [], categories = [], cbNormative }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#deviation')!.innerHTML = ''
			renderOptions(series, categories, cbNormative)
		}
	}, [cbNormative, series, categories])
	return (
		<Card>
			<CardContent>
				<div id="deviation" />
			</CardContent>
		</Card>
	)
} /* Отклонение от норматива ЦБ  */

export default Deviation
