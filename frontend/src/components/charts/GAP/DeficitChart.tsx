import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core'

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
        columnWidth: '20%',
        distributed: true,
        dataLabels: {
          position: 'top' // top, center, bottom
        },
        height: 20
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    xaxis: {
      categories,
      tickPlacement: 'on'
    },
    title: {
      text: 'ПРОГНОЗ LCR',
      align: 'center',
      style: {
        fontWeight: 100,
        fontSize: 19
      }
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

interface DeficitChartProps {
  series: any
  categories: any
}

const DeficitChart: React.FC<DeficitChartProps> = ({ series = [], categories = [] }) => {
  useEffect(() => {
    if (series.length) {
      document.querySelector('#deficit_chart')!.innerHTML = ''
      renderOptions(series, categories)
    }
  }, [series, categories])
  return (
    <Card style={{ width: '49%' }}>
      <CardContent style={{ padding: '0' }}>
        <div id='deficit_chart'/>
      </CardContent>
    </Card>
  )
} /* Динамика корсчета по дням */

export default DeficitChart
