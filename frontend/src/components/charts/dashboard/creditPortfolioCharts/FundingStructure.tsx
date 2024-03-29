import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@mui/material'
import Card from '@mui/material/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: any) {
	const colors = ['#4CB9E1', '#f38003', '#00B050', '#ff6363']
	const labels = ['МБД', 'Сроч.депо', 'МФИ: Долг.', 'МФИ: Крат.']

	const options = {
		title: {
			...chartTitle('Структура фондирования')
		},
		subtitle: {
			...chartSubtitle('млрд.сум')
		},
		tooltip: { ...chartTooltip() },
		series: series.map(Number),
		colors,
		chart: {
			type: 'pie',
			height: 530
		},
		legend: {
			formatter: function (label: string, opts: any) {
				return formatChartLegend(label, opts)
			},
			show: true,
			position: 'bottom',
			horizontalAlign: 'left',
			fontSize: 14,
			customLegendItems: labels,
			markers: {
				fillColors: colors
			},
			itemMargin: {
				horizontal: 10,
				vertical: 6
			}
		},
		dataLabels: {
			enabled: true,
			style: {
				colors: ['#666']
			},
			background: {
				enabled: true
			}
		},
		labels,
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}
		]
	}

	const chart = new ApexCharts(document.querySelector('#funding_structure'), options)
	chart.render()
}

interface FundingStructureProps {
	series: any
}

const FundingStructure: React.FC<FundingStructureProps> = ({ series = [] }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#funding_structure')!.innerHTML = ''
			renderOptions(series)
		}
	}, [series])
	return (
		<Card>
			<CardContent>
				<div id="funding_structure" />
			</CardContent>
		</Card>
	)
}

export default FundingStructure
