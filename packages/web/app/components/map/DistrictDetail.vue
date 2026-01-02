<template>
  <div class="absolute border border-gray-400 z-20 ml-12 mt-12 w-96 h-[80vh] rounded-xl bg-black/60 backdrop-blur-md">
    <div class="flex items-center px-4 py-4">
      <Icon class="absolute right-1 top-1 cursor-pointer text-white" name="material-symbols:close" size="24" @click="$emit('close')" />
      <img class="size-12" :src="flagForFeature(feature)" />
      <h1 class="ml-2 text-xl">{{  feature.properties.linnaosa_nimi.split(' ')[0] }} ({{ feature.properties.asumi_nimi }})</h1>
    </div>

    <MapMainDistrictPopulation :feature="feature" />
  </div>
</template>

<script lang="ts" setup>
import type { MapGeoJSONFeature } from 'maplibre-gl'

import HaaberstiFlag from '@/assets/flags/Haabersti_linnaosa_vapp.svg'
import KesklinnFlag from '@/assets/flags/Kesklinn_linnaosa_vapp.svg'
import KristiineFlag from '@/assets/flags/Kristiine_linnaosa_vapp.svg'
import LasnamäeFlag from '@/assets/flags/Lasnamäe_linnaosa_vapp.svg'
import MustamäeFlag from '@/assets/flags/Mustamäe_linnaosa_vapp.svg'
import NõmmeFlag from '@/assets/flags/Nõmme_linnaosa_vapp.svg'
import PiritaFlag from '@/assets/flags/Pirita_linnaosa_vapp.svg'
import PohjaTallinnFlag from '@/assets/flags/Põhja-Tallinn_COA.svg'

interface Props {
  feature: MapGeoJSONFeature
}
defineProps<Props>()


const flagForFeature = (feature: MapGeoJSONFeature) => {
  const linnaosaNimi = feature.properties.linnaosa_nimi as string
  switch (linnaosaNimi.split(' ')[0]) {
    case 'Haabersti':
      return HaaberstiFlag
    case 'Kesklinna':
      return KesklinnFlag
    case 'Kristiine':
      return KristiineFlag
    case 'Lasnamäe':
      return LasnamäeFlag
    case 'Mustamäe':
      return MustamäeFlag
    case 'Nõmme':
      return NõmmeFlag
    case 'Pirita':
      return PiritaFlag
    case 'Põhja-Tallinna':
      return PohjaTallinnFlag
  }
  return ''
}
</script>
