<template>
  <div class="w-full h-72 mx-4">
    <div class="mb-2">Age distribution</div>
    <v-chart :option="option" autoresize />
  </div>
</template>

<script lang="ts" setup>
import { PieChart } from 'echarts/charts';
import { LegendComponent } from 'echarts/components';
import { use } from 'echarts/core';
import VChart from 'vue-echarts'
import { getAgeDistributionData } from '~/lib/services/AgeDistributionService';

const data = await getAgeDistributionData()
const dataAsOptions = Object.entries(data).map(([key, value]) => ({
  name: key,
  value
}))
const totalPopulation = computed(() => Object.values(data).reduce((a, b) => a + b, 0));


use([
  PieChart,
  LegendComponent,
])

const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '0',
    left: '0',
    innerWidth: '50%',
    itemStyle: {
      display: 'block',
    },
    height: '120px',
    orient: 'vertical',
    textStyle: {
      color: '#fff',
        rich: {
        name:  { width: 260, align: 'left'  },
        value: { width: 60,  align: 'right' },
      },
    },
    formatter: (name: string) => {
      const v = valuesByName.get(name);
      const percentValue = ((v ?? 0) / totalPopulation.value * 100).toFixed(1);
      return `{name|${name.charAt(0).toUpperCase() + name.slice(1)}}{value|${percentValue ?? '' + '%'}}`;
    },
  },
  series: [
    {
      name: 'Age Distribution',
      type: 'pie',
      radius: ['60%', '35%'],
      center: ['50%', '30%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: dataAsOptions,
    }
  ]
};

const valuesByName = new Map([
  [ 'Children', data.Children ],
  [ 'Teens', data.Teens ],
  [ 'Adults', data.Adults ],
  [ 'Seniors', data.Seniors ],
]);


</script>