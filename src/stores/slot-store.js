import { defineStore, acceptHMRUpdate } from 'pinia'
import { slotPlayerTransactionService } from 'src/api'

export const useSlotStore = defineStore('slotStore', {
  state: () => ({}),
  getters: {},
  actions: {
    async fetchPlayersInOut(params) {
      const { data } = await slotPlayerTransactionService.getAll(params)

      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSlotStore, import.meta.hot))
}
