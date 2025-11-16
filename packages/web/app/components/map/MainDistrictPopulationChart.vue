<template>
  <div class="w-full h-20">
    <div class="ml-3 mb-2">Population</div>
    <v-chart :option="option" autoresize />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
// import 'echarts/lib/chart/line' etc. depending on how you set it up

import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';

use([
  CanvasRenderer,
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LineChart,
])

const props = defineProps({
  districtName: { type: String, required: true },
  dataByYear: { type: Object, required: true } // { "2015": 42844, ... }
})

function buildPopulationOption(districtName: string, dataByYear: Record<string, number>) {
  const years = Object.keys(dataByYear).sort()
  const values = years.map(year => dataByYear[year])

  return {
    backgroundColor: 'transparent',
    
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      padding: 0,
      formatter(params) {
        const p = params[0]
        return `
          <div style="padding: 8px; color: white; background: #333; border-radius: 4px;">
            <div><b>${p.axisValueLabel}</b></div>
            <div>Population: ${p.value.toLocaleString('en-US')}</div>
          </div>
        `
      }
    },
    // grid: { left: '8%', right: '4%', top: 60, bottom: 40 },
    xAxis: {
      type: 'category',
      data: years,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#ccc' }
    },
    yAxis: {
      type: 'value',
      min: Math.min(...values) * 0.98,
      max: Math.max(...values) * 1.02,
      
      axisLine: { show: false },
      axisTick: { show: false },
      position: 'left',
      splitLine: false,
      // splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } },
      axisLabel: {
        color: '#ccc',
        formatter: (value: number, index: number) => index % 2 === 0 && Math.round(value) === value ? value.toLocaleString('en-US') : ''
      }
    },
    series: [
      {
        name: 'Population',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: values,
        lineStyle: { width: 1 },
        itemStyle: { borderWidth: 1 },
        areaStyle: { opacity: 0.15 }
      }
    ],
    color: ['#3b82f6']
  }
}

const option = computed(() =>
  buildPopulationOption(props.districtName, props.dataByYear)
)
</script>

<style scoped>
.w-full {
  width: 100%;
}
.h-80 {
  height: 20rem;
}
</style>