import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  giftService,
  roomTypeService,
  playerCategoryService,
  expenseParameterService,
} from 'src/api'
export const useGuestManagementStore = defineStore('guestManagementStore', {
  state: () => ({
    gifts: [],
    roomTypes: [],
    playerCategories: [],
    expenseParameters: [],
  }),
  getters: {},
  actions: {
    async fetchGifts(params) {
      const { data } = await giftService.getAll(params)
      this.gifts = data
      return data
    },
    async getGift(params) {
      const { data } = await giftService.get(params)
      return data
    },
    async createGift(params) {
      const { data } = await giftService.create(params)
      return data
    },
    async updateGift(params) {
      const { data } = await giftService.update(params)
      return data
    },
    async deleteGift(params) {
      const { data } = await giftService.delete(params)
      return data
    },
    async fetchRoomTypes(params) {
      const { data } = await roomTypeService.getAll(params)
      this.roomTypes = data
      return data
    },
    async getRoomType(params) {
      const { data } = await roomTypeService.get(params)
      return data
    },
    async createRoomType(params) {
      const { data } = await roomTypeService.create(params)
      return data
    },
    async updateRoomType(params) {
      const { data } = await roomTypeService.update(params)
      return data
    },
    async deleteRoomType(params) {
      const { data } = await roomTypeService.delete(params)
      return data
    },
    async fetchPlayerCategories(params) {
      const { data } = await playerCategoryService.getAll(params)
      this.playerCategories = data
      return data
    },
    async getPlayerCategory(params) {
      const { data } = await playerCategoryService.get(params)
      return data
    },
    async createPlayerCategory(params) {
      const { data } = await playerCategoryService.create(params)
      return data
    },
    async updatePlayerCategory(params) {
      const { data } = await playerCategoryService.update(params)
      return data
    },
    async deletePlayerCategory(params) {
      const { data } = await playerCategoryService.delete(params)
      return data
    },
    async fetchExpenseParameters(params) {
      const { data } = await expenseParameterService.getAll(params)
      this.expenseParameters = data
      return data
    },
    async getExpenseParameter(params) {
      const { data } = await expenseParameterService.get(params)
      return data
    },
    async createExpenseParameter(params) {
      const { data } = await expenseParameterService.create(params)
      return data
    },
    async updateExpenseParameter(params) {
      const { data } = await expenseParameterService.update(params)
      return data
    },
    async deleteExpenseParameter(params) {
      const { data } = await expenseParameterService.delete(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGuestManagementStore, import.meta.hot))
}
