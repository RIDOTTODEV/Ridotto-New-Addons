import { defineStore, acceptHMRUpdate } from 'pinia'
import { playerClassService } from 'src/api'
export const usePlayerClassStore = defineStore('playerClassStore', {
  state: () => ({
    playerClasses: [],
  }),
  getters: {},
  actions: {
    async fetchPlayerClasses(params) {
      const { data } = await playerClassService.getAll(params)
      this.playerClasses = data
      return data
    },
    async getPlayerClass(params) {
      const { data } = await playerClassService.get(params)
      return data
    },
    async createPlayerClass(params) {
      const { data } = await playerClassService.create(params)
      this.playerClasses = data
      return data
    },
    async updatePlayerClass(params) {
      const { data } = await playerClassService.update(params)
      this.playerClasses = data
      return data
    },
    async deletePlayerClass(id) {
      const { data } = await playerClassService.delete({ id })
      this.playerClasses = data
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerClassStore, import.meta.hot))
}
