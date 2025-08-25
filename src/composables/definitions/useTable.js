import { useTableStore } from 'src/stores/table-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { useChipManagementStore } from 'src/stores/chip-management-store'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Dialog, Loading } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { formatPrice } from 'src/helpers/helpers'

export function useTables() {
  const tableStore = useTableStore()
  const currencyStore = useCurrencyStore()
  const { currencies } = storeToRefs(currencyStore)
  const chipManagementStore = useChipManagementStore()
  const { chips, getDenominationByChipId, getDenominationChipType } =
    storeToRefs(chipManagementStore)
  const tableGameColumns = ref([
    {
      name: 'id',
      label: 'ID',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'timePerHand',
    },
    {
      field: 'houseEdge',
    },
    {
      field: 'createdAt',
      fieldType: 'date',
    },
    {
      field: 'createdByName',
    },
    {
      field: 'actions',
    },
  ])
  const dialog = ref(false)
  const gameFormValues = ref({
    id: null,
    name: null,
    timePerHand: null,
    houseEdge: null,
  })
  const refTable = ref(null)
  const resetGameFormValues = () => {
    gameFormValues.value = {
      id: null,
      name: null,
      discount: null,
    }
  }
  const openDialog = () => {
    Loading.show()
    resetGameFormValues()
    dialog.value = true
    Loading.hide()
  }
  const onSubmitTableGameForm = () => {
    const form = { ...gameFormValues.value }
    if (form.id) {
      tableStore.updateTableGame({ ...form }).then(() => {
        dialog.value = false
        resetGameFormValues()
        refTable.value.requestServerInteraction()
      })
    } else {
      delete form.id
      tableStore.createTableGame({ ...form }).then(() => {
        dialog.value = false
        resetGameFormValues()
        refTable.value.requestServerInteraction()
      })
    }
  }
  const editTableGame = async (props) => {
    if (!props.id) {
      return
    }
    Loading.show()
    const data = await tableStore.getTableGame({ id: props.id })
    gameFormValues.value = data
    dialog.value = true
    Loading.hide()
  }
  const deleteTableGame = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', { name: i18n.global.t('title') }),
      persistent: true,
      focus: 'cancel',
      ok: {
        flat: true,
        color: 'negative',
        label: i18n.global.t('delete'),
        class: 'text-capitalize',
        dataCy: 'delete',
      },
      cancel: {
        flat: true,
        color: 'primary',
        label: i18n.global.t('cancel'),
        class: 'text-capitalize',
      },
    }).onOk(async () => {
      Loading.show()
      await tableStore.deleteTableGame({ id: props.id })
      Loading.hide()
      refTable.value.requestServerInteraction()
    })
  }

  /********** Float Set **********/
  const floatSetFormValues = ref({
    id: null,
    name: null,
    currencyId: null,
    selectedChip: null,
    floatDenoms: [],
  })
  const floatSetColumns = ref([
    {
      name: 'id',
      label: 'ID',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'currencyName',
    },
    {
      field: 'totalAmount',
      fieldType: 'price',
    },
    {
      field: 'floatDenoms',
    },
    {
      field: 'actions',
    },
  ])
  const floatDenomColumns = ref([
    {
      name: 'chipDenomId',
      align: 'center',
      label: 'ID',
      field: 'chipDenomId',
      sortable: true,
      visible: true,
    },
    {
      name: 'value',
      align: 'center',
      label: 'Value',
      field: 'value',
      sortable: true,
      visible: true,
    },
    {
      name: 'quantity',
      align: 'center',
      label: 'Quantity',
      field: 'quantity',
      sortable: false,
      visible: true,
    },
    {
      name: 'amount',
      align: 'center',
      label: 'Amount',
      field: 'amount',
      sortable: true,
      visible: true,
      format: (val) => formatPrice(val),
    },
    {
      name: 'action',
      align: 'center',
      label: 'Action',
      field: 'id',
      sortable: false,
      visible: true,
    },
  ])
  const floatSetDialog = ref(false)
  const floatSetRefTable = ref(null)

  const resetFloatSetFormValues = () => {
    floatSetFormValues.value = {
      id: null,
      name: null,
      currencyId: null,
    }
  }
  const onSubmitFloatSetForm = () => {
    const form = { ...floatSetFormValues.value }
    if (form.id) {
      tableStore.updateFloatSet({ ...form }).then(() => {
        floatSetDialog.value = false
        resetFloatSetFormValues()
        floatSetRefTable.value.requestServerInteraction()
      })
    } else {
      delete form.id

      form.floatDenoms = form.floatDenoms.map((item) => {
        return {
          chipDenomId: item.chipDenomId,
          chipCurrencyId: item.chipCurrencyId,
          quantity: item.quantity,
          amount: item.amount,
        }
      })
      tableStore.createFloatSet({ ...form }).then(() => {
        floatSetDialog.value = false
        resetFloatSetFormValues()
        floatSetRefTable.value.requestServerInteraction()
      })
    }
  }
  const editFloatSet = async (props) => {
    if (!props.id) {
      return
    }
    Loading.show()
    const data = await tableStore.getFloatSet({ id: props.id })
    floatSetFormValues.value = { ...data }
    floatSetDialog.value = true
    Loading.hide()
    onChangeFloatSetCurrency(data.currencyId)
  }
  const deleteFloatSet = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', { name: i18n.global.t('title') }),
      persistent: true,
      focus: 'cancel',
      ok: {
        flat: true,
        color: 'negative',
        label: i18n.global.t('delete'),
        class: 'text-capitalize',
        dataCy: 'delete',
      },
      cancel: {
        flat: true,
        color: 'primary',
        label: i18n.global.t('cancel'),
        class: 'text-capitalize',
      },
    }).onOk(async () => {
      Loading.show()
      await tableStore.deleteFloatSet({ id: props.id })
      Loading.hide()
      floatSetRefTable.value.requestServerInteraction()
    })
  }
  const openFloatSetDialog = () => {
    floatSetDialog.value = true
  }
  const onClickDeleteDenomination = (props) => {
    if (floatSetFormValues.value?.id) {
      tableStore.deleteFloatDenom({ id: props.row.id }).then(() => {
        floatSetFormValues.value.floatDenoms.splice(props.rowIndex, 1)
      })
    } else {
      floatSetFormValues.value.floatDenoms.splice(props.rowIndex, 1)
    }
  }
  const floatSetChips = ref([])
  const onChangeFloatSetCurrency = (currencyId) => {
    floatSetFormValues.value.selectedChip = null
    floatSetChips.value = chips.value.filter((chip) => chip.currencyId === currencyId)
  }
  return {
    tableStore,
    tableGameColumns,
    dialog,
    gameFormValues,
    openDialog,
    onSubmitTableGameForm,
    editTableGame,
    deleteTableGame,
    refTable,
    /********** Float Set **********/
    floatSetFormValues,
    floatSetColumns,
    floatSetDialog,
    floatSetRefTable,
    openFloatSetDialog,
    resetFloatSetFormValues,
    onSubmitFloatSetForm,
    editFloatSet,
    deleteFloatSet,
    floatDenomColumns,
    onClickDeleteDenomination,
    currencies,
    floatSetChips,
    onChangeFloatSetCurrency,
    chipManagementStore,
    getDenominationByChipId,
    getDenominationChipType,
  }
}
