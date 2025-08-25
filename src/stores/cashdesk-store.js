import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  widgetReportService,
  cashdeskService,
  cashdeskCountService,
  cashdeskAccountService,
  cashdeskTransactionService,
  cashdeskChipCountService,
} from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'
import { date } from 'quasar'
export const useCashdeskStore = defineStore('cashdeskStore', {
  state: () => ({
    cashDeskSummary: {},
    selectedCashDesk: {},
    cashdesks: [],
    transactionTypes: [
      {
        value: 'Deposit',
        label: 'Received',
      },
      {
        value: 'Withdrawal',
        label: 'Paid',
      },
    ],
    cageTransactionTypes: [
      {
        value: 'Deposit',
        label: 'Deposit',
      },
      {
        value: 'Withdrawal',
        label: 'Withdrawal',
      },
    ],
    transactionTypesForFillCredit: [
      {
        label: 'Fill',
        value: 'withdrawal',
      },
      {
        label: 'Credit',
        value: 'deposit',
      },
    ],
    currentCashDeskChipCountDenominations: [],
    cashdeskChipTransactionTotals: {},
    currentCashDeskTotals: {},
    currentCashDeskCountDenominations: [],
    currentCashDeskBalance: 0,
    currentCashDeskChipBalance: 0,
    cashdeskTransactionTypes: [],
    transTypes: [],
  }),
  getters: {
    getSelectedCashDesk: (state) => state.selectedCashDesk,
    getCashDeskById: (state) => (id) => state.cashdesks.find((cashDesk) => cashDesk.id === +id),
    getSelectedCashDeskId: (state) => state.selectedCashDesk.id,
  },
  actions: {
    async getCashDeskSummary(params) {
      const response = await widgetReportService.getCashdeskWidgetReport(params)
      this.cashDeskSummary = response.data
    },
    async fetchCashdesks(params) {
      const { data } = await cashdeskService.getAll(params)
      this.cashdesks = data.data
      return data
    },
    async updateCashDesk(params) {
      const { data } = await cashdeskService.update(params)
      this.cashdesks = data
      return data
    },
    async createCashDesk(params) {
      const { data } = await cashdeskService.create(params)
      this.cashdesks = data
      return data
    },
    async getCashDesk(id) {
      const { data } = await cashdeskService.get(id)
      return data
    },
    async deleteCashDesk(id) {
      const { data } = await cashdeskService.delete(id)
      this.cashdesks = data
      return data
    },
    async getCashDeskCountRateEffect() {
      const authStore = useAuthStore()
      const { data } = await cashdeskCountService.getCashdesksRateEffect({
        defaultCurrencyId: authStore.getDefaultCurrencyId,
      })
      return data
    },
    async getCashdesks() {
      const { data } = await cashdeskService.getCashdesks()
      this.cashdesks = data
      return data
    },
    setCurrentCashDesk(cashDesk) {
      this.selectedCashDesk = cashDesk
      this.selectedCashDesk.IsMatchedGameDateId = false
      // then call ather callbacks
    },
    async getGamingDateByCashdeskId(params) {
      const authStore = useAuthStore()
      const { data } = await cashdeskService.getGamingDateByCashdeskId(params)
      if (data) {
        if (authStore.getDefaultGamingDateId !== data) {
          this.selectedCashDesk.IsMatchedGameDateId = false
        } else {
          this.selectedCashDesk.IsMatchedGameDateId = true
        }
      }
      return data
    },
    async fetchCashdeskAccounts(params) {
      const { data } = await cashdeskAccountService.getCashdeskAccountsByCashdeskId(params)
      return data
    },
    async fetchCashdeskTransactions(params) {
      const { data } = await cashdeskTransactionService.getAll(params)
      return data
    },
    async fetchCashdeskChipTransactions(params) {
      const { data } = await cashdeskTransactionService.getAllChipTransactions(params)
      return data
    },
    async createInOutTransferTransaction(params) {
      const data = await cashdeskTransactionService.cashdeskChipInOutTransferTransaction(params)
      return data
    },
    async createCashDeskTransferTransaction(params) {
      const data = await cashdeskTransactionService.cashdeskBetweenTransferTransaction(params)
      return data
    },
    async createExchangeTransferTransaction(params) {
      const data = await cashdeskTransactionService.cashdeskExchangeTransaction(params)
      return data
    },
    async createOthersTransferTransaction(params) {
      const data = await cashdeskTransactionService.otherTransaction(params)
      return data
    },
    async createBankTransferTransaction(params) {
      const data = await cashdeskTransactionService.cashdeskBankTransaction(params)
      return data
    },
    async fetchChipTransactionDetail(params) {
      const { data } = await cashdeskTransactionService.getChipTransactionDetail(params)
      return data
    },
    async fetchCashDeskChipCountDenominations(params) {
      let payload = {
        ...params,
        CashdeskId: this.selectedCashDesk.id,
      }
      const { data } = await cashdeskChipCountService.getAllChipCountDenomination(payload)
      this.currentCashDeskChipCountDenominations = data
      return data
    },
    async updateCashDeskChipCountDenominations(params) {
      const { data } = await cashdeskChipCountService.update(params)
      return data
    },
    async fetchCashdeskChipTransactionTotals(params) {
      const authStore = useAuthStore()
      let payload = {
        ...params,
        CashdeskId: this.selectedCashDesk.id,
        BalanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await cashdeskTransactionService.getChipTransactionsTotal(payload)
      this.cashdeskChipTransactionTotals = data
      return data
    },
    async getCashdeskChipCountHistoryTotal(params) {
      const { data } = await cashdeskCountService.getCashdeskChipCountHistoryTotal(params)
      return data
    },
    async getCashdeskTotals(params) {
      const authStore = useAuthStore()
      const payload = {
        StartDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
        EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
        QueryType: 'byGamingDate',
        ...params,
        BalanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await cashdeskTransactionService.getTransactionTotals(payload)
      this.currentCashDeskTotals = data
      return data
    },
    async fetchGetCountHistoriesTotal(params) {
      const { data } = await cashdeskCountService.getCountHistoriesTotal(params)
      return data
    },
    async fetchCashdeskCountDenominations(params) {
      const { data } = await cashdeskCountService.getAllCountDenomination(params)
      this.currentCashDeskCountDenominations = data
      return data
    },
    async resetCashDeskCountDenominations(params) {
      const { data } = await cashdeskCountService.resetCashdeskBalance(params)
      return data
    },
    async updateCashDeskCountDenominations(params) {
      const { data } = await cashdeskCountService.update(params)
      return data
    },

    async setCashdeskChipBalance(params) {
      const authStore = useAuthStore()
      let payload = {
        ...params,
        BalanceCurrencyId: authStore.getDefaultCurrencyId,
        CashdeskId: this.selectedCashDesk.id,
      }
      const { data } = await cashdeskService.getChipCountBalance(payload)
      this.currentCashDeskChipBalance = data
      return data
    },
    async setCashdeskCashBalance(params) {
      const authStore = useAuthStore()
      let payload = {
        ...params,
        BalanceCurrencyId: authStore.getDefaultCurrencyId,
        CashdeskId: this.selectedCashDesk.id,
      }
      const { data } = await cashdeskService.getCashCountBalance(payload)
      this.currentCashDeskBalance = data
      return data
    },
    async setCashdeskBalance() {
      Promise.all([this.setCashdeskCashBalance(), this.setCashdeskChipBalance()])
    },
    async fetchCashdeskTransactionTypes() {
      const { data } = await cashdeskTransactionService.getCashdeskTransactionTypes()
      this.cashdeskTransactionTypes = data
        ? Object.keys(data).map((key) => {
            return {
              label: data[key],
              value: data[key],
            }
          })
        : []
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
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCashdeskStore, import.meta.hot))
}
