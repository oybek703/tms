import React, {useEffect} from 'react'
import ApexCharts from 'apexcharts'
import Card from "@material-ui/core/Card"
import {CardContent} from "@material-ui/core"
import { chartTooltip, formatNumber } from '../../../../utils'

function renderOptions(values, categories) {
    const labels = ['Динамика корсчета по дням']
    const colors = ['#4CB9E1']
    const options = {
        series: [{
            name: 'Значение',
            data: values.map(v => v === 0 ? null: v)
        }],
        colors,
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',
            showForSingleSeries: true,
            customLegendItems: labels,
            fontSize: 15,
            markers: {
                fillColors: colors
            }
        },
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '30%',
                distributed: true,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
                height: 20
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight',
        },
        xaxis: {
            labels: {
                rotate: -45,
                rotateAlways: true
            },
            categories,
            tickPlacement: 'on'
        },
        title: {
            text: 'Динамика корсчета по дням',
            align: 'center',
            style: {
                fontWeight: 100,
                fontSize: 19
            }
        },
        tooltip: {...chartTooltip()},
        yaxis: {
            labels: {
                formatter: function (val) {
                    return formatNumber(val)
                }
            }
        }
    }

    const chart = new ApexCharts(document.querySelector("#correspondent_dynamics"), options)
    chart.render()
}

const CorrespondentDynamics = ({series = [], categories = []}) => {
    useEffect(() => {
        if(series.length) {
            document.querySelector('#correspondent_dynamics').innerHTML=''
            renderOptions(series, categories)
        }
    }, [series, categories])
    return (
        <Card>
            <CardContent>
                <div id='correspondent_dynamics'/>
            </CardContent>
        </Card>
    )
} /* Динамика корсчета по дням */

export default CorrespondentDynamics