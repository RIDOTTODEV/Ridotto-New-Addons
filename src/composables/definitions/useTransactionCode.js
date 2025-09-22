import { ref, onMounted } from 'vue'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { storeToRefs } from 'pinia'
import { queryParams } from 'src/helpers/types'
import { i18n } from 'src/boot/i18n'
import { Dialog, Loading } from 'quasar'
export const useTransactionCode = () => {
  const transactionCodeStore = useTransactionCodeStore()
  const transactionCodeRefTable = ref(null)
  const {
    transactionCodes,
    transactionCodeTypes,
    transactionCodeGroupTypes,
    transTypes,
    getTransactionCodesByTransType,
  } = storeToRefs(transactionCodeStore)

  const columns = ref([
    {
      name: 'id',
      label: 'ID',
      field: 'id',
      required: true,
    },
    {
      field: 'name',
      sortable: true,
    },
    {
      field: 'transType',
      sortable: false,
    },
    {
      field: 'isDaily',
      fieldType: 'boolean',
    },
    {
      field: 'transactionCodeType',
    },
    {
      field: 'defaultIsInOut',
      fieldType: 'boolean',
    },
    {
      field: 'gamingExpenses',
      fieldType: 'boolean',
    },
    {
      field: 'toBeCollected',
      fieldType: 'boolean',
    },
    {
      field: 'dueDateRequired',
      fieldType: 'boolean',
    },
    {
      field: 'createdAt',
      fieldType: 'date',
    },
    {
      field: 'createdByName',
    },
    {
      field: 'updatedByName',
    },
    {
      field: 'updatedAt',
      fieldType: 'date',
    },
    {
      field: 'actions',
    },
  ])

  const dialog = ref(false)
  const formValues = ref({
    id: null,
    name: null,
    isDaily: false,
    authorizeByRequired: false,
    dueDateRequired: false,
    defaultIsInOut: false,
    transactionCodeType: 'Cash',
    transactionCodeGroupTypes: [],
    gamingExpenses: false,
    toBeCollected: false,
    transType: null,
  })
  const filterParams = ref({
    ...queryParams(),
  })

  const resetFormValues = () => {
    formValues.value = {
      id: null,
      name: null,
      isDaily: false,
      authorizeByRequired: false,
      dueDateRequired: false,
      defaultIsInOut: false,
      transactionCodeType: 'cash',
      transactionCodeGroupTypes: [],
      gamingExpenses: false,
      toBeCollected: false,
    }
  }
  const openDialog = () => {
    resetFormValues()
    dialog.value = true
  }
  const onSubmitForm = () => {
    const form = { ...formValues.value }
    if (form.id) {
      transactionCodeStore.updateTransactionCode({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
        transactionCodeRefTable.value.requestServerInteraction()
      })
    } else {
      delete form.id
      transactionCodeStore.createTransactionCode({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
        transactionCodeRefTable.value.requestServerInteraction()
      })
    }
  }
  const editForm = async (props) => {
    const data = { ...props }
    Loading.show()
    await transactionCodeStore
      .fetchTransactionCode({
        id: data.id,
      })
      .then((res) => {
        formValues.value = res
        dialog.value = true
      })
      .finally(() => {
        Loading.hide()
      })
  }
  const deleteForm = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('transactionCodes.transactionCode'),
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
      Loading.show()
      await transactionCodeStore.deleteTransactionCode(props.id)
      Loading.hide()
      transactionCodeRefTable.value.requestServerInteraction()
    })
  }
  onMounted(async () => {
    await transactionCodeStore.fetchTransactionCodeTypes()
    await transactionCodeStore.fetchTransTypes()
    await transactionCodeStore.fetchTransactionCodeGroupTypes()
  })
  return {
    transactionCodes,
    filterParams,
    columns,
    transactionCodeStore,
    dialog,
    formValues,
    openDialog,
    onSubmitForm,
    editForm,
    deleteForm,
    transactionCodeTypes,
    transactionCodeGroupTypes,
    transTypes,
    getTransactionCodesByTransType,
    transactionCodeRefTable,
  }
}
