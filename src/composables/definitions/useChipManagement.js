import { useChipManagementStore } from 'src/stores/chip-management-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Dialog, format } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { LocalStorage } from 'quasar'
export function useChipManagement() {
  const { capitalize } = format
  const chipManagementStore = useChipManagementStore()
  const currencyStore = useCurrencyStore()
  const { currencies } = storeToRefs(currencyStore)
  const { gamingChipTypes, chipColors, chipTransactionTypes } = storeToRefs(chipManagementStore)
  const chipFormValues = ref({
    id: null,
    type: 'Chip',
    color: null,
    denominations: [],
    name: null,
  })
  const denominationFormValues = ref({
    id: 0,
    gamingChipId: null,
    value: null,
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
  })
  const chipDialog = ref(false)
  const chipColumns = ref([
    {
      name: 'id',
      label: 'Id',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'color',
    },
    {
      field: 'currencyName',
    },
    {
      field: 'createdAt',
      fieldType: 'date',
    },
    {
      field: 'createdByName',
    },
    {
      field: 'isDeleted',
      fieldType: 'boolean',
    },
    {
      field: 'actions',
    },
  ])
  const denominationColumns = ref([
    {
      name: 'name',
      align: 'center',
      label: 'Name',
      field: 'name',
      sortable: false,
      visible: true,
    },
    {
      name: 'value',
      align: 'center',
      label: 'Value',
      field: 'value',
      sortable: false,
      visible: true,
    },
    {
      name: 'code',
      align: 'center',
      label: 'Code',
      field: 'code',
      sortable: false,
      visible: true,
    },

    {
      name: 'Action',
      align: 'center',
      label: 'Action',
      field: 'Id',
      sortable: false,
      visible: true,
    },
  ])
  const chipRefTable = ref(null)
  const openChipDialog = () => {
    chipDialog.value = true
  }
  const resetChipFormValues = () => {
    chipFormValues.value = {
      id: null,
      type: 'Chip',
      color: null,
      denominations: [],
      name: null,
    }
  }
  const onSubmitChipForm = async () => {
    const form = { ...chipFormValues.value }
    if (form.id) {
      await chipManagementStore.updateChip(form)
      chipDialog.value = false
      resetChipFormValues()
      chipRefTable.value.fetchData()
    } else {
      delete form.id
      const chipDenomination = form.denominations.map((denomination) => ({
        value: denomination.value,
        name: denomination.name,
        code: denomination.code,
      }))
      form.denominations = chipDenomination
      await chipManagementStore.createChip(form)
      chipDialog.value = false
      resetChipFormValues()
      chipRefTable.value.fetchData()
    }
  }
  const onEditChip = async (id) => {
    const data = await chipManagementStore.getChip({ id })
    data.type = capitalize(data.type)
    chipFormValues.value = { ...data }
    chipDialog.value = true
  }
  const onDeleteChip = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('chips'),
      }),
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
      await chipManagementStore.deleteChip({ id: props.id })
      chipRefTable.value.fetchData()
    })
  }

  const onHandleSubmitDenomination = () => {
    chipFormValues.value.denominations.push({ ...denominationFormValues.value })
    denominationFormValues.value = {
      chipId: chipFormValues.value.id || null,
      value: null,
      name: '',
      id: 0,
    }
    chipDialog.value = true
  }
  const onHandleRemoveDenomination = (rowIndex, row) => {
    if (row.id) {
      chipManagementStore.deleteGameChipDenomination({ id: row.id }).then(() => {
        chipFormValues.value.denominations.splice(rowIndex, 1)
      })
    } else {
      chipFormValues.value.denominations.splice(rowIndex, 1)
    }
  }

  const currentChipOperationTab = ref('chipStock')
  const chipOperationTabs = ref([
    {
      label: 'chipStock',
      elPermission: 'Addon.ChipOperations.Tab.ShowChipStock',
      icon: 'o_casino',
      name: 'chipStock',
    },
    {
      label: 'chipTransfer',
      elPermission: 'Addon.ChipOperations.Tab.ShowChipTransfer',
      icon: 'o_import_export',
      name: 'chipTransfer',
    },
  ])

  const onChangeChipOperationTab = (tab) => {
    currentChipOperationTab.value = tab
    LocalStorage.set('currentChipOperationTab', tab)
  }
  return {
    chipManagementStore,
    chipFormValues,
    chipDialog,
    chipColumns,
    chipRefTable,
    openChipDialog,
    resetChipFormValues,
    onSubmitChipForm,
    onEditChip,
    onDeleteChip,
    currencies,
    gamingChipTypes,
    denominationColumns,
    onHandleSubmitDenomination,
    denominationFormValues,
    onHandleRemoveDenomination,
    chipColors,

    /********** Chip Operation **********/
    currentChipOperationTab,
    chipOperationTabs,
    chipTransactionTypes,
    onChangeChipOperationTab,
  }
}
