import { defineStore, acceptHMRUpdate } from 'pinia'
import { bankAccountService } from 'src/api'
export const useBankAccountStore = defineStore('bankAccountStore', {
  state: () => ({
    bankAccounts: [],
  }),
  getters: {
    getBankAccountsByCurrencyId: (state) => (id) => {
      return state.bankAccounts.filter((account) => account.currencyId === id)
    },
  },
  actions: {
    async fetchBankAccounts() {
      const { data } = await bankAccountService.getAll()
      this.bankAccounts = data.data
      return data
    },
    async getBankAccount(params) {
      const { data } = await bankAccountService.get(params)
      return data
    },
    async createBankAccount(params) {
      const { data } = await bankAccountService.create(params)
      return data
    },
    async updateBankAccount(params) {
      const { data } = await bankAccountService.update(params)
      return data
    },
    async deleteBankAccount(params) {
      const { data } = await bankAccountService.delete(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBankAccountStore, import.meta.hot))
}
