import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'
import { chartTooltip, formatNumber } from '../../../../utils'

async function renderOptions(series = [], categories = [], id = '') {
    const options = {
        series: [
            {
                name: 'Значение',
                data: series.map(value => +value.toFixed(2))
            }
        ],
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
        tooltip: {...chartTooltip()},
        legend: {
            horizontalAlign: 'center'
        },
        colors: [
            '#00B050'
        ],
        dataLabels: {
            enabled: true,
            offsetX: -5,
            offsetY: -10,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return formatNumber(value)
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
            },
        },
        markers: {
            size: 2
        },
        xaxis: {
            categories: categories
        },
        yaxis: {
            labels: {
                formatter: function(val) {
                    return (val || 0).toFixed(0)
                }
            }
        }
    }
    const chart = new ApexCharts(document.querySelector(`#${id}`), options)
    await chart.render()
}

const CurrencyLineChart = ({id = '', data = {}, normative = 100}) => {
    useEffect(() => {
        (async function () {
            if (data.series && data.series.length) {
                document.querySelector(`#${id}`).innerHTML = ''
                await renderOptions(data.series, data.categories, id, normative)
            }
        })()
    }, [data, id, normative])
    return (
            <div id={`${id}`} className="apex-charts"/>
    )
}

export default CurrencyLineChart