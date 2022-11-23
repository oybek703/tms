import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { chartSubtitle, chartTooltip, formatChartLegend } from '../../../utils'

function renderOptions(values: any) {
	const colors = ['#f38003', '#00B050', '#ff6363', '#4CB9E1']

	const options = {
		title: {
			text: 'ОБЯЗАТЕЛЬСТВА АО "UZAUTO MOTORS" ПЕРЕД БАНКОМ',
			align: 'left'
		},
		subtitle: {
			...chartSubtitle('в номинале')
		},
		tooltip: { ...chartTooltip() },
		series: values,
		chart: {
			width: 600,
			type: 'pie',
			height: 280
		},
		dataLabels: {
			style: {
				colors: ['#666']
			},
			background: {
				enabled: true
			}
		},
		colors,
		labels: [
			'Аккредетив (USD)',
			'Аккредетив (EUR)',
			'Аккредетив (RUB)',
			'Непокрытый тек.(USD)',
			'Торговое финансирование'
		],
		fill: {
			colors
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
		],
		legend: {
			show: true,
			formatter: function (label: string, opts: any) {
				return formatChartLegend(label, opts)
			},
			position: 'left',
			fontSize: 15,
			maxWidth: 120,
			whiteSpace: 'wrap'
		}
	}

	const chart = new ApexCharts(document.querySelector('#gm_liablities'), options)
	chart.render()
}

interface GMLiabilitiesProps {
	series: any
}

const GMLiabilities: React.FC<GMLiabilitiesProps> = ({ series = [] }) => {
	useEffect(() => {
		if (series.length) {
			document.querySelector('#gm_liablities')!.innerHTML = ''
			renderOptions(series)
		}
	}, [series])
	return <div id="gm_liablities" />
}

export default GMLiabilities
