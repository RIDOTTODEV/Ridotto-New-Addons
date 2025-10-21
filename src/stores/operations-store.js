import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  exportService,
  giftService,
  importService,
  playerGiftService,
  playerService,
  pettyCashCategoryService,
  marketerOperationService,
} from 'src/api'
export const useOperationsStore = defineStore('operationsStore', {
  state: () => ({
    gifts: [],
    pettyCashCategories: [],
  }),
  getters: {},
  actions: {
    async getPlayerPortfolio(params) {
      const { data } = await exportService.getPlayerPortfolio(params)
      return data
    },

    async importExcelPortfolioManagement(params) {
      const { data } = await importService.excelImport(params)
      return data
    },

    async getPortfolioManagement(params) {
      const { data } = await playerService.getPlayerPortfolios(params)
      return data
    },

    async getPlayerGifts(params) {
      const { data } = await playerGiftService.getAll(params)
      return data
    },

    /****  Gift Actions  */
    async fetchGiftList(params) {
      const { data } = await giftService.getAll(params)
      this.gifts = data.data
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
    async updatePlayerGift(params) {
      const { data } = await playerGiftService.update(params)
      return data
    },
    async createPlayerGift(params) {
      const { data } = await playerGiftService.create(params)
      return data
    },
    async deletePlayerGift(params) {
      const { data } = await playerGiftService.delete(params)
      return data
    },
    async fetchPettyCashCategoryList(params) {
      const { data } = await pettyCashCategoryService.getAll(params)
      this.pettyCashCategories = data.data
      return data
    },
    async createPettyCashCategory(params) {
      const { data } = await pettyCashCategoryService.create(params)
      return data
    },
    async updatePettyCashCategory(params) {
      const { data } = await pettyCashCategoryService.update(params)
      return data
    },
    async deletePettyCashCategory(params) {
      const { data } = await pettyCashCategoryService.delete(params)
      return data
    },
    async fetchGroupCodes(params) {
      const { data } = await marketerOperationService.getGroupCodes(params)
      return data
    },
    async createGroupCode(params) {
      return await marketerOperationService.createGroupCode(params)
    },
    async updateGroupCode(params) {
      return await marketerOperationService.updateGroupCode(params)
    },
    async deleteGroupCode(params) {
      return await marketerOperationService.deleteGroupCode(params)
    },
    async closeGroupCode(params) {
      return await marketerOperationService.closeGroupCode(params)
    },
    async getNewGroupCodeString(params) {
      const { data } = await marketerOperationService.getNewGroupCodeString(params)
      return data
    },
    async fetchJunketOperation(params) {
      const { data } = await marketerOperationService.getGcMarketerPlayers(params)
      return data
    },
    async updateJunketCalculationStatus(params) {
      return marketerOperationService.updateMarketerCalculationStatus(params)
    },
    async updateCalculationStatus(params) {
      return marketerOperationService.updateCalculationStatus(params)
    },
    async getPayments(params) {
      return marketerOperationService.getPayments(params)
    },
    async createPayment(params) {
      return marketerOperationService.createPayment(params)
    },
    async getPaymentsTotal(params) {
      const { data } = await marketerOperationService.getPaymentsTotal(params)
      return data
    },
    async getGcJunketResult(params) {
      const { data } = await marketerOperationService.getGcMarketerResult(params)
      return data
    },
    async updateMarketerCloseGroupCode(params) {
      return await marketerOperationService.updateMarketerCloseGroupCode(params)
    },
    async getGroupCodeMarketerClosed(params) {
      const { data } = await marketerOperationService.getGroupCodeMarketerClosed(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOperationsStore, import.meta.hot))
}
