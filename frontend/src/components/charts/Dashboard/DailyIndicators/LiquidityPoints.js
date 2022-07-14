import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'

function createLabels(id) {
    const totalName = `Итого ${id === 'lcr' ?  'LCR' : id === 'nsfr' ? 'NSFR' : 'ВЛА'}`
    const nationalName = `Нац. вал ${id === 'lcr' ?  'LCR' : id === 'nsfr' ? 'NSFR' : 'ВЛА'}`
    const foreignName = `Ин. вал ${id === 'lcr' ?  'LCR' : id === 'nsfr' ? 'NSFR' : 'ВЛА'}`
    const normativeName = 'Норматив'
    return {normativeName, totalName, nationalName, foreignName}
}

async function renderOptions(series, categories, id, normative = 100) {
    const {normativeName, totalName, nationalName, foreignName} = createLabels(id)
    const {total = [], nat = [], foreign = []} = series
    const options = {
        series: [
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
            },
            events: {
                legendClick: function(chartContext, seriesIndex, config) {
                    const { series = [] } = config.config;
                    const selectedSeriesItemName = series[seriesIndex].name
                    if(selectedSeriesItemName !== normativeName) {
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
        colors: [
            '#ff6363',
            '#00B050',
            '#4CB9E1',
            '#f38003'
        ],
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
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: categories
        },
        yaxis: {
            min: normative,
            labels: {
                formatter: function(val) {
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

const LiquidityPoints = ({id = '', data = {}, normative = 100}) => {
    useEffect(() => {
        (async function () {
            if (data.total && data.total.length) {
                document.querySelector(`#${id}`).innerHTML = ''
                await renderOptions(data, data.categories, id, normative)
            }
        })()
    //    eslint-disable-next-line
    }, [data, id])
    return (
        <div id={`${id}`} className="apex-charts"/>
    )
}

export default LiquidityPoints