import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'
import {chartSubtitle} from '../../../../utils'
import Paper from '@material-ui/core/Paper'

async function renderOptions(series = []) {
    const colors = [
        '#4CB9E1'
    ]
    const labels = [
        'USD',
        'EUR',
        'JPY',
        'GBP',
        'KZT',
        'RUB',
        'CHF',
        'CNY'
    ]
    const options = {
        series: [{
            name: 'Value:',
            data: series.map(v => +v)
        }],
        subtitle: {
            ...chartSubtitle('млн')
        },
        labels,
        chart: {
            height: 365,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        colors,
        plotOptions: {
            bar: {
                columnWidth: '70%',
                distributed: true,
                horizontal: true
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                colors: ['#000']
            }
        },
        legend: {
            show: false
        },
        xaxis: {
            categories: labels,
            labels: {
                style: {
                    colors: ['#000'],
                    fontSize: '15px'
                }
            }
        }
    }

    const chart = new ApexCharts(document.querySelector("#curr_post_chart"), options)
    await chart.render()
    return chart
}

const CurrencyPositionChart = ({series = []}) => {
    useEffect(() => {
        (async function () {
            if (series.length) {
                document.querySelector('#curr_post_chart').innerHTML = ''
                await renderOptions(series)
            }
        })()
    }, [series])
    return (
        <Paper>
            <div id='curr_post_chart'/>
        </Paper>
    )
}

export default CurrencyPositionChart