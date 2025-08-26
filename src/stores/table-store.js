import { defineStore, acceptHMRUpdate } from 'pinia'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import {
  tableGameService,
  floatSetService,
  tableService,
  tableFloatService,
  tableCountService,
} from 'src/api'

export const useTableStore = defineStore('tableStore', {
  state: () => ({
    games: [],
    tables: [],
    floatSets: [],
    tableCounts: [],
  }),
  getters: {
    getTableById: (state) => (tableId) => {
      return state.tables.find((table) => +table.id === +tableId)
    },
  },
  actions: {
    /********** Table Game **********/
    async fetchTableGames() {
      const { data } = await tableGameService.getAll()
      this.games = data.data
      return data
    },
    async getTableGame(params) {
      const { data } = await tableGameService.get(params)
      return data
    },
    async createTableGame(params) {
      const { data } = await tableGameService.create(params)
      return data
    },
    async updateTableGame(params) {
      const { data } = await tableGameService.update(params)
      return data
    },
    async deleteTableGame(params) {
      const { data } = await tableGameService.delete(params)
      return data
    },

    /********** Float Set **********/
    async fetchFloatSets() {
      const { data } = await floatSetService.getAll()
      this.floatSets = data.data
      return data
    },
    async getFloatSet(params) {
      const { data } = await floatSetService.get(params)
      return data
    },
    async createFloatSet(params) {
      const { data } = await floatSetService.create(params)
      return data
    },
    async updateFloatSet(params) {
      const { data } = await floatSetService.update(params)
      return data
    },
    async deleteFloatSet(params) {
      const { data } = await floatSetService.delete(params)
      return data
    },
    async deleteFloatDenom(params) {
      const { data } = await floatSetService.floatDenomDelete(params)
      return data
    },

    /********** Table **********/
    async fetchTables(params) {
      const { data } = await tableService.getAll(params)
      this.tables = data.data
      return data
    },
    async getTable(params) {
      const { data } = await tableService.get(params)
      return data
    },
    async createTable(params) {
      const { data } = await tableService.create(params)
      return data
    },
    async updateTable(params) {
      const { data } = await tableService.update(params)
      return data
    },
    async deleteTable(params) {
      const { data } = await tableService.delete(params)
      return data
    },
    async fetchTableFloats(params) {
      const { data } = await tableFloatService.getAll(params)
      return data
    },
    async bulkUpdateTableGame(params) {
      const { data } = await tableService.bulkUpdateTableGame(params)
      return data
    },
    async bulkUpdateTableFloatSet(params) {
      const { data } = await tableService.bulkUpdateTableFloatSet(params)
      return data
    },

    /********** Table Count **********/
    async fetchTableCounts(params) {
      const cashdeskStore = useCashdeskStore()
      const payload = {
        ...params,
        gamingDateId: cashdeskStore.selectedCashDesk?.gamingDateId,
      }
      const { data } = await tableCountService.getAll(payload)
      this.tableCounts = data
      return data
    },
    async getExpectedTableCount(params) {
      const { data } = await tableService.getExpectedTableCount(params)
      return data
    },
    async updateTableCounts(params) {
      return await tableCountService.update(params)
    },
    async setTableFloat(params) {
      return await tableFloatService.setTableFloat(params)
    },
    async getExpectedTableFloat(params) {
      const searchParams = new URLSearchParams()
      if (params.tableIds && Array.isArray(params.tableIds)) {
        params.tableIds.forEach((id) => {
          searchParams.append('TableIds', id)
        })
      }
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'tableIds') {
          searchParams.append(key, value)
        }
      })
      const { data } = await tableFloatService.getExpectedTableFloat(searchParams)
      return data
    },
    async changeGamingDateTable(params) {
      const { data } = await tableService.changeGamingDate(params)
      return data
    },
    async tableCountEditCheck(params) {
      return await tableCountService.tableCountEditCheck(params)
    },
    async getTableCountByTable(params) {
      const { data } = await tableCountService.get(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableStore, import.meta.hot))
}
