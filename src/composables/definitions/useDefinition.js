import { ref } from 'vue'

import { useDefinitionStore } from 'src/stores/definition-store'
import { Dialog } from 'quasar'
import { i18n } from 'src/boot/i18n'

export function useDefinition() {
  const definitionStore = useDefinitionStore()
  const locationDialog = ref(false)
  const locationFormValues = ref({
    id: 0,
    name: null,
    phoneNumber: null,
  })
  const locationsColumns = ref([
    {
      name: 'id',
      label: 'ID',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'phoneNumber',
    },
    {
      field: 'actions',
    },
  ])
  const locationRefTable = ref(null)
  const openLocationDialog = () => {
    locationDialog.value = true
  }
  const resetLocationFormValues = () => {
    locationFormValues.value = {
      id: null,
      name: null,
      phoneNumber: null,
    }
  }
  const onSubmitLocationForm = async () => {
    const form = { ...locationFormValues.value }
    if (form.id) {
      await definitionStore.updateLocation({ ...form })
      locationDialog.value = false
      resetLocationFormValues()
    } else {
      await definitionStore.createLocation({ ...form })
      locationDialog.value = false
      resetLocationFormValues()
    }

    await locationRefTable.value.fetchData()
  }
  const onEditLocation = async (id) => {
    const data = await definitionStore.getLocation({ id })
    locationFormValues.value = { ...data }
    locationDialog.value = true
  }
  const onDeleteLocation = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', { name: i18n.global.t('locations') }),
      persistent: true,
      focus: 'cancel',
      ok: {
        flat: true,
        color: 'negative',
        label: i18n.global.t('delete'),
        class: 'text-capitalize',
        dataCy: 'delete',
      },
    }).onOk(async () => {
      await definitionStore.deleteLocation({ id: props.id })
      locationRefTable.value.fetchData()
    })
  }
  return {
    onSubmitLocationForm,
    locationsColumns,
    locationDialog,
    locationFormValues,
    locationRefTable,
    openLocationDialog,
    resetLocationFormValues,
    definitionStore,
    onEditLocation,
    onDeleteLocation,
  }
}
