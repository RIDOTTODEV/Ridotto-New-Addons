import { useDiscountStore } from 'src/stores/discount-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { ref, onMounted } from 'vue'

import { storeToRefs } from 'pinia'

export function useDiscount() {
  const discountStore = useDiscountStore()
  const currencyStore = useCurrencyStore()
  const { getCurrenciesWithFlags } = storeToRefs(currencyStore)
  const transactionCodeStore = useTransactionCodeStore()
  const { getTransactionCodesByGroups } = storeToRefs(transactionCodeStore)
  const cashdeskStore = useCashdeskStore()
  const { cashDesks } = storeToRefs(cashdeskStore)
  const discountSettingFormValues = ref({
    id: null,
    currencyId: null,
    cashdeskId: null,
    transactionCodeId: null,
    maxResult: 0,
    minResult: 0,
    discountLevels: [],
    systemStatus: false,
  })

  const discountLevelsColumns = ref([
    {
      name: 'min',
      label: 'Min',
      field: 'min',
      align: 'left',
    },
    {
      name: 'max',
      label: 'Max',
      field: 'max',
      align: 'left',
    },
    {
      name: 'percent',
      label: 'Percent',
      field: 'percent',
      align: 'left',
    },
    {
      name: 'infinite',
      label: 'Infinite',
      field: 'infinite',
      align: 'center',
    },
    {
      name: 'actions',
      label: 'Actions',
      field: 'actions',
      align: 'center',
    },
  ])

  const onSubmitForm = async () => {
    const form = { ...discountSettingFormValues.value }
    discountStore.updateDiscount({ ...form }).then(async () => {
      discountStore.updateDiscountSetting({
        name: 'DiscountSettings',
        value: JSON.stringify(form),
      })
      await getDiscountSetting()
    })
  }
  const deleteDiscountLevel = (index) => {
    discountSettingFormValues.value.discountLevels.splice(index, 1)
  }
  const onInfiniteChange = (row) => {
    discountSettingFormValues.value.discountLevels.forEach((level) => {
      level.infinite = false
    })
    row.infinite = true
  }
  const addDiscountLevel = () => {
    discountSettingFormValues.value.discountLevels.push({
      min: null,
      max: null,
      percent: null,
      infinite: false,
    })
  }
  onMounted(async () => {
    await getDiscountSetting()
  })

  const getDiscountSetting = async () => {
    const discountSetting = await discountStore.getDiscountSetting({
      name: 'DiscountSettings',
    })
    discountSettingFormValues.value = JSON.parse(discountSetting.value)
  }
  return {
    discountStore,
    discountSettingFormValues,

    onSubmitForm,

    discountLevelsColumns,
    getCurrenciesWithFlags,
    deleteDiscountLevel,
    onInfiniteChange,
    addDiscountLevel,
    getTransactionCodesByGroups,
    cashDesks,
  }
}
