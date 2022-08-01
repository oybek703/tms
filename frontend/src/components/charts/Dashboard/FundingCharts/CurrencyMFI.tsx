import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: any) {
  const colors = [
    '#4CB9E1',
    '#f38003',
    '#00B050',
    '#ff6363'
  ]
  const labels = ['UZS', 'USD', 'EUR', 'JPY']
  const options = {
    title: {
      ...chartTitle('МФИ по валютам')
    },
    subtitle: {
      ...chartSubtitle()
    },
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
    colors,
    chart: {
      type: 'pie',
      height: 350
    },
    labels,
    legend: {
      show: true,
      formatter: function(label: string, opts: any) {
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
    fill: {
      colors
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

  const chart = new ApexCharts(document.querySelector('#currency_mfi'), options)
  chart.render()
}

interface CurrencyMFIProps {
    series: any
}

const CurrencyMFI: React.FC<CurrencyMFIProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#currency_mfi')!.innerHTML=''
            renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='currency_mfi'/>
      </CardContent>
    </Card>
  )
}

export default CurrencyMFI
