import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { formatNumber } from '../../../utils'

function renderOptions({ filialData, totalData, propertyName, categories, id }: IFEChartProps) {
	const seriesData: { name: string | null; data: number[] }[] = [
		{ name: 'Итого', data: categories.map(() => totalData) },
		{ name: propertyName || '__KEY__', data: filialData }
	]
	const options = {
		series: seriesData,
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
			horizontalAlign: 'center',
			onItemClick: {
				toggleDataSeries: false
			},
			onItemHover: {
				highlightDataSeries: true
			}
		},
		colors: ['#00B050', '#4CB9E1'],
		dataLabels: {
			enabled: true,
			offsetX: -5,
			offsetY: -10,
			formatter: function (val: number) {
				return formatNumber(val)
			}
		},
		stroke: {
			curve: 'smooth'
		},
		grid: {
			borderColor: '#e7e7e7',
			row: {
				colors: ['#f3f3f3', 'transparent'],
				opacity: 0.5
			}
		},
		markers: {
			size: 1
		},
		xaxis: {
			categories,
			min: 0,
			labels: {
				rotate: -45,
				rotateAlways: true
			}
		},
		yaxis: {
			max: totalData + totalData * 0.8,
			labels: {
				formatter: function (val: number) {
					return formatNumber(val)
				}
			}
		}
	}
	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	chart.render()
}

interface IFEChartProps {
	totalData: number
	filialData: number[]
	propertyName: string | null
	categories: string[]
	id: string
}

const FEChart: React.FC<IFEChartProps> = props => {
	useEffect(() => {
		if (props.filialData.length) {
			document.querySelector(`#${props.id}`)!.innerHTML = ''
			renderOptions(props)
		}
		//eslint-disable-next-line
  }, [props])
	return <div id={`${props.id}`} className="apex-charts" />
}

export default FEChart
