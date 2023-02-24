import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { chartTooltip, formatChartLegend } from '../../../../utils'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'

function renderOptions(series: any, categories: any) {
	const colors = ['#4CB9E1', '#f38003', '#00B050', '#ff6363', '#546e7a', '#a19a8b']
	const options = {
		title: {
			text: 'Привлеченные средства "АО Асакабанк" (млрд.сум)',
			align: 'center',
			style: {
				fontSize: 22
			}
		},
		series,
		dataLabels: {
			enabled: true,
			style: {
				fontSize: 15,
				colors: ['#666']
			},
			background: {
				enabled: true
			}
		},
		tooltip: { ...chartTooltip() },
		chart: {
			type: 'pie',
			height: 700
		},
		plotOptions: {
			pie: {
				dataLabels: {
					minAngleToShowLabel: 0
				}
			}
		},
		labels: categories,
		responsive: [
			{
				breakpoint: 720,
				options: {
					chart: {
						width: 200
					},
					legend: {
						horizontalAlign: 'center'
					}
				}
			}
		],
		legend: {
			show: true,
			formatter: function (label: string, opts: any) {
				return formatChartLegend(label, opts)
			},
			horizontalAlign: 'left',
			position: 'bottom',
			fontSize: 20,
			markers: {
				fillColors: colors
			},
			itemMargin: {
				vertical: 10
			}
		},
		colors
	}

	const chart = new ApexCharts(document.querySelector('#involved_funds'), options)
	chart.render()
}

interface InvolvedFundsProps {
	series: any
	categories: any
}

const InvolvedFunds: React.FC<InvolvedFundsProps> = ({ series = [], categories = [] }) => {
	useEffect(() => {
		if (series.length && categories.length > 1) {
			document.querySelector('#involved_funds')!.innerHTML = ''
			renderOptions(series, categories)
		}
	}, [series, categories])
	return (
		<Card>
			<CardContent>
				<div id="involved_funds" />
			</CardContent>
		</Card>
	)
}

export default InvolvedFunds
