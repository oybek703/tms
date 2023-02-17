import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { IIncomePointData } from '../../../interfaces/IncomeAnalysis.interfaces'
import { Card, CardContent } from '@mui/material'
import { chartSubtitle, chartTitle, formatNumber } from '../../../utils'
import { number } from 'prop-types'

async function renderOptions(series: number[], categories: string[], id: string, title: string, color: string) {
	const options = {
		series: [
			{
				name: 'Значение',
				data: series
			}
		],
		title: {
			...chartTitle(title, { fontWeight: '600' })
		},
		subtitle: {
			...chartSubtitle('млн.')
		},
		chart: {
			height: 350,
			type: 'line',
			dropShadow: {
				enabled: true,
				color: '#000',
				top: 18,
				left: 7,
				blur: 10,
				opacity: 0.2
			},
			toolbar: {
				show: false
			},
			animations: {
				enabled: true,
				easing: 'linear',
				speed: 800,
				animateGradually: {
					enabled: false
				},
				dynamicAnimation: {
					enabled: true,
					speed: 50
				}
			}
		},
		legend: {
			horizontalAlign: 'left',
			onItemClick: {
				toggleDataSeries: false
			},
			onItemHover: {
				highlightDataSeries: true
			}
		},
		colors: [color],
		dataLabels: {
			enabled: true,
			offsetX: -5,
			offsetY: -10,
			formatter: function (value: number) {
				return formatNumber(value)
			}
		},
		stroke: {
			curve: 'smooth',
			width: 7
		},
		grid: {
			borderColor: '#e7e7e7',
			row: {
				colors: ['#f3f3f3', 'transparent'],
				opacity: 0.5
			}
		},
		markers: {
			size: 3
		},
		yaxis: {
			showAlways: false,
			labels: {
				show: true,
				formatter: (value: number) => formatNumber(value)
			}
		},
		xaxis: {
			categories
		}
	}
	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	await chart.render()
}

interface LiquidityPointsProps {
	id: string
	title: string
	color: string
	data: IIncomePointData[]
}

const IncomePoints: React.FC<LiquidityPointsProps> = ({ id, title, data, color }) => {
	useEffect(() => {
		;(async function () {
			if (data.length) {
				const series = data.map(({ saldo }) => saldo)
				const categories = data.map(({ monthName }) => monthName)
				document.querySelector(`#${id}`)!.innerHTML = ''
				await renderOptions(series, categories, id, title, color)
			}
		})()
		//    eslint-disable-next-line
    }, [data, id])
	return (
		<Card>
			<CardContent>
				<div id={`${id}`} className="apex-charts" />
			</CardContent>
		</Card>
	)
}

export default IncomePoints
