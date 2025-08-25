import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { ref } from 'vue'
import { Dialog } from 'quasar'
import { i18n } from 'src/boot/i18n'
export function useGuestManagement() {
  const guestManagementStore = useGuestManagementStore()
  const giftFormValues = ref({
    id: null,
    name: null,
  })
  const giftDialog = ref(false)
  const giftColumns = ref([
    {
      name: 'id',
      label: 'Id',
      field: 'id',
    },
    {
      name: 'name',
      label: 'Name',
      field: 'name',
    },
    {
      field: 'createdAt',
      fieldType: 'date',
    },

    {
      field: 'isDeleted',
      fieldType: 'boolean',
    },

    {
      field: 'actions',
    },
  ])
  const giftRefTable = ref(null)
  const openGiftDialog = () => {
    giftDialog.value = true
  }
  const resetGiftFormValues = () => {
    giftFormValues.value = {
      id: null,
      name: null,
    }
  }
  const onSubmitGiftForm = async () => {
    const form = { ...giftFormValues.value }
    if (form.id) {
      await guestManagementStore.updateGift(form)
      giftDialog.value = false
      resetGiftFormValues()
      giftRefTable.value.fetchData()
    } else {
      delete form.id
      await guestManagementStore.createGift(form)
      giftDialog.value = false
      resetGiftFormValues()
      giftRefTable.value.fetchData()
    }
  }
  const onEditGift = async (id) => {
    const data = await guestManagementStore.getGift({ id })
    giftFormValues.value = { ...data }
    giftDialog.value = true
  }
  const onDeleteGift = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('gifts'),
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
      await guestManagementStore.deleteGift({ id: props.id })
      giftRefTable.value.fetchData()
    })
  }
  const roomTypeFormValues = ref({
    id: null,
    name: null,
    description: null,
    price: null,
    multiplier: null,
    isActive: true,
  })
  const roomTypeDialog = ref(false)
  const roomTypeColumns = ref([
    {
      name: 'id',
      label: 'Id',
      field: 'id',
    },
    {
      name: 'name',
      label: 'Name',
      field: 'name',
    },
    {
      field: 'description',
    },
    {
      field: 'price',
      fieldType: 'price',
    },
    {
      field: 'multiplier',
    },
    {
      field: 'isActive',
      fieldType: 'boolean',
    },

    {
      field: 'actions',
    },
  ])
  const roomTypeRefTable = ref(null)
  const openRoomTypeDialog = () => {
    roomTypeDialog.value = true
  }
  const resetRoomTypeFormValues = () => {
    roomTypeFormValues.value = {
      id: null,
      name: null,
      description: null,
      price: null,
      multiplier: null,
      isActive: true,
    }
  }
  const onSubmitRoomTypeForm = async () => {
    const form = { ...roomTypeFormValues.value }
    if (form.id) {
      await guestManagementStore.updateRoomType(form)
      roomTypeDialog.value = false
      resetRoomTypeFormValues()
      roomTypeRefTable.value.fetchData()
    } else {
      delete form.id
      await guestManagementStore.createRoomType(form)
      roomTypeDialog.value = false
      resetRoomTypeFormValues()
      roomTypeRefTable.value.fetchData()
    }
  }
  const onEditRoomType = async (id) => {
    const data = await guestManagementStore.getRoomType({ id })
    roomTypeFormValues.value = { ...data }
    roomTypeDialog.value = true
  }
  const onDeleteRoomType = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('gifts'),
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
      await guestManagementStore.deleteRoomType({ id: props.id })
      roomTypeRefTable.value.fetchData()
    })
  }

  /** Player Category */
  const playerCategoryFormValues = ref({
    id: null,
    name: null,
    isActive: true,
  })
  const playerCategoryDialog = ref(false)
  const playerCategoryColumns = ref([
    {
      name: 'id',
      label: 'Id',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'isActive',
      fieldType: 'boolean',
    },
    {
      field: 'actions',
    },
  ])
  const playerCategoryRefTable = ref(null)
  const openPlayerCategoryDialog = () => {
    playerCategoryDialog.value = true
  }
  const resetPlayerCategoryFormValues = () => {
    playerCategoryFormValues.value = {
      id: null,
      name: null,
      isActive: true,
    }
  }
  const onSubmitPlayerCategoryForm = async () => {
    const form = { ...playerCategoryFormValues.value }
    if (form.id) {
      await guestManagementStore.updatePlayerCategory(form)
      playerCategoryDialog.value = false
      resetPlayerCategoryFormValues()
      playerCategoryRefTable.value.fetchData()
    } else {
      delete form.id
      await guestManagementStore.createPlayerCategory(form)
      playerCategoryDialog.value = false
      resetPlayerCategoryFormValues()
      playerCategoryRefTable.value.fetchData()
    }
  }
  const onEditPlayerCategory = async (id) => {
    const data = await guestManagementStore.getPlayerCategory({ id })
    playerCategoryFormValues.value = { ...data }
    playerCategoryDialog.value = true
  }
  const onDeletePlayerCategory = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('playerCategories'),
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
      await guestManagementStore.deletePlayerCategory({ id: props.id })
      playerCategoryRefTable.value.fetchData()
    })
  }

  /** Expense Parameter */
  const expenseParameterFormValues = ref({
    id: null,
    name: null,
    amount: null,
    dailyBasedQuantity: true,
  })
  const expenseParameterDialog = ref(false)
  const expenseParameterColumns = ref([
    {
      name: 'id',
      label: 'Id',
      field: 'id',
    },
    {
      field: 'name',
    },
    {
      field: 'amount',
      fieldType: 'price',
    },
    {
      field: 'dailyBasedQuantity',
      fieldType: 'boolean',
    },

    {
      field: 'actions',
    },
  ])
  const expenseParameterRefTable = ref(null)
  const openExpenseParameterDialog = () => {
    expenseParameterDialog.value = true
  }
  const resetExpenseParameterFormValues = () => {
    expenseParameterFormValues.value = {
      id: null,
      name: null,
      amount: null,
      dailyBasedQuantity: true,
    }
  }
  const onSubmitExpenseParameterForm = async () => {
    const form = { ...expenseParameterFormValues.value }
    if (form.id) {
      await guestManagementStore.updateExpenseParameter(form)
      expenseParameterDialog.value = false
      resetExpenseParameterFormValues()
      expenseParameterRefTable.value.fetchData()
    } else {
      delete form.id
      await guestManagementStore.createExpenseParameter(form)
      expenseParameterDialog.value = false
      resetExpenseParameterFormValues()
      expenseParameterRefTable.value.fetchData()
    }
  }
  const onEditExpenseParameter = async (id) => {
    const data = await guestManagementStore.getExpenseParameter({ id })
    expenseParameterFormValues.value = { ...data }
    expenseParameterDialog.value = true
  }
  const onDeleteExpenseParameter = (props) => {
    Dialog.create({
      title: i18n.global.t('delete'),
      message: i18n.global.t('deleteMessage', {
        name: i18n.global.t('expenseParameters'),
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
      await guestManagementStore.deleteExpenseParameter({ id: props.id })
      expenseParameterRefTable.value.fetchData()
    })
  }
  return {
    /** Gift */
    guestManagementStore,
    giftFormValues,
    giftDialog,
    openGiftDialog,
    onSubmitGiftForm,
    onEditGift,
    onDeleteGift,
    giftColumns,
    giftRefTable,

    /** Room Type */
    roomTypeFormValues,
    roomTypeDialog,
    roomTypeColumns,
    roomTypeRefTable,
    openRoomTypeDialog,
    onSubmitRoomTypeForm,
    onEditRoomType,
    onDeleteRoomType,

    /** Player Category */
    playerCategoryFormValues,
    playerCategoryDialog,
    playerCategoryColumns,
    playerCategoryRefTable,
    openPlayerCategoryDialog,
    onSubmitPlayerCategoryForm,
    onEditPlayerCategory,
    onDeletePlayerCategory,

    /** Expense Parameter */
    expenseParameterFormValues,
    expenseParameterDialog,
    expenseParameterColumns,
    expenseParameterRefTable,
    openExpenseParameterDialog,
    onSubmitExpenseParameterForm,
    onEditExpenseParameter,
    onDeleteExpenseParameter,
  }
}
