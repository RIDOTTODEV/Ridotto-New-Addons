import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { Dialog, Loading } from 'quasar'
import { i18n } from 'src/boot/i18n'

export function useCashdesk() {
  const cashdeskStore = useCashdeskStore()
  const { cashdesks } = storeToRefs(cashdeskStore)
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
      field: 'uniqueId',
    },
    {
      field: 'cashdeskLastSeq',
    },
    {
      field: 'gamingDateId',
    },
    {
      field: 'isCountActive',
      fieldType: 'boolean',
    },
    {
      field: 'isChipAccepted',
      fieldType: 'boolean',
    },
    {
      field: 'isActive',
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
      field: 'updatedAt',
      fieldType: 'date',
    },
    {
      field: 'updatedByName',
    },
    {
      field: 'isDeleted',
      fieldType: 'boolean',
    },
    {
      field: 'actions',
    },
  ])
  const dialog = ref(false)
  const formValues = ref({
    id: null,
    name: null,
    uniqueId:
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  })
  const resetFormValues = () => {
    formValues.value = {
      id: null,
      name: null,
      isChipAccepted: false,
      uniqueId:
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // dummy unique id
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
      cashdeskStore.updateCashDesk({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
      })
    } else {
      delete form.id
      cashdeskStore.createCashDesk({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
      })
    }
  }
  const editForm = async (props) => {
    Loading.show()
    const data = await cashdeskStore.getCashDesk({ id: props.id })
    formValues.value = data
    dialog.value = true
    Loading.hide()
  }
  const deleteForm = (props) => {
    Loading.show()
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
      await cashdeskStore.deleteCashDesk(props.id)
      Loading.hide()
    })
  }
  onMounted(async () => {
    await cashdeskStore.fetchCashdesks()
  })
  return {
    cashdeskStore,
    cashdesks,
    columns,
    dialog,
    formValues,
    openDialog,
    onSubmitForm,
    editForm,
    deleteForm,
  }
}
