import { defineStore, acceptHMRUpdate } from 'pinia'
import { transactionCodeService, cashdeskTransactionService } from 'src/api'
export const useTransactionCodeStore = defineStore('transactionCodeStore', {
  state: () => ({
    transactionCodes: [],
    transactionCodeTypes: [],
    transTypes: [],
    transactionCodeGroupTypes: [],
  }),
  getters: {
    getTransactionCodesByGroups: (state) => (groups) => {
      return state.transactionCodes.filter((code) =>
        groups.every((g) => code.transactionCodeGroupTypes.includes(g)),
      )
    },
    getTransactionCodeByTransactionCodeType: (state) => (type) => {
      return state.transactionCodes.filter(
        (code) => code.transactionCodeType.toLowerCase() === type.toLowerCase(),
      )
    },
    getTransactionCodesByTransType: (state) => (type) => {
      if (type) {
        return (
          state.transactionCodes.filter(
            (tcd) => tcd.transType.toLowerCase() === type.toLowerCase(),
          ) || []
        )
      }
      return state.transactionCodes.filter((tcd) => tcd.transType) || []
    },
    getTransactionCodeTransactionCodeTypeAndGroupTypes:
      (state) =>
      (type = null, group = null) => {
        if (type === null && group === null) return state.transactionCodes
        if (type !== null) {
          return state.transactionCodes.filter(
            (code) => code?.transType?.toLowerCase() === type.toLowerCase(),
          )
        }
        if (group !== null) {
          return state.transactionCodes.filter((code) =>
            code.transactionCodeGroupTypes.includes(group),
          )
        }

        return state.transactionCodes.filter(
          (code) =>
            code?.transType?.toLowerCase() === type.toLowerCase() &&
            code.transactionCodeGroupTypes.includes(group),
        )
      },
  },
  actions: {
    async fetchTransactionCodes(params = {}) {
      const { data } = await transactionCodeService.getAll(params)
      this.transactionCodes = data.data.sort((a, b) => a.name.localeCompare(b.name))
      return data
    },
    async createTransactionCode(data) {
      const { data: response } = await transactionCodeService.create(data)
      return response
    },
    async updateTransactionCode(data) {
      const { data: response } = await transactionCodeService.update(data)
      return response
    },
    async deleteTransactionCode(id) {
      const { data: response } = await transactionCodeService.delete(id)
      return response
    },
    async fetchTransactionCodeTypes() {
      const { data } = await transactionCodeService.getTransactionCodeTypes()
      const transactionCodeTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      this.transactionCodeTypes = transactionCodeTypes
      return transactionCodeTypes
    },
    async fetchTransTypes() {
      const { data } = await cashdeskTransactionService.getTransType()
      this.transTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      return data
    },
    async fetchTransactionCodeGroupTypes() {
      const { data } = await transactionCodeService.getTransactionCodeGroupTypes()
      const transactionCodeGroupTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
      this.transactionCodeGroupTypes = transactionCodeGroupTypes
      return transactionCodeGroupTypes
    },
    async fetchTransactionCode(id) {
      const { data } = await transactionCodeService.get(id)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionCodeStore, import.meta.hot))
}
