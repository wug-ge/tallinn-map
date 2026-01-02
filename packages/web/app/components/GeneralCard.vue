<template>
  <Card class="size-24 flex items-center justify-center" :has-close-button="false">
    <div
      class="rounded-full hover:bg-gray-800 border border-white flex items-center justify-center size-12 cursor-pointer"
      @click="click('POPULATION')"
    >
      <Icon
        name="material-symbols:person-rounded"
        size="36"
        class="text-white"
      />
    </div>
  </Card>
</template>

<script lang="ts" setup>
const { activeCard } = storeToRefs(useSettingsStore())

const click = (card: CardType) => {
  activeCard.value.card = card
}

</script>