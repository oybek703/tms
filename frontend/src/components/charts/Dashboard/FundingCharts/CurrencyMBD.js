import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'
import {CardContent} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import {chartSubtitle, chartTitle, chartTooltip, formatChartLegend} from '../../../../utils'

function renderOptions(values) {
    const colors = [
        '#4CB9E1',
        '#f38003',
        '#00B050',
    ]
    const labels = ['UZS', 'USD', 'EUR']
    const options = {
        title: {
            ...chartTitle('МБД по валютам')
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
        legend: {
            formatter: function(label, opts) {
                return formatChartLegend(label, opts)
            },
            show: true,
            showForSingleSeries: true,
            position: 'bottom',
            horizontalAlign: 'left',
            fontSize: 17,
            customLegendItems: labels,
            markers: {
                fillColors: colors
            }
        },
        fill: {
            colors
        },
        dataLabels: {
            enabled: true
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

    const chart = new ApexCharts(document.querySelector("#currency_mbd"), options)
    chart.render()
}

const CurrencyMBD = ({series = []}) => {
    useEffect(() => {
        if(series.length) {
            document.querySelector('#currency_mbd').innerHTML=''
            renderOptions(series)
        }
    }, [series])
    return (
        <Card>
            <CardContent>
                <div id='currency_mbd'/>
            </CardContent>
        </Card>
    )
}

export default CurrencyMBD