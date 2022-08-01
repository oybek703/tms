import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@material-ui/core/Card'
import { formatNumber } from '../../../../utils'

async function renderOptions(series: any = [], categories: any = [], id: string = '', label: string, normative: number = 100) {
  const options = {
    series: [
      {
        name: 'Мин',
        data: new Array(categories.length).fill(normative)
      },
      {
        name: label,
        data: series
      }
    ],
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 800,
        animateGradually: {
          enabled: false
        },
        dynamicAnimation: {
          enabled: true,
          speed: 50
        }
      }
    },
    legend: {
      horizontalAlign: 'center'
    },
    colors: [
      '#ff6363',
      '#00B050'
    ],
    dataLabels: {
      enabled: true,
      offsetX: -5,
      offsetY: -10,
      formatter: function(val: number, opts: any) {
        return formatNumber(val)
      }
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      min: normative,
      labels: {
        formatter: function(val: number) {
          return (val || 0).toFixed(0)
        }
      }
    }
  }
  const chart = new ApexCharts(document.querySelector(`#${id}`), options)
  await chart.render()
}

interface CapitalPointsProps {
    id: string
    data: any
    label: string
    normative: number
}

const CapitalPoints: React.FC<CapitalPointsProps> = ({ id = '', data = {}, label = 'TEST', normative = 100 }) => {
  useEffect(() => {
    (async function() {
      if (data.series && data.series.length) {
                document.querySelector(`#${id}`)!.innerHTML = ''
                await renderOptions(data.series, data.categories, id, label, normative)
      }
    })()
  }, [data, id, normative, label])
  return (
    <Card>
      <div id={`${id}`} className="apex-charts"/>
    </Card>
  )
}

export default CapitalPoints
