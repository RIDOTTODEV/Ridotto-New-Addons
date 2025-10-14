import { defineStore, acceptHMRUpdate } from 'pinia'
import { locationService } from 'src/api'

export const useDefinitionStore = defineStore('definitionStore', {
  state: () => ({
    locations: [],
  }),
  getters: {},
  actions: {
    async fetchLocations() {
      const { data } = await locationService.getAll()
      this.locations = data.data
      return data
    },
    async updateLocation(params) {
      const { data } = await locationService.update(params)
      return data
    },
    async createLocation(params) {
      const { data } = await locationService.create(params)
      return data
    },
    async deleteLocation(params) {
      const { data } = await locationService.delete(params)
      return data
    },
    async getLocation(params) {
      const { data } = await locationService.get(params)
      return data
    },
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDefinitionStore, import.meta.hot))
}
