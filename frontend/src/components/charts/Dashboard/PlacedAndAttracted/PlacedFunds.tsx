import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { chartTooltip, formatChartLegend } from '../../../../utils'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'

function renderOptions(series: any, categories: any) {
  const colors = [
    '#4CB9E1',
    '#00B050',
    '#f38003',
    '#ff6363',
    '#546e7a',
    '#a19a8b'
  ]
  const options = {
    title: {
      text: 'Размещенные средства банка "Асака" (млрд.сум)',
      align: 'center',
      style: {
        fontSize: 22
      }
    },
    dataLabels: {
      style: {
        fontSize: 18
      }
    },
    tooltip: { ...chartTooltip() },
    series,
    chart: {
      type: 'pie',
      height: 700
    },
    plotOptions: {
      pie: {
        dataLabels: {
          minAngleToShowLabel: 0
        }
      }
    },
    labels: categories,
    responsive: [
      {
        breakpoint: 720,
        options: {
          chart: {
            width: 200
          },
          legend: {
            horizontalAlign: 'center'
          }
        }
      }],
    legend: {
      show: true,
      formatter: function(label: string, opts: any) {
        return formatChartLegend(label, opts)
      },
      horizontalAlign: 'left',
      position: 'bottom',
      fontSize: 20,
      itemMargin: {
        vertical: 10
      }
    },
    colors
  }

  const chart = new ApexCharts(document.querySelector('#placed_funds'), options)
  chart.render()
}

interface PlacedFundsProps {
  series: any
  categories: any
}

const PlacedFunds: React.FC<PlacedFundsProps> = ({ series = [], categories = [] }) => {
  useEffect(() => {
    if (series.length && categories.length > 1) {
      document.querySelector('#placed_funds')!.innerHTML = ''
      renderOptions(series, categories)
    }
  }, [series, categories])
  return (
    <Card>
      <CardContent>
        <div id='placed_funds'/>
      </CardContent>
    </Card>
  )
}

export default PlacedFunds
