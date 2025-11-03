import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  reportService,
  inOutReportService,
  playerLgReportService,
  tableFloatService,
  blacklistService,
  callReportService,
  playerService,
  cashdeskTransactionService,
  tableCountService,
  gmAftInService,
  gmAftOutService,
  meterStatsService,
  slotBrandService,
  slotModelService,
  tableTaxResultService,
} from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'
import { priceAbsFormatted } from 'src/helpers/helpers'
import { api } from 'src/boot/axios'
export const useReportStore = defineStore('reportStore', {
  state: () => ({
    balanceReport: {},
    slotBrands: [],
    slotModels: [],
  }),
  getters: {
    getOpeningTotal: (state) => {
      const totalOfOpening = state.balanceReport?.cashFigures?.totalOpeningValue
      const totalOfCumulative =
        state.balanceReport?.cumulativeReportTransactionFigures?.totalOpeningValue
      return priceAbsFormatted(totalOfOpening + totalOfCumulative)
    },
    getClosingTotal: (state) => {
      const totalOfClosing = state.balanceReport?.cashFigures?.totalClosingValue
      const totalOfCumulative =
        state.balanceReport?.cumulativeReportTransactionFigures?.totalClosingValue
      return priceAbsFormatted(totalOfClosing + totalOfCumulative)
    },
    getReceiptPaidTotal: (state) => {
      const totalOfDailyTransactionReceived =
        state.balanceReport?.dailyTransactionFigures?.totalReceived
      const totalOfDailyTransactionPaid = state.balanceReport?.dailyTransactionFigures?.totalPaid
      const totalOfInternalReceived =
        state.balanceReport?.internalTransfers?.totalReceivedBySelectedCurrency
      const totalOfInternalPaid =
        state.balanceReport?.internalTransfers?.totalPaidBySelectedCurrency
      return {
        received: priceAbsFormatted(totalOfDailyTransactionReceived + totalOfInternalReceived),
        paid: priceAbsFormatted(totalOfDailyTransactionPaid + totalOfInternalPaid),
        originalReceived: totalOfDailyTransactionReceived + totalOfInternalReceived,
        originalPaid: totalOfDailyTransactionPaid + totalOfInternalPaid,
      }
    },
    getDiffTotal: (state) => {
      const totalOfClosing = state.balanceReport?.cashFigures?.totalClosingValue
      const totalOfCumulative =
        state.balanceReport?.cumulativeReportTransactionFigures?.totalClosingValue
      const totalOfClosingValue = totalOfClosing + totalOfCumulative
      return priceAbsFormatted(totalOfClosingValue - state.getActuallyTotal.originTotal)
    },
    getActuallyTotal: (state) => {
      const openingTotal =
        state.balanceReport?.cashFigures?.totalOpeningValue +
        state.balanceReport?.cumulativeReportTransactionFigures?.totalOpeningValue
      const slotRevenue = state.balanceReport?.slotRevenues?.net
      const dailyRateTotal = state.balanceReport?.dailyRateChangeReport?.totalDifference
      const result =
        openingTotal +
        state.getReceiptPaidTotal.originalReceived -
        state.getReceiptPaidTotal.originalPaid -
        slotRevenue +
        dailyRateTotal

      return {
        total: priceAbsFormatted(result),
        originTotal: result,
      }
    },
    getSlipTotal: (state) => {
      const authStore = useAuthStore()
      return (
        authStore.getDefaultCurrencyName +
        ' ' +
        priceAbsFormatted(state.balanceReport?.slotRevenues?.net)
      )
    },
    getDailyRateTotal: (state) => {
      return priceAbsFormatted(state.balanceReport?.dailyRateChangeReport?.totalDifference)
    },
  },
  actions: {
    async getTableCounts(params) {
      const searchParams = new URLSearchParams()
      if (params.tableCountIds && Array.isArray(params.tableCountIds)) {
        params.tableCountIds.forEach((id) => {
          searchParams.append('TableCountIds', id)
        })
      }
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'tableCountIds') {
          searchParams.append(key, value)
        }
      })
      const { data } = await reportService.getTableCounts(searchParams)
      return data
    },
    async getTableCountReport(params) {
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
      const { data } = await reportService.getTableCountReport(searchParams)
      return data
    },
    getTableCountCheckReport(params) {
      return tableCountService.getTableCountCheckReport(params)
    },

    async getInOutReportNew(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await inOutReportService.getInOutReportNew(payload)
      return data
    },
    async getFilteredReport(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await inOutReportService.getFilteredReport(payload)
      return data
    },
    async getNetCashReport(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await inOutReportService.getNetCashReport(payload)
      return data
    },
    async getReportDetailInOut(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await inOutReportService.getReportDetailInOut(payload)
      return data
    },
    async getInOutPlayerDetail(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      return await inOutReportService.getInOutPlayerDetail(payload)
    },
    async getPlayerResultReport(params) {
      const { data } = await playerLgReportService.getPlayerResultReport(params)
      return data
    },
    async getPlayerResultDetailReport(params) {
      const { data } = await playerLgReportService.getPlayerResultDetailReport(params)
      return data
    },
    async getTimeInOutReport(params) {
      const { data } = await playerLgReportService.getTimeInOutReport(params)
      return data
    },
    async getTimeInOutReportByPlayer(params) {
      const { data } = await playerLgReportService.getTimeInOutReportByPlayer(params)

      return data
    },
    async getTimeInOutReportByTable(params) {
      const { data } = await playerLgReportService.getTimeInOutReportByTable(params)
      return data
    },
    async getTableFloatsReport(params) {
      const { data } = await tableFloatService.getAll(params)
      return data
    },
    async getActiveFloorListReport() {
      const authStore = useAuthStore()
      const payload = {
        defaultCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await reportService.getActiveFloorListReport(payload)
      return data
    },
    async getActiveFloorInfo() {
      const authStore = useAuthStore()
      const payload = {
        defaultCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await playerLgReportService.getActiveFloorInfoNew(payload)
      return data
    },
    async getMasteryReport(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }
      const { data } = await reportService.getMasterReport(payload)
      return data
    },
    async getBalanceReport(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }
      const { data } = await reportService.getBalanceReport(payload)
      this.balanceReport = data
      return data
    },
    async exportBalanceReport(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }
      const { data } = await api.get('/api/Export/GetBalanceReport', {
        params: payload,
        responseType: 'blob',
      })
      let extension = params.ExportFileType === 'Excel' ? 'xlsx' : 'pdf'
      let fileName = `balance-report-${params.Date}.${extension}`
      let blob = data
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      return data
    },
    async exportMasterReport(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }

      /*  const { data } = await reportService.exportMasterReport(payload) */
      const { data } = await api.get('/api/Export/GetMasterReport', {
        params: payload,
        responseType: 'blob',
      })
      let extension = params.ExportFileType === 'Excel' ? 'xlsx' : 'pdf'
      let fileName = `master-report-${params.Date}.${extension}`
      let blob = data
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      return data
    },
    async getBlackListReport(params) {
      const { data } = await blacklistService.getAll(params)
      return data
    },
    async getPlayerInfoAuditLogs(params) {
      const { data } = await reportService.getPlayerInfoAuditLogs(params)
      return data
    },
    async getPlayerLookupAuditLogs(params) {
      const { data } = await reportService.getPlayerLookupAuditLogs(params)
      return data
    },
    async getCallReport(params) {
      const { data } = await callReportService.getAll(params)
      return data
    },
    async updateCallReport(params) {
      const { data } = await callReportService.update(params)
      return data
    },
    async createCallReport(params) {
      const { data } = await callReportService.create(params)
      return data
    },
    async getPlayerWinLossAnalysisReport(params) {
      const authStore = useAuthStore()
      const payload = {
        ...params,
        balanceCurrencyId: authStore.getDefaultCurrencyId,
      }
      const { data } = await reportService.getPlayerWinLossAnalysisReport(payload)
      return data
    },
    async getPlayerTransactions(params) {
      const { data } = await playerService.getPlayerTransactions(params)
      return data
    },
    async getGmAftIns(params) {
      const { data } = await gmAftInService.getGmAftIns(params)
      return data
    },
    async getGmAftOuts(params) {
      const { data } = await gmAftOutService.getGmAftOuts(params)
      return data
    },
    async getLiveGameFloorResult(params) {
      const { data } = await reportService.getLiveGameFloorResult(params)
      const { data: fillCreditTransactions } = await this.getFillCreditTransactions(params)
      const { data: gameResultReport } = await this.getGameResultReport(params)

      return {
        data,
        fillCreditTransactions,
        gameResultReport,
      }
    },
    async getFillCreditTransactions(params) {
      return await cashdeskTransactionService.getFillCreditTransactions(params)
    },
    async getGameResultReport(params) {
      return await reportService.getGameResultReport(params)
    },
    async getMissingChipReport(params) {
      const { data } = await playerLgReportService.getMissingChipReport(params)
      return data
    },
    async getMissingChipDetailReport(params) {
      const { data } = await playerLgReportService.getMissingChipReportDetail(params)
      return data
    },
    async getTableChipBalance(params) {
      const { data } = await tableCountService.getTableChipBalance(params)
      return data
    },
    async getChipTableBalanceDetail(params) {
      const { data } = await tableCountService.getChipTableBalanceDetail(params)
      return data
    },
    async getSlotInOutReport(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        //gamingDateId: authStore.getDefaultGamingDateId,
        ...params,
      }
      const { data } = await inOutReportService.getSlotInOutReport(payload)
      return data
    },
    async getPettyCashTransactions(params) {
      const { data } = await api.get('/api/Export/GetPettyCashTransactions', {
        params: params,
        responseType: 'blob',
      })
      let extension = params.exportFileType === 'Excel' ? 'xlsx' : 'pdf'
      let fileName = `petty-cash-transactions.${extension}`
      let blob = data
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      return data
    },
    async getPlayerWinLossNew(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }
      const { data } = await meterStatsService.getPlayerWinLossNew(payload)
      return data
    },
    async getPlayerSummaryByMachineNew(params) {
      const authStore = useAuthStore()
      const payload = {
        balanceCurrencyId: authStore.getDefaultCurrencyId,
        ...params,
      }
      const { data } = await meterStatsService.getPlayerSummaryByMachineNew(payload)
      return data
    },
    async getSlotBrands() {
      const { data } = await slotBrandService.getAllKeyValues()
      this.slotBrands = data
    },
    async getSlotModels() {
      const { data } = await slotModelService.getAllKeyValues()
      this.slotModels = data
    },
    async fetchPlayerTransactionHistory(params) {
      const { data } = await inOutReportService.getPlayerTransactionHistory(params)
      return data
    },
    async getTableTaxResult(params) {
      const { data } = await tableTaxResultService.tableGetAllResult(params)
      return data
    },
    async getAllTableTaxResult(params) {
      const { data } = await tableTaxResultService.getAll(params)
      return data
    },
    async getByGamingDateTableTaxResult(params) {
      const { data } = await tableTaxResultService.getByGamingDate(params)
      return data
    },
    async createOrUpdateTableTaxResult(params) {
      return await tableTaxResultService.createOrUpdate(params)
    },
    async deleteTableTaxResult(params) {
      const { data } = await tableTaxResultService.delete(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReportStore, import.meta.hot))
}
