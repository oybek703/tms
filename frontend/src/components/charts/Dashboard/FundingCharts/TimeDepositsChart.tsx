import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../utils'

function renderOptions(series: any) {
  const colors = [
    '#4CB9E1',
    '#f38003',
  ]
  const labels = ['иностр.вал', 'нац.вал']
  const options = {
    title: {
      ...chartTitle('Срочные депозиты'),
    },
    subtitle: {
      ...chartSubtitle(),
    },
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
    labels,
    colors,
    chart: {
      type: 'pie',
      height: 390,
    },
    legend: {
      show: true,
      formatter: function(label: string, opts: any) {
        return formatChartLegend(label, opts)
      },
      position: 'bottom',
      showForSingleSeries: true,
      customLegendItems: labels,
      horizontalAlign: 'left',
      fontSize: 18,
      markers: {
        fillColors: colors,
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    dataLabels: {
      show: true,
      style: {
        colors: ['#fff'],
        fontSize: 14,
      },
    },
  }

  const chart = new ApexCharts(
      document.querySelector('#time_deposits'),
      options,
  )
  chart.render()
}

interface TimeDepositsChartProps {
    series: any
}

const TimeDepositsChart: React.FC<TimeDepositsChartProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#time_deposits')!.innerHTML=''
            renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='time_deposits'/>
      </CardContent>
    </Card>
  )
}

export default TimeDepositsChart
