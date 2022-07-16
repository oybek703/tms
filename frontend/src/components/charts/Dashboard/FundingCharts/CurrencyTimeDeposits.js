import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'
import {CardContent} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import {chartSubtitle, chartTitle, chartTooltip, formatChartLegend} from '../../../../utils'

function renderOptions(values) {
    const colors = [
        '#4CB9E1',
        '#f38003',
        '#00B050'
    ]
    const labels = ['UZS', 'USD', 'EUR']
    const options = {
        title: {
            ...chartTitle('Срочные депозиты по валютам')
        },
        subtitle: {
            ...chartSubtitle()
        },
        tooltip: {...chartTooltip()},
        series: values.map(v => Number(v)),
        colors,
        chart: {
            type: 'pie',
            height: 350
        },
        labels,
        fill: {
            colors
        },
        legend: {
            show: true,
            formatter: function(label, opts) {
                return formatChartLegend(label, opts)
            },
            showForSingleSeries: true,
            position: 'bottom',
            customLegendItems: labels,
            horizontalAlign: 'left',
            fontSize: 17,
            markers: {
                fillColors: colors
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: 14
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    const chart = new ApexCharts(document.querySelector("#currency_time_deposits"), options)
    chart.render()
}

const CurrencyTimeDeposits = ({series = []}) => {
    useEffect(() => {
        if(series.length) {
            document.querySelector('#currency_time_deposits').innerHTML=''
            renderOptions(series)
        }
    }, [series])
    return (
        <Card>
            <CardContent>
                <div id='currency_time_deposits'/>
            </CardContent>
        </Card>
    )
}

export default CurrencyTimeDeposits