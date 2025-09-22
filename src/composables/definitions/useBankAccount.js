import { useBankAccountStore } from 'src/stores/bank-account-store'
import { useCurrencyStore } from 'src/stores/currency-store'
import { ref, onMounted } from 'vue'
import { Dialog, Loading } from 'quasar'
import { i18n } from 'src/boot/i18n'
import { storeToRefs } from 'pinia'

export function useBankAccount() {
  const bankAccountStore = useBankAccountStore()
  const currencyStore = useCurrencyStore()
  const { currencies, getCurrencyById } = storeToRefs(currencyStore)
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
      field: 'total',
      fieldType: 'total',
    },
    {
      field: 'currencyId',
      fieldType: 'custom',
      customFormat: (value) => {
        const currency = getCurrencyById.value(value)
        return currency.name || '-'
      },
    },
    {
      field: 'createdAt',
      fieldType: 'date',
    },
    {
      field: 'createdBy',
    },
    {
      field: 'createdByName',
    },

    {
      field: 'actions',
    },
  ])

  const dialog = ref(false)
  const formValues = ref({
    id: null,
    name: null,
    currencyId: null,
  })
  const refTable = ref(null)
  const resetFormValues = () => {
    formValues.value = {
      id: null,
      name: null,
      currencyId: null,
    }
  }
  const openDialog = () => {
    Loading.show()
    resetFormValues()
    dialog.value = true
    Loading.hide()
  }
  const onSubmitForm = () => {
    const form = { ...formValues.value }
    if (form.id) {
      bankAccountStore.updateBankAccount({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
        refTable.value.requestServerInteraction()
      })
    } else {
      delete form.id
      bankAccountStore.createBankAccount({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
        refTable.value.requestServerInteraction()
      })
    }
  }
  const editForm = async (props) => {
    if (!props.id) {
      return
    }
    Loading.show()
    const data = await bankAccountStore.getBankAccount({ id: props.id })
    formValues.value = data
    dialog.value = true
    Loading.hide()
  }
  const deleteForm = (props) => {
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
      await bankAccountStore.deleteBankAccount({ id: props.id })
      Loading.hide()
      refTable.value.requestServerInteraction()
    })
  }
  onMounted(async () => {})
  return {
    bankAccountStore,
    columns,
    dialog,
    formValues,
    openDialog,
    onSubmitForm,
    editForm,
    deleteForm,
    refTable,
    currencies,
  }
}
