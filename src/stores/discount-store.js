import { defineStore, acceptHMRUpdate } from 'pinia'
import { discountService, applicationSettingService } from 'src/api'
export const useDiscountStore = defineStore('discountStore', {
  state: () => ({
    discounts: [],
  }),
  getters: {},
  actions: {
    async fetchDiscounts() {
      const { data } = await discountService.getAll()
      this.discounts = data
      return data
    },
    async getDiscount(params) {
      const { data } = await discountService.get(params)
      return data
    },
    async createDiscount(params) {
      const { data } = await discountService.create(params)
      return data
    },
    async updateDiscount(params) {
      const { data } = await discountService.update(params)
      return data
    },
    async deleteDiscount(params) {
      const { data } = await discountService.delete(params)
      return data
    },
    async getDiscountSetting(params) {
      const { data } = await applicationSettingService.getSettings(params)
      return data
    },
    async updateDiscountSetting(params) {
      const { data } = await applicationSettingService.setSettings(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDiscountStore, import.meta.hot))
}
