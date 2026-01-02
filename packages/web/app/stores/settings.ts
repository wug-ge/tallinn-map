export type ActiveCard = {
  card: CardType
  props: any
}
export type CardType = "DISTRICT_DETAIL" | "GENERAL" | "POPULATION"

export const useSettingsStore = defineStore('settings', () => {
  const activeCard = ref<ActiveCard>({ card: "GENERAL", props: {} })

  return {
    activeCard,
  }
})