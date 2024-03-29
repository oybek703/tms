import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { IL_ID } from '../../../../constants'

function createLabels(id: string) {
	const totalName = `Итого ${id === 'lcr' ? 'LCR' : id === 'nsfr' ? 'NSFR' : id === IL_ID ? 'МЛ' : 'ВЛА'}`
	const nationalName = `Нац. вал ${id === 'lcr' ? 'LCR' : id === 'nsfr' ? 'NSFR' : 'ВЛА'}`
	const foreignName = `Ин. вал ${id === 'lcr' ? 'LCR' : id === 'nsfr' ? 'NSFR' : 'ВЛА'}`
	const normativeName = 'Норматив'
	return { normativeName, totalName, nationalName, foreignName }
}

async function renderOptions(series: any, categories: any, id: string, normative: number = 100) {
	const { normativeName, totalName, nationalName, foreignName } = createLabels(id)
	const { total = [], nat = [], foreign = [] } = series
	const all = [...total, ...nat, ...foreign]
	let max = 0
	for (const val of all) {
		if (val > max) max = val
	}
	let seriesData = [
		{
			name: normativeName,
			data: new Array(categories.length).fill(normative)
		},
		{
			name: totalName,
			data: total
		},
		{
			name: nationalName,
			data: nat
		},
		{
			name: foreignName,
			data: foreign
		}
	]
	if (id === IL_ID) {
		seriesData = seriesData.filter((_, index) => index < 2)
	}
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
			},
			events: {
				legendClick: function (chartContext: any, seriesIndex: any, config: any) {
					const { series = [] } = config.config
					const selectedSeriesItemName = series[seriesIndex].name
					if (selectedSeriesItemName !== normativeName) {
						chartContext.toggleSeries(selectedSeriesItemName)
					}
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
		colors: ['#ff6363', '#00B050', '#4CB9E1', '#f38003'],
		dataLabels: {
			enabled: true,
			offsetX: -5,
			offsetY: -10
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
			categories
		},
		yaxis: {
			min: normative,
			max: id === IL_ID ? max + 80 : max,
			labels: {
				formatter: function (val: number) {
					return (val || 0).toFixed(0)
				}
			}
		}
	}
	const chart = new ApexCharts(document.querySelector(`#${id}`), options)
	await chart.render()
	setTimeout(function () {
		chart.hideSeries(nationalName)
		chart.hideSeries(foreignName)
	}, 100)
}

interface LiquidityPointsProps {
	id: string
	data: any
	normative?: number
}

const LiquidityPoints: React.FC<LiquidityPointsProps> = ({ id = '', data = {}, normative = 100 }) => {
	useEffect(() => {
		;(async function () {
			if (data.total && data.total.length) {
				document.querySelector(`#${id}`)!.innerHTML = ''
				await renderOptions(data, data.categories, id, normative)
			}
		})()
		//    eslint-disable-next-line
    }, [data, id])
	return <div id={`${id}`} className="apex-charts" />
}

export default LiquidityPoints
