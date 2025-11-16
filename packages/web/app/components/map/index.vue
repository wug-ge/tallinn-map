<template>
  <MapDistrictDetail v-if="selectedFeature" :feature="selectedFeature" @close="selectedFeature = null" />
  <div class="w-full h-lvh relative right-0">
    <MglMap map-key="tallinn" :map-style="style" :center="center" :zoom="zoom" :pitch="pitch">
      <MglGeoJsonSource :generate-id="true" source-id="asumid" :data="geojson">
        <MglLineLayer layer-id="geojson" :paint="paint" />

        <MglFillLayer layer-id="asumid-fill" :paint="fillPaint" @mousemove="onMove" @mouseleave="onLeave"
          @click="onClick" />

        <MglSymbolLayer layer-id="asumid-labels" :layout="{
          'symbol-placement': 'point',
          'text-field': ['upcase', ['get', 'asumi_nimi']], // ← uses your field
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11, 16,  // zoom 11 → 16px
            14, 28,   // zoom 14 → 28px
          ],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-anchor': 'center',
          'text-justify': 'center'
        }" :paint="{
                  'text-color': '#1e293b',            // dark slate
                  'text-halo-color': '#ffffff',
                  'text-halo-width': 2,
                  'text-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 0,  // zoomed far out → invisible
                    11, 1,  // fade in
                    12, 1,  // stay fully visible in mid zooms
                    13, 0   // fade out again when zoomed in very close
                  ]
                }" />

      </MglGeoJsonSource>
      <MglNavigationControl />
    </MglMap>

  </div>
</template>

<script lang="ts" setup>

import geojsonSource from '~/assets/geo/tallinn_districts_polygon.geojson?raw';

import type { Feature, MapGeoJSONFeature, MapLayerMouseEvent } from 'maplibre-gl';
import {
  MglMap,
  MglGeoJsonSource,
  MglFillLayer,
  useMap,
} from '@indoorequal/vue-maplibre-gl'

const style = `https://tiles.openfreemap.org/styles/liberty`;
const center = { lat: 59.410596341214394, lng: 24.682141768230135 };
const zoom = 14;
const pitch = 30;


const mapCtx = useMap('tallinn')
function withReadyMap(fn: (m: maplibregl.Map) => void) {
  const m = mapCtx.map as maplibregl.Map | undefined
  if (!m || !m.isStyleLoaded || !m.isStyleLoaded()) return
  fn(m)
}

const geojson = computed(() => {
  const data = JSON.parse(geojsonSource)
  data.features = data.features.map(f => ({
    ...f,
    properties: {
      ...f.properties,
      color: stablePastelColor(f.properties.linnaosa_nimi)
    }
  }))
  return data
})


const layout = {
  'line-join': 'round',
  'line-cap': 'round'
};

const paint = {
  'line-color': '#FF0000',
  'line-width': 4
};

const fillPaint = computed(() => ({
  'fill-color': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    ['get', 'hoverColor'],
    ['get', 'color'],
  ],
  'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.0, // opacity when hovered
    0.35  // opacity normal
  ],
}))

const hoveredId = ref<number | null>(null)
const onMove = (e: MapLayerMouseEvent) => {
  withReadyMap((map) => {
    if (hoveredId.value != null) {
      map.setFeatureState(
        { source: 'asumid', id: hoveredId.value },
        { hover: false },
      )
    }
    const feature = e.features?.[0]
    if (!feature?.id) {
      hoveredId.value = null
      map.getCanvas().style.cursor = ''
      return
    }
    hoveredId.value = feature.id as number
    map.setFeatureState(
      { source: 'asumid', id: hoveredId.value },
      { hover: true },
    )
    map.getCanvas().style.cursor = 'pointer'
  })
}

function onLeave() {
  console.log('mouseleave')
}

function stablePastelColor(name = Math.random().toString()) {
  const hash = hashString(name)
  const h = hash % 360                // hue 0–360
  const s = 35                        // ~35% saturation → pastel
  const l = 75                        // ~75% lightness → readable on maps

  return hslToHex(h, s, l)
}

function hashString(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0 // convert to 32-bit
  }
  return Math.abs(h)
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100

  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * c)
  }

  return '#' + [f(0), f(8), f(4)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

const selectedFeature = ref<MapGeoJSONFeature | null>(null)
function onClick(e: MapLayerMouseEvent) {
  const feature = e.features?.[0]
  if (!feature?.properties) return
  // const asumiNimi = feature.properties.asumi_nimi
  // const linnaosaNimi = feature.properties.linnaosa_nimi
  // alert(`You clicked on ${asumiNimi} in ${linnaosaNimi} `+ JSON.stringify(feature.properties))
  selectedFeature.value = feature
}

</script>