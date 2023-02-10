import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@mui/material'
import Card from '@mui/material/Card'
import { chartTooltip } from '../../../utils'

function renderOptions(series: number[], labelText = 'ALL') {
	const colors = ['#4CB9E1', '#00B050']
	const options = {
		tooltip: { ...chartTooltip() },
		series,
		colors,
		chart: {
			type: 'donut',
			height: 350
		},
		legend: {
			show: false
		},
		fill: {
			colors
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: false,
							label: labelText,
							fontSize: '45px',
							fontWeight: 550,
							formatter: () => ''
						}
					}
				}
			}
		},
		dataLabels: {
			enabled: true,
			offsetX: 50,
			offsetY: 50
		},
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

	const chart = new ApexCharts(document.querySelector('#vla_buffer'), options)
	chart.render()
}

interface CurrencyMFIProps {
	series: number[]
	labelText?: string
}

const VlaBufferChart: React.FC<CurrencyMFIProps> = ({ series, labelText }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#vla_buffer')!.innerHTML = ''
			renderOptions(series, labelText)
		}
	}, [series, labelText])
	return (
		<Card>
			<CardContent>
				<div id="vla_buffer" />
			</CardContent>
		</Card>
	)
}

export default VlaBufferChart
