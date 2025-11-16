<template>
  <MapMainDistrictPopulationChart
    v-if="populationForSelectedDistrict !== 'no-data'"
    :district-name="feature.properties.linnaosa_nimi.split(' ')[0]"
    :data-by-year="populationForSelectedDistrict"
    />
</template>

<script lang="ts" setup>
import type { MapGeoJSONFeature } from 'maplibre-gl'

interface Props {
  feature: MapGeoJSONFeature;
}
const props = defineProps<Props>()


// https://andmed.stat.ee/en/stat/rahvastik__rahvastikunaitajad-ja-koosseis__rahvaarv-ja-rahvastiku-koosseis/RV0240/table/tableViewLayout2
const populationRequestJson = {
  "query": [
    {
      "code": "Elukoht",
      "selection": {
        "filter": "item",
        "values": [
          "176",
          "298",
          "339",
          "387",
          "482",
          "524",
          "596",
          "614"
        ]
      }
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}

onMounted(() => {
  fetchPopulationData()
})

const populationData = ref([])
const populationForSelectedDistrict = computed(() => {
  if (!populationData.value || populationData.value.length === 0) {
    return 'no-data'
  }

  const districtName = props.feature.properties.linnaosa_nimi.split(' ')[0] as string;
  const dataset = populationData.value as any;
  const values = populationData.value.value
  const years = Object.keys(dataset.dimension.Aasta.category.index); // ["2015","2016",...]
  const yearCount = years.length;

  // 1) Find district index (0–7)
  const labels = dataset.dimension.Elukoht.category.label;
  const indices = dataset.dimension.Elukoht.category.index;

  // Find the key whose label contains the district name
  let districtKey = null;
  for (const key in labels) {
    if (labels[key].toLowerCase().includes(districtName.toLowerCase().substring(0, 5))) {
      districtKey = key;
      break;
    }
  }

  if (districtKey === null) {
    throw new Error(`District "${districtName}" not found.`);
  }

  const districtIndex = indices[districtKey];

  // 2) Extract values for that district
  const result = {};
  for (let i = 0; i < yearCount; i++) {
    const year = years[i];
    const valueIndex = districtIndex * yearCount + i;
    result[year] = values[valueIndex];
  }

  return result;
});


const fetchPopulationData = async () => {
  const res = await fetch(`https://andmed.stat.ee/api/v1/en/stat/RV0240`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(populationRequestJson)
  })
  const data = await res.json();

  populationData.value = data
}

</script>