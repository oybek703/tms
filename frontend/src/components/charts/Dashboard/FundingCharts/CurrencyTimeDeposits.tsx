import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@mui/material'
import Card from '@mui/material/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: any) {
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
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
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

  const chart = new ApexCharts(document.querySelector('#currency_time_deposits'), options)
  chart.render()
}

interface CurrencyTimeDepositsProps {
    series: any
}

const CurrencyTimeDeposits: React.FC<CurrencyTimeDepositsProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#currency_time_deposits')!.innerHTML=''
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
