import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import {
  chartSubtitle,
  chartTitle,
  chartTooltip,
  formatChartLegend
} from '../../../../../utils'

function renderOptions(series: any = []) {
  const colors = [
    '#f38003',
    '#4CB9E1'
  ]
  const labels = ['Краткосрочный', 'Долгосрочный']
  const options = {
    title: {
      ...chartTitle('Разбивка КП по срокам')
    },
    subtitle: {
      ...chartSubtitle('млн. сум')
    },
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
    colors,
    chart: {
      type: 'pie',
      height: 530
    },
    labels,
    legend: {
      formatter: function(label: string, opts: any) {
        return formatChartLegend(label, opts)
      },
      horizontalAlign: 'left',
      fontSize: 15,
      show: true,
      showForSingleSeries: true,
      position: 'bottom',
      customLegendItems: labels,
      markers: {
        fillColors: colors
      },
      itemMargin: {
        horizontal: 20,
        vertical: 15
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
    responsive: [
      {
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

  const chart = new ApexCharts(document.querySelector('#cp_breakdown'), options)
  chart.render()
}

interface CPBreakdownProps {
  series: any
}

const CPBreakdown: React.FC<CPBreakdownProps> = ({ series }) => {
  useEffect(() => {
    if (series.length) {
      document.querySelector('#cp_breakdown')!.innerHTML = ''
      renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='cp_breakdown'/>
      </CardContent>
    </Card>
  )
}

export default CPBreakdown
