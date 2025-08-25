import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  currencyService,
  currencyDenominationService,
  exchangeRateService,
  cashdeskTransactionService,
} from 'src/api'
import { LocalStorage } from 'quasar'
export const useCurrencyStore = defineStore('currencyStore', {
  state: () => ({
    currencies: [],
    defaultCurrencyId: 2,
    currencyExchangeUpdateBulkFormat: {
      rates: [],
      rateDifferences: [],
      pureRates: [
        {
          cashdeskId: 21,
          cashdeskName: 'Kasa 1',
          currencyId: 1,
          currencyName: 'TL',
          amount: 4,
          transactionType: 'Deposit',
          previousAmount: 4,
          difference: 0,
          oldRate: 1,
          newRate: 1,
        },
        {
          cashdeskId: 21,
          cashdeskName: 'Kasa 1',
          currencyId: 2,
          currencyName: 'EUR',
          amount: 1178515.2,
          transactionType: 'Deposit',
          previousAmount: 1178515.2,
          difference: 0,
          oldRate: 32,
          newRate: 32,
        },
        {
          cashdeskId: 21,
          cashdeskName: 'Kasa 1',
          currencyId: 3,
          currencyName: 'USD',
          amount: 0,
          transactionType: 'Deposit',
          previousAmount: 0,
          difference: 0,
          oldRate: 30,
          newRate: 30,
        },
        {
          cashdeskId: 22,
          cashdeskName: 'Kasa 2',
          currencyId: 1,
          currencyName: 'TL',
          amount: 2998,
          transactionType: 'Deposit',
          previousAmount: 2998,
          difference: 0,
          oldRate: 1,
          newRate: 1,
        },
        {
          cashdeskId: 22,
          cashdeskName: 'Kasa 2',
          currencyId: 2,
          currencyName: 'EUR',
          amount: 2103552,
          transactionType: 'Deposit',
          previousAmount: 2103552,
          difference: 0,
          oldRate: 32,
          newRate: 32,
        },
        {
          cashdeskId: 22,
          cashdeskName: 'Kasa 2',
          currencyId: 3,
          currencyName: 'USD',
          amount: 33000,
          transactionType: 'Deposit',
          previousAmount: 33000,
          difference: 0,
          oldRate: 30,
          newRate: 30,
        },
        {
          cashdeskId: 23,
          cashdeskName: 'Kasa 3',
          currencyId: 1,
          currencyName: 'TL',
          amount: 155,
          transactionType: 'Deposit',
          previousAmount: 155,
          difference: 0,
          oldRate: 1,
          newRate: 1,
        },
        {
          cashdeskId: 23,
          cashdeskName: 'Kasa 3',
          currencyId: 2,
          currencyName: 'EUR',
          amount: 167264,
          transactionType: 'Deposit',
          previousAmount: 167264,
          difference: 0,
          oldRate: 32,
          newRate: 32,
        },
        {
          cashdeskId: 23,
          cashdeskName: 'Kasa 3',
          currencyId: 3,
          currencyName: 'USD',
          amount: 0,
          transactionType: 'Deposit',
          previousAmount: 0,
          difference: 0,
          oldRate: 30,
          newRate: 30,
        },
        {
          cashdeskId: 25,
          cashdeskName: 'Cengizhan Test',
          currencyId: 1,
          currencyName: 'TL',
          amount: 22435,
          transactionType: 'Deposit',
          previousAmount: 22435,
          difference: 0,
          oldRate: 1,
          newRate: 1,
        },
        {
          cashdeskId: 25,
          cashdeskName: 'Cengizhan Test',
          currencyId: 2,
          currencyName: 'EUR',
          amount: 19424,
          transactionType: 'Deposit',
          previousAmount: 19424,
          difference: 0,
          oldRate: 32,
          newRate: 32,
        },
        {
          cashdeskId: 25,
          cashdeskName: 'Cengizhan Test',
          currencyId: 3,
          currencyName: 'USD',
          amount: 0,
          transactionType: 'Deposit',
          previousAmount: 0,
          difference: 0,
          oldRate: 30,
          newRate: 30,
        },
        {
          cashdeskId: 26,
          cashdeskName: 'Kasa 4',
          currencyId: 1,
          currencyName: 'TL',
          amount: 0,
          transactionType: 'Deposit',
          previousAmount: 0,
          difference: 0,
          oldRate: 1,
          newRate: 1,
        },
        {
          cashdeskId: 26,
          cashdeskName: 'Kasa 4',
          currencyId: 2,
          currencyName: 'EUR',
          amount: 9536,
          transactionType: 'Deposit',
          previousAmount: 9536,
          difference: 0,
          oldRate: 32,
          newRate: 32,
        },
        {
          cashdeskId: 26,
          cashdeskName: 'Kasa 4',
          currencyId: 3,
          currencyName: 'USD',
          amount: 0,
          transactionType: 'Deposit',
          previousAmount: 0,
          difference: 0,
          oldRate: 30,
          newRate: 30,
        },
      ],
    },
    currencyFlags: [
      {
        name: 'EUR',
        flag: '/assets/eur.svg',
      },
      {
        name: 'USD',
        flag: '/assets/usd.svg',
      },
      {
        name: 'TRY',
        flag: '/assets/try.svg',
      },
      {
        name: 'TL',
        flag: '/assets/try.svg',
      },
      {
        name: 'GBP',
        flag: '/assets/gbp.svg',
      },
    ],
  }),
  getters: {
    getCurrencyById: (state) => (id) => {
      return state.currencies.find((currency) => currency.id === id) || {}
    },
    getCurrencyDenominations: (state) => (id) => {
      return state.currencies.find((currency) => currency.id === id)?.denominations || []
    },
    getCurrenciesWithFlags: (state) => {
      return state.currencies.map((currency) => {
        let flag = state.currencyFlags.find((flag) => flag.name === currency.name)
        return {
          ...currency,
          flag: flag ? flag.flag : '',
        }
      })
    },
    getDefaultCurrency: (state) => {
      const mapped = state.currencies.map((currency) => {
        let flag = state.currencyFlags.find((flag) => flag.name === currency.name)
        return {
          ...currency,
          flag: flag ? flag.flag : '',
        }
      })
      return mapped.find((currency) => currency.id === state.defaultCurrencyId) || {}
    },
    getBulkExchangeRateDifferences: (state) => {
      function groupByCashdeskId(array) {
        return array.reduce((groups, item) => {
          const { cashdeskId } = item
          // Find the group with matching cashdeskId, or create a new group
          const group = groups.find((group) => group[0]?.cashdeskId === cashdeskId)
          if (group) {
            group.push(item)
          } else {
            groups.push([item])
          }
          return groups
        }, [])
      }

      // first sort by cashdeskId then group by cashdeskId
      state.currencyExchangeUpdateBulkFormat.pureRates.sort((a, b) => a.cashdeskId - b.cashdeskId)
      // add to all element unique key
      state.currencyExchangeUpdateBulkFormat.pureRates.map((rate, index) => {
        rate.key = index
      })
      return groupByCashdeskId(state.currencyExchangeUpdateBulkFormat.pureRates)
    },
    getCurrenciesByIds: (state) => (ids) => {
      return ids ? state.currencies.filter((currency) => ids.includes(currency.id)) : []
    },
  },
  actions: {
    async fetchCurrencies() {
      const { data } = await currencyService.getAllWithCurrentRatesPaged()
      this.currencies = data.data
      this.setCurrentExchangeRateTableFormat(data.data)
      return data
    },
    async createCurrencyDenomination(data) {
      await currencyDenominationService.create(data)
      this.fetchCurrencies()
    },
    async updateCurrencyDenomination(data) {
      await currencyDenominationService.update(data)
      this.fetchCurrencies()
    },
    async deleteCurrencyDenomination(data) {
      await currencyDenominationService.delete(data)
      this.fetchCurrencies()
    },
    async fetchLatestRates(id) {
      const { data } = await exchangeRateService.getAll({ fromCurrencyId: id })
      return data
    },
    async fetchLatestRatesBefore(params) {
      const { data } = await exchangeRateService.getLatestRatesBefore(params)
      return data
    },
    async fetchConvertedAmount(fromCurrencyId, toCurrencyId, amount) {
      const { data } = await exchangeRateService.getConvertedAmount({
        fromCurrencyId,
        toCurrencyId,
        amount,
      })
      return data
    },
    async setDefaultCurrency(id) {
      this.defaultCurrencyId = id
      LocalStorage.set('defaultCurrencyId', id)
    },
    async fetchCurrencyRatesById(fromCurrencyId, toCurrencyId) {
      const { data } = await exchangeRateService.getAll({ fromCurrencyId, toCurrencyId })

      return data.data || []
    },
    async createNewCurrencyExchangeRate(data) {
      await exchangeRateService.create(data)
      return true
    },
    setCurrentExchangeRateTableFormat(currencies) {
      this.currencyExchangeUpdateBulkFormat.rates = []
      currencies.forEach((currency) => {
        let currentExchangeRates = []
        currencies.forEach((c) => {
          const rate = currency.exchangeRates.find((r) => r.toCurrencyId === c.id)
          if (rate) {
            currentExchangeRates.push({
              fromCurrencyId: currency.id,
              toCurrencyId: c.id,
              rate: rate.rate,
            })
          }
        })
        let format = {
          name: currency.name,
          rates: currentExchangeRates,
          id: currency.id,
        }
        this.currencyExchangeUpdateBulkFormat.rates.push(format)
      })
    },
    async updateCurrencyExchangeRates(data) {
      await exchangeRateService.createRange(data)
    },
    setCurrencyExchangeExRate(rateInfo) {
      const currency = this.currencyExchangeUpdateBulkFormat.rates.find(
        (currency) => currency.id === rateInfo.toCurrencyId,
      )
      const rate = currency.rates.find(
        (rate) =>
          rate.fromCurrencyId === rateInfo.toCurrencyId &&
          rate.toCurrencyId === rateInfo.fromCurrencyId,
      )
      rate.rate = parseFloat((1 / rateInfo.rate).toFixed(6))
    },
    setCurrencyExchangeBulkRateDifferences(data) {
      // const systemSettingStore = useSystemSettingStore();
      this.currencyExchangeUpdateBulkFormat.pureRates = data.map((rate) => {
        return {
          ...rate,
          rateEffectAmount: rate.differenceInDefaultCurrency,
          beforeRateEffectAmountInBalanceCurrency: rate.previousBalanceInDefaultCurrency,
          afterRateEffectAmountInBalanceCurrency: rate.currentBalanceInDefaultCurrency,
          previousRate: rate.oldRate,
          nextRate: rate.newRate,
          balanceCurrencyId: this.defaultCurrencyId,
          cageBalanceCurrencyId: rate.currencyId,
          cageBalance: rate.cageBalance,
        }
      })
    },

    async createNewRateEffect(data) {
      await cashdeskTransactionService.cashdeskRateEffectTransaction(data).then(() => {
        this.fetchCurrencies()
      })
    },
    applyAllTransactionCodeToRateEffects(transactionCodeId) {
      this.currencyExchangeUpdateBulkFormat.pureRates.map((rate) => {
        rate.transactionCodeId = transactionCodeId
      })
    },
    async getConvertedAmount(fromCurrencyId, toCurrencyId, amount) {
      let payload = {
        fromCurrencyId,
        toCurrencyId,
        amount,
      }
      const { data } = await exchangeRateService.getConvertedAmount(payload)

      return data
    },
    async getLatestRates(fromCurrencyId) {
      const { data } = await exchangeRateService.getLatestRates({ fromCurrencyId })
      return data
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrencyStore, import.meta.hot))
}
