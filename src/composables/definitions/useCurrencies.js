import { useCurrencyStore } from 'src/stores/currency-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useBankAccountStore } from 'src/stores/bank-account-store'
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { Dialog, date } from 'quasar'
import { i18n } from 'boot/i18n'
export function useCurrencies() {
  const currencyStore = useCurrencyStore()
  const {
    getCurrencyDenominations,
    currencies,
    getBulkExchangeRateDifferences,
    currencyExchangeUpdateBulkFormat,
    getCurrenciesByIds,
  } = storeToRefs(currencyStore)
  const cashdeskStore = useCashdeskStore()
  const { cashdesks } = storeToRefs(cashdeskStore)
  const transactionCodeStore = useTransactionCodeStore()
  const { transactionCodes } = storeToRefs(transactionCodeStore)
  const bankAccountStore = useBankAccountStore()
  const { getBankAccountsByCurrencyId, bankAccounts } = storeToRefs(bankAccountStore)
  const columns = ref([
    {
      name: 'id',
      label: 'ID',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'symbol',
    },
    {
      field: 'isoCode',
    },

    {
      field: 'createdAt',
      fieldType: 'date',
    },
    {
      field: 'exchangeRates',
      label: 'TRY',
      name: 'TRY',
      fieldType: 'custom',
      customFormat: (value) => {
        let item = value.find((item) => item.toCurrencyId === 1)
        return item.rate || '-'
      },
    },
    {
      field: 'exchangeRates',
      label: 'EUR',
      name: 'EUR',
      fieldType: 'custom',
      customFormat: (value) => {
        let item = value.find((item) => item.toCurrencyId === 2)
        return item.rate || '-'
      },
    },
    {
      field: 'exchangeRates',
      label: 'USD',
      name: 'USD',
      fieldType: 'custom',
      customFormat: (value) => {
        let item = value.find((item) => item.toCurrencyId === 3)
        return item.rate || '-'
      },
    },
    {
      field: 'exchangeRates',
      label: 'GBP',
      name: 'GBP',
      fieldType: 'custom',
      customFormat: (value) => {
        let item = value.find((item) => item.toCurrencyId === 4)
        return item.rate || '-'
      },
    },

    {
      field: 'createdByName',
    },

    {
      field: 'actions',
    },
  ])

  const exchangeRateDialog = ref(false)
  const exchangeDialog = ref(false)
  const exchangeRateFromCurrency = ref(null)
  const exchangeRateFormValues = ref({
    rate: null,
    currency: null,
    toCurrency: null,
    forexBuying: 0,
    forexSelling: 0,
    banknoteBuying: 0,
    banknoteSelling: 0,
    rates: [],
  })
  const showCurrencyExchangeRates = (props) => {
    exchangeRateDialog.value = true
    exchangeRateFormValues.value.currency = props.id
    let nextCurrencies = currencies.value.filter((currency) => currency.id !== props.id)
    exchangeRateFromCurrency.value = nextCurrencies[0].id
  }

  const currencyDominationDialog = ref(false)
  const selectedCurrency = ref(null)
  const denominationFormValues = ref({
    currencyId: null,
    denom: null,
    id: null,
  })
  const showCurrencyDomination = (currency) => {
    currencyDominationDialog.value = true
    selectedCurrency.value = currency
    denominationFormValues.value.currencyId = currency.id
  }
  const onSubmitCurrencyDenomination = async () => {
    if (denominationFormValues.value.id) {
      await currencyStore.updateCurrencyDenomination(denominationFormValues.value).then(() => {
        denominationFormValues.value.denom = null
        denominationFormValues.value.id = null
      })
    } else {
      let values = { ...denominationFormValues.value }
      delete values.id
      await currencyStore.createCurrencyDenomination(values).then(() => {
        denominationFormValues.value.denom = null
        denominationFormValues.value.id = null
      })
    }
  }

  const denominationColumns = ref([
    {
      name: 'id',
      align: 'center',
      label: 'Id',
      field: 'id',
      sortable: true,
      visible: true,
    },
    {
      name: 'denom',
      align: 'center',
      label: 'Denomination Value',
      field: 'denom',
      sortable: false,
      visible: true,
    },
    {
      name: 'Action',
      align: 'center',
      label: 'Actions',
      field: 'Id',
      sortable: false,
      visible: true,
    },
  ])

  const editCurrencyDenomination = (index, denomination) => {
    let value = JSON.parse(JSON.stringify(denomination))
    denominationFormValues.value = value
  }
  const removeCurrencyDenomination = (denomination) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('denomination'),
      }),
      persistent: true,
      focus: 'cancel',
      ok: {
        flat: true,
        color: 'negative',
        label: i18n.global.t('delete'),
        class: 'text-capitalize',
      },
      cancel: {
        flat: true,
        color: 'primary',
        label: i18n.global.t('cancel'),
        class: 'text-capitalize',
      },
    }).onOk(async () => {
      await currencyStore.deleteCurrencyDenomination({ id: denomination.id })
    })
  }

  const rateColumns = ref([
    {
      name: 'id',
      align: 'center',
      label: 'Id',
      field: 'id',
      sortable: true,
      visible: true,
    },
    {
      name: 'fromCurrencyId',
      align: 'center',
      label: 'From Currency',
      field: 'fromCurrencyId',
      sortable: false,
      format: (val) => currencyStore.getCurrencyById(val).name,
      visible: true,
    },
    {
      name: 'toCurrencyId',
      align: 'center',
      label: 'To Currency',
      field: 'toCurrencyId',
      sortable: false,
      format: (val) => currencyStore.getCurrencyById(val).name,
      visible: true,
    },
    {
      name: 'rate',
      align: 'center',
      label: 'Rate',
      field: 'rate',
      sortable: false,
      visible: true,
    },
    {
      name: 'currencyDate',
      align: 'center',
      label: 'Exchange Date',
      field: 'currencyDate',
      sortable: false,
      format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss'),
      visible: true,
    },
    {
      name: 'Action',
      align: 'center',
      label: 'Actions',
      field: 'id',
      sortable: false,
      visible: true,
    },
  ])
  watch(
    () => exchangeRateFromCurrency.value,
    async (val) => {
      if (val) {
        exchangeRateFormValues.value.toCurrency = val
        exchangeRateFormValues.value.rates = [
          ...(await currencyStore.fetchCurrencyRatesById(
            exchangeRateFormValues.value.currency,
            val,
          )),
        ]
      }
    },
    { immediate: true },
  )

  const onSubmitNewCurrencyExchange = async () => {
    let newFormValues = {
      fromCurrencyId: exchangeRateFormValues.value.currency,
      toCurrencyId: exchangeRateFormValues.value.toCurrency,
      rate: exchangeRateFormValues.value.rate,
    }
    await currencyStore.createNewCurrencyExchangeRate(newFormValues).then(async (res) => {
      if (res === true) {
        exchangeDialog.value = false
        exchangeRateFormValues.value.toCurrency = null
        exchangeRateFormValues.value.rate = null
        exchangeRateFormValues.value.rates = [
          ...(await currencyStore.fetchCurrencyRatesById(
            exchangeRateFormValues.value.currency,
            exchangeRateFromCurrency.value,
          )),
        ]
      }
    })
  }
  const removeCurrencyExchangeRate = (props) => {
    console.log('Props', props)
    console.log('Remove')
  }

  const bulkExchangeRateStep = ref(1)

  const onSubmitBulkExchangeRate = async () => {
    await currencyStore.createNewRateEffect().then(() => {
      bulkExchangeRateStep.value = 1
      currencyStore.currencyExchangeUpdateBulkFormat.pureRates = []
    })
  }

  const addNewRowToBulkExchangeRate = (exchangeRate) => {
    currencyStore.currencyExchangeUpdateBulkFormat.pureRates.push(exchangeRate)
  }
  const lastSelectedTransactionCodeIndex = ref(null)
  const delayToApplyToAll = ref(0)
  const startToTimer = () => {
    let myInterVal = setInterval(() => {
      if (delayToApplyToAll.value > 0) {
        delayToApplyToAll.value -= 1000
      } else {
        clearInterval(myInterVal)
      }
    }, 1000)
  }
  const setDelayToApplyToAll = (transactionCodeId, key) => {
    lastSelectedTransactionCodeIndex.value = key
    delayToApplyToAll.value = 10000
    startToTimer()
  }
  const removeBulkExchangeRateByDiff = (diff) => {
    const index = currencyStore.currencyExchangeUpdateBulkFormat.pureRates.findIndex(
      (r) => r === diff,
    )
    currencyStore.currencyExchangeUpdateBulkFormat.pureRates.splice(index, 1)
  }
  const saveBulkExchangeRates = async () => {
    if (bulkExchangeRateStep.value === 1) {
      const rates = currencyStore.currencyExchangeUpdateBulkFormat.rates
        .map((rate) => {
          return [...rate.rates]
        })
        .flatMap((rate) => rate)

      await currencyStore.updateCurrencyExchangeRates(rates).then(async () => {
        await bankAccountStore.fetchBankAccounts()
        const rateDifferences = await cashdeskStore.getCashDeskCountRateEffect()
        currencyStore.setCurrencyExchangeBulkRateDifferences(rateDifferences)
        bulkExchangeRateStep.value = 2
      })
    }
  }
  onMounted(() => {
    bankAccountStore.fetchBankAccounts()
    transactionCodeStore.fetchTransactionCodes()
  })
  return {
    currencyStore,
    columns,
    exchangeRateDialog,
    exchangeDialog,
    showCurrencyExchangeRates,
    showCurrencyDomination,
    denominationFormValues,
    selectedCurrency,
    currencyDominationDialog,
    exchangeRateFromCurrency,
    exchangeRateFormValues,
    onSubmitCurrencyDenomination,
    getCurrencyDenominations,
    denominationColumns,
    editCurrencyDenomination,
    removeCurrencyDenomination,
    rateColumns,
    currencies,
    onSubmitNewCurrencyExchange,
    removeCurrencyExchangeRate,
    bulkExchangeRateStep,
    currencyExchangeUpdateBulkFormat,
    onSubmitBulkExchangeRate,
    cashdesks,
    addNewRowToBulkExchangeRate,
    getBulkExchangeRateDifferences,
    transactionCodes,
    setDelayToApplyToAll,
    lastSelectedTransactionCodeIndex,
    delayToApplyToAll,
    getBankAccountsByCurrencyId,
    removeBulkExchangeRateByDiff,
    saveBulkExchangeRates,
    bankAccounts,
    cashdeskStore,
    getCurrenciesByIds,
  }
}
