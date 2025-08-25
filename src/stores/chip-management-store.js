import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  chipService,
  chipDenominationService,
  cashdeskTransactionService,
  casinoChipStockService,
} from 'src/api'
export const useChipManagementStore = defineStore('chipManagementStore', {
  state: () => ({
    chips: [],
    gamingChipTypes: [],
    chipColors: [
      {
        label: 'red',
        value: '#FF0000',
        color: 'red',
      },
      {
        label: 'green',
        value: '#00FF00',
        color: 'green',
      },
      {
        label: 'blue',
        value: '#0000FF',
        color: 'blue',
      },
      {
        label: 'yellow',
        value: '#FFFF00',
        color: 'yellow',
      },
      {
        label: 'cyan',
        value: '#00FFFF',
        color: 'cyan',
      },
      {
        label: 'magenta',
        value: '#FF00FF',
        color: 'magenta',
      },
      {
        label: 'black',
        value: '#000000',
        color: 'black',
      },
      {
        label: 'Açık Yeşil',
        value: '#0bad13',
        color: '#0bad13',
      },
    ],
    chipTransactionTypes: [
      {
        label: 'ChipIn',
        value: 'ChipIn',
      },
      {
        label: 'ChipOut',
        value: 'ChipOut',
      },
    ],
    chipCageTransactionTypes: [
      {
        label: 'Deposit',
        value: 'Deposit',
      },
      {
        label: 'Withdrawal',
        value: 'Withdrawal',
      },
    ],
  }),
  getters: {
    getDenominationByChipId: (state) => (chipId) => {
      const chip = state.chips?.find((c) => c.id === chipId)
      if (!chip) return []
      return chip.denominations.map((d) => ({
        value: d.value,
        amount: 0,
        quantity: 0,
        chipDenomId: d.id,
        chipCurrencyId: chip.currencyId,
      }))
    },
    getDenominationChipType: (state) => (denominationId) => {
      return state.chips.find((c) => c.denominations.find((d) => d.id === denominationId))
    },
    getChipsGridFormatted: (state) => {
      return state.chips.map((c) => {
        return {
          ...c,
          children: c.denominations.map((d) => {
            return {
              chipDenomId: d.id,
              chipCurrencyId: c.currencyId,
              chipId: c.id,
              value: d.value,
              quantity: 0,
              label: d?.name + ' (' + d?.value + ')',
              amount: 0,
              chipDenomName: d.name,
              chipType: c.type,
            }
          }),
        }
      })
    },
    getChipById: (state) => (id) => {
      return state.chips.find((c) => +c.id === +id)
    },
  },
  actions: {
    async fetchChips(params) {
      const { data } = await chipService.getAll(params)
      this.chips = data.data
      return data
    },
    async fetchGamingChipTypes(params) {
      const { data } = await chipService.getGamingChipTypes(params)
      this.gamingChipTypes = Object.keys(data).map((key) => {
        return { id: key, name: data[key] }
      })
      return data
    },
    async getChip(params) {
      const { data } = await chipService.get(params)
      return data
    },
    async createChip(params) {
      const { data } = await chipService.create(params)
      return data
    },
    async updateChip(params) {
      const { data } = await chipService.update(params)
      return data
    },
    async deleteChip(params) {
      const { data } = await chipService.delete(params)
      return data
    },
    async deleteGameChipDenomination(params) {
      const { data } = await chipDenominationService.delete(params)
      return data
    },
    async getAllChipTransactions(params) {
      const { data } = await cashdeskTransactionService.getAllChipTransactions(params)
      return data
    },
    async getChipStockHistories(params) {
      const { data } = await casinoChipStockService.getHistories(params)
      return data
    },
    async chipStockInOut(params) {
      const { data } = await casinoChipStockService.chipStockInOut(params)
      return data
    },
    async cashdeskChipInOutTransferTransaction(params) {
      const { data } = await cashdeskTransactionService.cashdeskChipInOutTransferTransaction(params)
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChipManagementStore, import.meta.hot))
}
