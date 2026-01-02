<template>
  <div class="absolute border border-gray-400 top-0 z-10 ml-12 mt-12 rounded-xl bg-black/60 backdrop-blur-md">
    <div v-if="hasCloseButton" class="flex items-center px-4 py-4 float-right">
      <Icon class="absolute right-1 top-1 cursor-pointer text-white" name="material-symbols:close" size="24" @click="$emit('close')" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  hasCloseButton?: boolean
}
withDefaults(defineProps<Props>(), {
  hasCloseButton: true
})
</script>