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
    async createPlayersInOut(params) {
      return await slotPlayerTransactionService.create(params)
    },
    async deletePlayersInOut(params) {
      return await slotPlayerTransactionService.delete(params)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSlotStore, import.meta.hot))
}
