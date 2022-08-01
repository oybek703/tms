import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: any) {
  const colors = [
    '#4CB9E1',
    '#f38003'
  ]
  const labels = ['прив.', 'разм.']

  const options = {
    title: {
      ...chartTitle('Межбанковские депозиты')
    },
    subtitle: {
      ...chartSubtitle('млрд.сум')
    },
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
    labels,
    colors,
    chart: {
      type: 'pie',
      height: 390
    },
    legend: {
      show: true,
      formatter: function(label: string, opts: any) {
        return formatChartLegend(label, opts)
      },
      position: 'bottom',
      horizontalAlign: 'left',
      showForSingleSeries: true,
      customLegendItems: labels,
      fontSize: 18,
      markers: {
        fillColors: colors
      }
    },
    fill: {
      colors
    },
    dataLabels: {
      show: true,
      style: {
        colors: ['#fff'],
        fontSize: 14
      }
    }
  }

  const chart = new ApexCharts(document.querySelector('#interbank_deposits'), options)
  chart.render()
}

interface InterbankDepositsChartProps {
    series: any
}

const InterbankDepositsChart: React.FC<InterbankDepositsChartProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#interbank_deposits')!.innerHTML=''
            renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='interbank_deposits'/>
      </CardContent>
    </Card>
  )
}

export default InterbankDepositsChart
