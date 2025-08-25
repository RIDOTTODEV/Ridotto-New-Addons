import { usePlayerClassStore } from 'src/stores/player-class-store'
import { ref, onMounted } from 'vue'
import { Dialog, Loading } from 'quasar'
import { i18n } from 'src/boot/i18n'

export function usePlayerClass() {
  const playerClassStore = usePlayerClassStore()
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
      field: 'discount',
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
    discount: null,
  })
  const refTable = ref(null)
  const resetFormValues = () => {
    formValues.value = {
      id: null,
      name: null,
      discount: null,
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
      playerClassStore.updatePlayerClass({ ...form }).then(() => {
        dialog.value = false
        resetFormValues()
        refTable.value.requestServerInteraction()
      })
    } else {
      delete form.id
      playerClassStore.createPlayerClass({ ...form }).then(() => {
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
    const data = await playerClassStore.getPlayerClass({ id: props.id })
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
      await playerClassStore.deletePlayerClass(props.id)
      Loading.hide()
      refTable.value.requestServerInteraction()
    })
  }
  onMounted(async () => {})
  return {
    playerClassStore,
    columns,
    dialog,
    formValues,
    openDialog,
    onSubmitForm,
    editForm,
    deleteForm,
    refTable,
  }
}
