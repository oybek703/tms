import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import { CardContent } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import { chartSubtitle, chartTitle, chartTooltip, formatChartLegend } from '../../../../../utils'

function renderOptions(series: any) {
  const colors = [
    '#4CB9E1',
    '#00B050',
    '#f38003'
  ]
  const labels = ['NPL', 'Просрочка', 'Стандарт.']
  const options = {
    title: {
      ...chartTitle('Качество КП')
    },
    subtitle: {
      ...chartSubtitle('млн. сум')
    },
    tooltip: { ...chartTooltip() },
    series: series.map(Number),
    chart: {
      type: 'pie',
      height: 530
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
      fontSize: 14,
      customLegendItems: labels,
      markers: {
        fillColors: colors
      },
      itemMargin: {
        vertical: 15
      }
    },
    fill: {
      colors
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: 15
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

  const chart = new ApexCharts(document.querySelector('#credit_portfolio'), options)
  chart.render()
}

interface CreditPortfolioProps {
    series: any
}

const CreditPortfolio: React.FC<CreditPortfolioProps> = ({ series = [] }) => {
  useEffect(() => {
    if (series.length) {
            document.querySelector('#credit_portfolio')!.innerHTML = ''
            renderOptions(series)
    }
  }, [series])
  return (
    <Card>
      <CardContent>
        <div id='credit_portfolio'/>
      </CardContent>
    </Card>
  )
}

export default CreditPortfolio
