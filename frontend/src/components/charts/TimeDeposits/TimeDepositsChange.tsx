import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import { chartTitle, chartTooltip, formatNumber } from '../../../utils'

async function renderOptions(series: any = []) {
  const labels = [
    'UZS',
    'USD',
    'EUR'
  ]
  const colors = [
    '#4CB9E1',
    '#f38003',
    '#00B050'
  ]
  const options = {
    title: {
      ...chartTitle('Динамика изменений на начало месяца (экв. млн. сум)')
    },
    colors,
    series: [{
      name: 'Значение',
      data: series.map((v: number) => +(+v/Math.pow(10, 6)).toFixed())
    }],
    tooltip: { ...chartTooltip() },
    labels,
    chart: {
      height: 340,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '70%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        return formatNumber(val)
      },
      textAnchor: 'middle',
      offsetY: 20,
      style: {
        fontSize: '14px',
        colors: ['#000']
      }
    },
    fill: {
      colors
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

  const chart = new ApexCharts(
      document.querySelector('#time_deposits_change'),
      options
  )
  await chart.render()
  return chart
}

interface TimeDepositsChangeProps {
    series: any
}

const TimeDepositsChange: React.FC<TimeDepositsChangeProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#time_deposits_change')!.innerHTML=''
            renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='time_deposits_change'/>
      </CardContent>
    </Card>
  )
}

export default TimeDepositsChange
