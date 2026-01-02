<template>
  <div class="absolute right-8 top-12 flex items-center">
    <!-- <UColorModeSwitch /> -->
  </div>

  <Map />
  <GeneralCard v-if="activeCard && activeCard.card === 'GENERAL'" />
  <PopulationCard v-if="activeCard && activeCard.card === 'POPULATION'" @close="activeCard.card = 'GENERAL'" />
  <!-- <FooterBar /> -->
</template>

<script lang="ts" setup>
const { activeCard } = storeToRefs(useSettingsStore())
</script>