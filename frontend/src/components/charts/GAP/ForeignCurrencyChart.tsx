import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import { chartTitle } from '../../../utils'

function renderOptions(values: any, categories: any) {
  const colors = [
    function({ value }: { value: number }) {
      if (value > 0) {
        return '#4CB9E1'
      } else {
        return '#ff6363'
      }
    }]
  const options = {
    series: [
      {
        name: 'Значение',
        data: values.map((v: number) => v === 0 ? null : v)
      }],
    colors,
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'center',
      showForSingleSeries: true,
      fontSize: 15,
      markers: {
        fillColors: colors
      }
    },
    chart: {
      height: 210,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        distributed: true,
        dataLabels: {
          position: 'top' // top, center, bottom
        },
        height: 20
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      style: {
        colors: ['#666']
      },
      formatter: function(val: number, opt: any) {
        return val
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      },
      background: {
        enabled: true
      }
    },
    stroke: {
      curve: 'straight'
    },
    xaxis: {
      categories,
      tickPlacement: 'on'
    },
    title: {
      ...chartTitle('Прогноз суммы отклонения(дефицита) ВЛА в иностранной валюте')
    },
    yaxis: {
      labels: {
        formatter: function(val: number) {
          return `${val}`
        },
        style: {
          fontWeight: '100'
        }
      }
    }
  }

  const chart = new ApexCharts(document.querySelector('#deficit_chart'),
      options)
  chart.render()
}

interface ForeignCurrencyChartProps {
  series: any
  categories: any
}

const ForeignCurrencyChart: React.FC<ForeignCurrencyChartProps> = ({ series = [], categories = [] }) => {
  useEffect(() => {
    if (series.length) {
      document.querySelector('#deficit_chart')!.innerHTML = ''
      renderOptions(series, categories)
    }
  }, [series, categories])
  return (
    <Card style={{ width: '49%', height: '218px' }}>
      <CardContent style={{ padding: '0' }}>
        <div id='deficit_chart'/>
      </CardContent>
    </Card>
  )
} /* Сумма отклонения(дефицит) на конец месяца (Ин.вал. (USD екв.)) */

export default ForeignCurrencyChart
