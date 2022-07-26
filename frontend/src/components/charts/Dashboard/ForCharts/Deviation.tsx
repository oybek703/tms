import React, { useEffect } from 'react'
import ApexCharts from 'apexcharts'
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core'
import { chartTooltip, formatNumber } from '../../../../utils'

function renderOptions(values: any, categories: any) {
  const options = {
    series: [{
      name: 'Значение:',
      data: values.map((v: number) => v === 0 ? null: v),
    },
    {
      name: 'Значение:',
      data: values.map((v: number) => v === 0 ? null: v).filter(Boolean).map((v: number) => 0),
    },
    ],
    colors: ['#00B050', '#ff6363'],
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    tooltip: { ...chartTooltip() },
    stroke: {
      curve: 'straight',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    title: {
      text: 'Отклонение от норматива ЦБ',
      align: 'center',
      style: {
        fontWeight: 100,
        fontSize: 19,
      },
    },
    markers: {
      hover: {
        sizeOffset: 4,
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
      categories,
    },
    yaxis: {
      labels: {
        formatter: function(val: number) {
          return formatNumber(val)
        },
      },
    },
  }

  const chart = new ApexCharts(document.querySelector('#deviation'), options)
  chart.render()
}

interface DeviationProps {
  series: any
  categories: any
}

const Deviation: React.FC<DeviationProps> = ({ series = [], categories = [] }) => {
  useEffect(() => {
    if (series.length) {
      document.querySelector('#deviation')!.innerHTML=''
      renderOptions(series, categories)
    }
  }, [series, categories])
  return (
    <Card>
      <CardContent>
        <div id='deviation'/>
      </CardContent>
    </Card>
  )
} /* Отклонение от норматива ЦБ  */

export default Deviation
