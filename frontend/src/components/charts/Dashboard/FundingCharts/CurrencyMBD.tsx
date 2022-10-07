import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@mui/material'
import Card from '@mui/material/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: string[]) {
  const colors = [
    '#4CB9E1',
    '#f38003',
    '#00B050'
  ]
  const labels = ['UZS', 'USD']
  if (+series[2] !== 0) labels.push('EUR')
  const options = {
    title: {
      ...chartTitle('МБД по валютам')
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
      formatter: function(label: string, opts: any) {
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
      enabled: true,
      style: {
        colors: ['#666']
      },
      background: {
        enabled: true
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

  const chart = new ApexCharts(document.querySelector('#currency_mbd'), options)
  chart.render()
}

interface CurrencyMBDProps {
    series: string[]
}

const CurrencyMBD: React.FC<CurrencyMBDProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#currency_mbd')!.innerHTML=''
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
