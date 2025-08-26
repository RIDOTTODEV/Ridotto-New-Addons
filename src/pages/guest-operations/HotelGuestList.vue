<script setup>
import { onMounted, defineAsyncComponent, ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { usePlayerStore } from 'src/stores/player-store'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { storeToRefs } from 'pinia'
import { formatPrice } from 'src/helpers/helpers'
const $q = useQuasar()
const playerStore = usePlayerStore()
const guestManagementStore = useGuestManagementStore()
// Add reactive variable for edit mode
const isEditingReservationDetails = ref(false)

// Custom player search functionality for guest (without navigation)

const guestPlayersOption = ref([])
const guestLoading = ref(false)

const onGuestFilter = async (val, update) => {
  if (val === '') {
    update(() => {
      guestPlayersOption.value = []
    })
    guestLoading.value = false
    return
  }

  const needle = val.toLowerCase()
  guestLoading.value = true
  const players = await playerStore.searchPlayer(needle)
  update(() => {
    guestPlayersOption.value = players
    guestLoading.value = false
  })
}

// Custom player search functionality for roommate (without navigation)
const selectedRoomMate = ref(null)
const roomMatePlayersOption = ref([])
const roomMateLoading = ref(false)

// Custom expense parameter selection
const selectedExpenseParameter = ref(null)
const newExpenseEntry = ref({
  quantity: 1,
  value: 0,
  amount: 0,
})

// Expense Settings Modal
const expenseSettings = ref({
  hotelExpenseTypeId: null,
  flightExpenseTypeId: null,
  flightReturnTicketExpenseTypeId: null,
})

const onRoomMateFilter = async (val, update) => {
  if (val === '') {
    update(() => {
      roomMatePlayersOption.value = []
    })
    roomMateLoading.value = false
    return
  }

  const needle = val.toLowerCase()
  roomMateLoading.value = true
  const players = await playerStore.searchPlayer(needle)
  update(() => {
    roomMatePlayersOption.value = players
    roomMateLoading.value = false
  })
}
const selectedGuest = ref(null)
const showCreateGuestCard = ref(false)
const guestListFilterParams = ref({})
const hotelReservationFormValues = ref({
  players: [],
  status: 'Pending',
  hotelFlightInfo: {
    //expenseDirection: 1,
    checkIn: '',
    checkOut: '',
    dayCount: 1,
    roomTypeId: null,
    roomType: '',
    roomNo: null,
    boardType: 'BB',
    roomPrice: 0,
    roomTotalPrice: 0,
    expenseUse: true,
    flight: '',
    ticketType: 'Casino',
    from: '',
    to: '',
    to2: '',
    pnr: '',
    pnr2: '',
    flightTicketPrice: 0,
    isBusiness: 0,
  },
  note: '',
  remark: '',
  phone: true,
  minibar: true,
  spa: true,
  fb: true,
  expenses: [],
})
const { flightTicketTypes, boardTypes, roomTypes, visitorCategories, expenseParameters } =
  storeToRefs(guestManagementStore)

const hideColumns = ref([])
const toggleHideColumns = ref(true)
const onHideColumns = () => {
  toggleHideColumns.value = !toggleHideColumns.value
}
const onSubmitNewReservation = async () => {
  let data = { ...hotelReservationFormValues.value }

  if (data.id) {
    // Update işlemi için sadece gerekli alanları gönder
    const updateData = {
      hotelReservationId: data.id,
      status: data.status || 'Pending',
      note: data.note || '',
      remark: data.remark || '',
      phone: data.phone || false,
      minibar: data.minibar || false,
      spa: data.spa || false,
      fb: data.fb || false,
    }

    const response = await guestManagementStore.updateHotelReservation(updateData)
    if (response) {
      showCreateGuestCard.value = false
      // Reload the guest list after update
      await guestManagementStore.fetchHotelReservations(guestListFilterParams.value)
    }
  } else {
    // Create işlemi için tüm datayı gönder
    data.hotelFlightInfo.isBusiness = data.hotelFlightInfo.isBusiness === true
    const response = await guestManagementStore.createHotelReservation(data)
    if (response) {
      showCreateGuestCard.value = false
      // Reload the guest list after creation
      await guestManagementStore.fetchHotelReservations(guestListFilterParams.value)
    }
  }
}

const onClickEditHotelGuestReservation = async (props) => {
  showCreateGuestCard.value = true

  const ownerPlayer = props.players.find((player) => player.roomOwner === true)

  const playerFullName = ownerPlayer.playerFullName.split(' ')
  const player = {
    playerId: ownerPlayer.playerId,
    id: ownerPlayer.playerId,
    name: playerFullName[0],
    surname: playerFullName[2],
  }
  selectedGuest.value = player
  hotelReservationFormValues.value = {
    ...props,
    expenses: [], // Expense'ler watch fonksiyonu tarafından yüklenecek
    hotelFlightInfo: {
      //expenseDirection: props.expenseDirection || 1,
      checkIn: props.checkIn || '',
      checkOut: props.checkOut || '',
      dayCount: props.dayCount || 0,
      roomTypeId: props.roomTypeId || null,
      roomType: props.roomType || '',
      roomNo: props.roomNo || null,
      boardType: props.boardType || 'BB',
      roomPrice: props.roomPrice || 0,
      roomTotalPrice: props.roomTotalPrice || 0,
      expenseUse: props.expenseUse || false,
      flight: props.flight || '',
      ticketType: props.ticketType || 'Casino',
      from: props.from || '',
      to: props.to || '',
      to2: props.to2 || '',
      pnr: props.pnr || '',
      pnr2: props.pnr2 || '',
      flightTicketPrice: props.flightTicketPrice || 0,
      isBusiness: props.isBusiness === true,
    },
  }
}
const onClickCreateHotelReservation = () => {
  // Reset form values for new reservation
  hotelReservationFormValues.value = {
    players: [],
    status: 'Pending',
    hotelFlightInfo: {
      //expenseDirection: 1,
      checkIn: '',
      checkOut: '',
      dayCount: 1,
      roomTypeId: null,
      roomType: '',
      roomNo: null,
      boardType: 'BB',
      roomPrice: 0,
      roomTotalPrice: 0,
      expenseUse: true,
      flight: '',
      ticketType: 'Casino',
      from: '',
      to: '',
      to2: '',
      pnr: '',
      pnr2: '',
      flightTicketPrice: 0,
      isBusiness: false,
    },
    note: '',
    remark: '',
    phone: true,
    minibar: true,
    spa: true,
    fb: true,
    expenses: [],
  }

  showCreateGuestCard.value = true
}

watch(
  () => expenseParameters.value,
  (newParams) => {
    hideColumns.value = [...newParams.map((param) => `expense_${param.id}`), 'totalExpense']
  },
  { immediate: true },
)
// Add computed properties for the guest category
const guestCategoryId = computed({
  get: () => hotelReservationFormValues.value.players?.[0]?.playerCategoryId || null,
  set: (value) => {
    if (!hotelReservationFormValues.value.players?.[0]) {
      hotelReservationFormValues.value.players = [
        {
          hotelReservationId: 0,
          playerId: null,
          playerFullName: '',
          playerCategoryId: null,
          playerCategoryName: '',
        },
      ]
    }

    // Ana misafir için kategoriyi set et
    hotelReservationFormValues.value.players[0].playerCategoryId = value

    // Tüm oda arkadaşları için de aynı kategoriyi set et
    if (hotelReservationFormValues.value.players.length > 1) {
      hotelReservationFormValues.value.players.forEach((player, index) => {
        if (index > 0) {
          // Ana misafir hariç (index 0)
          player.playerCategoryId = value
        }
      })
    }
  },
})

// Add computed property for automatic day count calculation
const dayCount = computed({
  get: () => {
    const checkIn = hotelReservationFormValues.value.hotelFlightInfo?.checkIn
    const checkOut = hotelReservationFormValues.value.hotelFlightInfo?.checkOut

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return dayDiff > 0 ? dayDiff : 1
    }

    return hotelReservationFormValues.value.hotelFlightInfo?.dayCount || 1
  },
  set: (value) => {
    if (hotelReservationFormValues.value.hotelFlightInfo) {
      hotelReservationFormValues.value.hotelFlightInfo.dayCount = value
    }
  },
})

// Watch for check-in and check-out changes to auto-calculate day count
watch(
  [
    () => hotelReservationFormValues.value.hotelFlightInfo?.checkIn,
    () => hotelReservationFormValues.value.hotelFlightInfo?.checkOut,
  ],
  () => {
    if (hotelReservationFormValues.value.hotelFlightInfo) {
      hotelReservationFormValues.value.hotelFlightInfo.dayCount = dayCount.value
      // Also recalculate room total price
      const roomPrice = hotelReservationFormValues.value.hotelFlightInfo.roomPrice || 0
      hotelReservationFormValues.value.hotelFlightInfo.roomTotalPrice = dayCount.value * roomPrice
    }
  },
)

// Watch for when modal opens and set selected guest in edit mode
watch(showCreateGuestCard, async (newValue) => {
  if (newValue && hotelReservationFormValues.value.players?.length > 0) {
    // Edit mode - set main guest (roomOwner)
    const mainGuest = hotelReservationFormValues.value.players.find((player) => player.roomOwner)
    if (mainGuest) {
      selectedGuest.value = {
        id: mainGuest.playerId,
        name: mainGuest.playerFullName?.split(' ')[0] || '',
        surname: mainGuest.playerFullName?.split(' ').slice(1).join(' ') || '',
        profilePhoto: null,
        categoryId: mainGuest.playerCategoryId,
        categoryName: mainGuest.playerCategoryName,
      }
    }
  } else {
    // Create mode - clear selections
    selectedGuest.value = null
    selectedRoomMate.value = null
    // Reset players array to initial state with empty main guest
    hotelReservationFormValues.value.players = [
      {
        hotelReservationId: 0,
        playerId: null,
        playerFullName: '',
        playerCategoryId: null,
        playerCategoryName: '',
        roomOwner: true,
      },
    ]
  }
})

// Separate watch for fetching expenses
watch(
  () => hotelReservationFormValues.value.id,
  async (newId) => {
    if (newId && showCreateGuestCard.value && hotelReservationFormValues.value.players?.[0]) {
      await fetchReservationExpenses(
        newId,
        //hotelReservationFormValues.value.players[0].playerId
      )
    }
  },
  { immediate: true },
)

const handleCloseModal = async () => {
  showCreateGuestCard.value = false
  isEditingReservationDetails.value = false
  // Clear search selections
  selectedGuest.value = null
  selectedRoomMate.value = null
  selectedExpenseParameter.value = null
  // Reset players array to initial state
  if (hotelReservationFormValues.value.players) {
    hotelReservationFormValues.value.players = [
      {
        hotelReservationId: 0,
        playerId: null,
        playerFullName: '',
        playerCategoryId: null,
        playerCategoryName: '',
        roomOwner: true,
      },
    ]
  }
  // Clear expenses array
  if (hotelReservationFormValues.value.expenses) {
    hotelReservationFormValues.value.expenses = []
  }
}

const toggleEditMode = () => {
  isEditingReservationDetails.value = !isEditingReservationDetails.value
}

// Function to fetch reservation expenses
const fetchReservationExpenses = async (hotelReservationId) => {
  const expenses = await guestManagementStore.fetchExpenses({
    hotelReservationId: hotelReservationId,
  })

  if (expenses && expenses.data) {
    // Map expenses with player information
    hotelReservationFormValues.value.expenses = expenses.data.map((expense) => ({
      ...expense,
      playerName:
        expense.playerName ||
        hotelReservationFormValues.value.players?.find((p) => p.playerId === expense.playerId)
          ?.playerFullName ||
        '',
    }))
  }
}

const updateReservationDetails = async () => {
  try {
    // Prepare data for updateHotelFlightInfo API
    const updateData = {
      hotelReservationId: hotelReservationFormValues.value.id,
      flightTicketReturnPrice: hotelReservationFormValues.value.flightTicketReturnPrice || 0,
      hotelFlightInfo: {
        expenseDirection: hotelReservationFormValues.value.hotelFlightInfo.expenseDirection || 1,
        checkIn: hotelReservationFormValues.value.hotelFlightInfo.checkIn,
        checkOut: hotelReservationFormValues.value.hotelFlightInfo.checkOut,
        dayCount: hotelReservationFormValues.value.hotelFlightInfo.dayCount || dayCount.value,
        roomTypeId: hotelReservationFormValues.value.hotelFlightInfo.roomTypeId,
        roomType: hotelReservationFormValues.value.hotelFlightInfo.roomType || '',
        roomNo: hotelReservationFormValues.value.hotelFlightInfo.roomNo || 0,
        boardType: hotelReservationFormValues.value.hotelFlightInfo.boardType || 'BB',
        roomPrice: hotelReservationFormValues.value.hotelFlightInfo.roomPrice || 0,
        roomTotalPrice: hotelReservationFormValues.value.hotelFlightInfo.roomTotalPrice || 0,
        expenseUse: hotelReservationFormValues.value.hotelFlightInfo.expenseUse || false,
        flight: hotelReservationFormValues.value.hotelFlightInfo.flight || '',
        ticketType: hotelReservationFormValues.value.hotelFlightInfo.ticketType || 'Casino',
        from: hotelReservationFormValues.value.hotelFlightInfo.from || '',
        to: hotelReservationFormValues.value.hotelFlightInfo.to || '',
        to2: hotelReservationFormValues.value.hotelFlightInfo.to2 || '',
        pnr: hotelReservationFormValues.value.hotelFlightInfo.pnr || '',
        pnr2: hotelReservationFormValues.value.hotelFlightInfo.pnr2 || '',
        flightTicketPrice: hotelReservationFormValues.value.hotelFlightInfo.flightTicketPrice || 0,
        isBusiness: hotelReservationFormValues.value.hotelFlightInfo.isBusiness || false,
      },
    }

    // Update hotel flight info
    const success = await guestManagementStore.updateHotelFlightInfo(updateData)

    if (success) {
      $q.notify({
        type: 'positive',
        message: $q.lang.table?.recordsSaved || 'Hotel flight information updated successfully',
        position: 'top-right',
      })

      isEditingReservationDetails.value = false

      // Refresh the table using event bus
    }
  } catch (error) {
    console.error('Failed to update hotel flight information:', error)
    $q.notify({
      type: 'negative',
      message: $q.lang.table?.noData || 'Failed to update hotel flight information',
      position: 'top-right',
    })
  }
}

const calculateGrandTotal = () => {
  if (!hotelReservationFormValues.value.expenses?.length) return '0.00'

  const total = hotelReservationFormValues.value.expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount || 0)
  }, 0)

  return total.toFixed(2)
}

const openExpenseSettingsDialog = () => {
  // Load current settings first
  loadExpenseSettings().then(() => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import('../../components/pages/guest-operations/ExpenseSettingsDialog.vue'),
      ),
      componentProps: {
        settings: expenseSettings.value,
        expenseParameters: expenseParameters.value,
        actionFn: saveExpenseSettings,
      },
    })
  })
}

const loadExpenseSettings = async () => {
  try {
    const response = await api.get('/api/ApplicationSetting/GetSettings', {
      params: { name: 'HotelExpenseSettings' },
    })

    if (response.data && response.data.value) {
      const settings = JSON.parse(response.data.value)
      expenseSettings.value = {
        hotelExpenseTypeId: settings.HotelExpenseTypeId || null,
        flightExpenseTypeId: settings.FlightExpenseTypeId || null,
        flightReturnTicketExpenseTypeId: settings.FlightReturnTicketExpenseTypeId || null,
      }
    }
  } catch (error) {
    console.error('Failed to load expense settings:', error)
    // Reset to default values if loading fails
    expenseSettings.value = {
      hotelExpenseTypeId: null,
      flightExpenseTypeId: null,
      flightReturnTicketExpenseTypeId: null,
    }
  }
}

const saveExpenseSettings = async () => {
  try {
    const data = {
      HotelExpenseTypeId: expenseSettings.value.hotelExpenseTypeId,
      FlightExpenseTypeId: expenseSettings.value.flightExpenseTypeId,
      FlightReturnTicketExpenseTypeId: expenseSettings.value.flightReturnTicketExpenseTypeId,
    }

    await api.post('/ApplicationSetting/SetSettings', {
      name: 'HotelExpenseSettings',
      value: JSON.stringify(data),
    })

    $q.notify({
      type: 'positive',
      message: $q.lang.table?.recordsSaved || 'Settings saved successfully',
      position: 'top-right',
    })

    return true // Success - this will close the dialog
  } catch (error) {
    console.error('Failed to save expense settings:', error)
    $q.notify({
      type: 'negative',
      message: $q.lang.table?.noData || 'Failed to save settings',
      position: 'top-right',
    })
    return false // Failure - this will keep the dialog open
  }
}

// Watch for expense parameter selection to update default values
watch(selectedExpenseParameter, (newParam) => {
  if (newParam) {
    newExpenseEntry.value.value = newParam.amount || 0
    newExpenseEntry.value.amount = newExpenseEntry.value.quantity * newExpenseEntry.value.value
  }
})

// Watch for quantity or value changes to update amount
watch(
  () => [newExpenseEntry.value.quantity, newExpenseEntry.value.value],
  () => {
    newExpenseEntry.value.amount = newExpenseEntry.value.quantity * newExpenseEntry.value.value
  },
)

// Function to add expense to list
const addExpenseToList = async () => {
  if (!selectedExpenseParameter.value) return

  if (hotelReservationFormValues.value.id) {
    // EDIT MODE: Call API directly
    const apiData = {
      hotelReservationId: hotelReservationFormValues.value.id,
      // expenseDirection:
      //   hotelReservationFormValues.value.hotelFlightInfo?.expenseDirection || 1,
      expense: {
        playerId: hotelReservationFormValues.value.players?.[0]?.playerId || 0,
        playerName: hotelReservationFormValues.value.players?.[0]?.playerFullName || '',
        hotelReservationId: hotelReservationFormValues.value.id,
        expenseTypeId: selectedExpenseParameter.value.id,
        expenseTypeName: selectedExpenseParameter.value.name,
        quantity: newExpenseEntry.value.quantity,
        value: newExpenseEntry.value.value,
        amount: newExpenseEntry.value.amount,
      },
    }

    const success = await guestManagementStore.addHotelReservationExpense(apiData)
    if (success) {
      // Fetch updated expenses instead of refreshing entire list
      await fetchReservationExpenses(
        hotelReservationFormValues.value.id,
        //hotelReservationFormValues.value.players[0].playerId
      )
    }
  } else {
    // CREATE MODE: Add to array
    if (!hotelReservationFormValues.value.expenses) {
      hotelReservationFormValues.value.expenses = []
    }

    hotelReservationFormValues.value.expenses.push({
      playerId: hotelReservationFormValues.value.players?.[0]?.playerId || 0,
      playerName: hotelReservationFormValues.value.players?.[0]?.playerFullName || '',
      expenseTypeId: selectedExpenseParameter.value.id,
      expenseTypeName: selectedExpenseParameter.value.name,
      quantity: newExpenseEntry.value.quantity,
      value: newExpenseEntry.value.value,
      amount: newExpenseEntry.value.amount,
    })
  }

  // Clear selections and reset values
  selectedExpenseParameter.value = null
  newExpenseEntry.value = {
    quantity: 1,
    value: 0,
    amount: 0,
  }
}

// Add this new method in the script section, before the onMounted hook
const addRoomMate = async () => {
  if (!selectedRoomMate.value || !hotelReservationFormValues.value.players?.[0]?.playerId) return

  if (hotelReservationFormValues.value.id) {
    // Edit modunda - API'ye istek at
    const success = await guestManagementStore.addHotelReservationPlayer({
      hotelReservationId: hotelReservationFormValues.value.id,
      playerId: selectedRoomMate.value.id,
      playerFullName: selectedRoomMate.value.name + ' ' + selectedRoomMate.value.surname,
      playerCategoryId: hotelReservationFormValues.value.players[0].playerCategoryId,
      playerCategoryName: hotelReservationFormValues.value.players[0].playerCategoryName,
      roomOwner: false,
    })

    if (success) {
      // Yeni oda arkadaşını listeye ekle
      hotelReservationFormValues.value.players.push({
        hotelReservationId: hotelReservationFormValues.value.id,
        playerId: selectedRoomMate.value.id,
        playerFullName: selectedRoomMate.value.name + ' ' + selectedRoomMate.value.surname,
        playerCategoryId: hotelReservationFormValues.value.players[0].playerCategoryId,
        playerCategoryName: hotelReservationFormValues.value.players[0].playerCategoryName,
        roomOwner: false,
      })

      // Players dizisini güncelle
      hotelReservationFormValues.value = {
        ...hotelReservationFormValues.value,
        players: [...hotelReservationFormValues.value.players],
      }
    }
  } else {
    // Create modunda - direkt listeye ekle
    hotelReservationFormValues.value.players.push({
      hotelReservationId: 0,
      playerId: selectedRoomMate.value.id,
      playerFullName: selectedRoomMate.value.name + ' ' + selectedRoomMate.value.surname,
      playerCategoryId: hotelReservationFormValues.value.players[0].playerCategoryId,
      playerCategoryName: hotelReservationFormValues.value.players[0].playerCategoryName,
      roomOwner: false,
    })

    // Players dizisini güncelle
    hotelReservationFormValues.value = {
      ...hotelReservationFormValues.value,
      players: [...hotelReservationFormValues.value.players],
    }
  }

  // Clear selection for next use
  selectedRoomMate.value = null
}

// Room mate silme işlemi için butonu güncelle
const deleteRoomMate = async (player) => {
  if (hotelReservationFormValues.value.id) {
    // Edit modunda - API'ye istek at
    const success = await guestManagementStore.deleteHotelReservationPlayer({
      hotelReservationId: hotelReservationFormValues.value.id,
      playerId: player.playerId,
    })

    if (success) {
      // Başarılı silme işleminden sonra listeden kaldır
      const index = hotelReservationFormValues.value.players.findIndex(
        (p) => p.playerId === player.playerId,
      )
      if (index !== -1) {
        hotelReservationFormValues.value.players.splice(index, 1)

        // Players dizisini güncelle
        hotelReservationFormValues.value = {
          ...hotelReservationFormValues.value,
          players: [...hotelReservationFormValues.value.players],
        }
      }
    }
  } else {
    // Create modunda - direkt listeden kaldır
    const index = hotelReservationFormValues.value.players.findIndex(
      (p) => p.playerId === player.playerId,
    )
    if (index !== -1) {
      hotelReservationFormValues.value.players.splice(index, 1)

      // Players dizisini güncelle
      hotelReservationFormValues.value = {
        ...hotelReservationFormValues.value,
        players: [...hotelReservationFormValues.value.players],
      }
    }
  }
}

// Update form submission to use event bus for refresh
const onSubmitForm = async (e) => {
  await onSubmitNewReservation(e)
}

// Add copy reservation method
const onCopyReservation = async (row) => {
  // Set form values for copying
  hotelReservationFormValues.value = {
    hotelFlightInfo: {
      //expenseDirection: 1,
      checkIn: row.checkIn,
      checkOut: row.checkOut,
      dayCount: row.dayCount,
      roomTypeId: row.roomTypeId,
      roomType: row.roomType,
      roomNo: row.roomNo,
      boardType: row.boardType || 'BB',
      roomPrice: row.roomPrice,
      roomTotalPrice: row.dayCount * row.roomPrice,
      expenseUse: row.expenseUse || true,
      flight: row.flight,
      ticketType: row.ticketType || 'Casino',
      from: row.from,
      to: row.to,
      to2: row.to2,
      pnr: row.pnr,
      pnr2: row.pnr2,
      flightTicketPrice: row.flightTicketPrice,
      isBusiness: row.isBusiness === true ? 1 : 0,
    },
    note: row.note,
    remark: row.remark,
    phone: row.phone !== false,
    minibar: row.minibar !== false,
    spa: row.spa !== false,
    fb: row.fb !== false,
    expenses: [],
    players: [], // Empty players array since user will select new player
    status: 'Pending',
  }

  // Show the create guest card modal
  showCreateGuestCard.value = true
}

onMounted(() => {
  guestManagementStore.fetchVisitorCategories()
  guestManagementStore.fetchFlightTicketTypes()
  guestManagementStore.fetchBoardTypes()
  guestManagementStore.fetchRoomTypes()
  guestManagementStore.fetchExpenseParameters()
})

const columns = ref([
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'guestName',
  },
  {
    field: 'roomMateName',
  },
  {
    field: 'playerCategoryName',
    label: 'Category',
  },
  {
    field: 'roomNo',
  },
  {
    field: 'checkIn',
    fieldType: 'date',
  },
  {
    field: 'checkOut',
    fieldType: 'date',
  },
  {
    field: 'roomType',
  },
  {
    field: 'dayCount',
  },
  {
    field: 'flight',
  },
  {
    field: 'from',
  },
  {
    field: 'to',
  },
  {
    field: 'note',
  },

  {
    field: 'Action',
    label: 'Action',
  },
])
</script>

<template>
  <q-page class="q-pa-md">
    <q-card class="no-box-shadow q-mb-md bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-md-8 col-sm-12 col-xs-12">
            <div class="text-h6">
              {{ $t('hotelGuestList') }}
            </div>
          </div>
          <div class="col-md-4 col-sm-12 col-xs-12 text-right flex content-center justify-end">
            <q-btn
              :label="$t('create')"
              class="q-mr-sm"
              color="grey-2"
              text-color="dark"
              unelevated
              no-caps
              @click="onClickCreateHotelReservation"
            />
            <q-btn
              icon="o_settings"
              color="grey-2"
              text-color="dark"
              unelevated
              no-caps
              @click="openExpenseSettingsDialog"
            >
              <q-tooltip>{{ $t('expenseSettings') }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none q-mt-sm">
        <Information
          class="full-width"
          content="Bu sayfada otele giriş yapan misafirlerin bilgileri görüntülenebilir. Actions üzerinden de gün bazlı görebilirsiniz."
        />
      </q-card-section>
    </q-card>
    <q-card class="q-mr-sm q-mb-md" v-show="showCreateGuestCard">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ hotelReservationFormValues.id ? $t('editReservation') : $t('newReservation') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="handleCloseModal">
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }} </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm">
        <q-form ref="form" class="row" @submit="onSubmitForm">
          <!-- Left Column: Guest Info -->
          <div class="col-3 q-pa-sm" style="height: fit-content">
            <!-- Guest Name -->
            <fieldset name="Player">
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_person" size="sm" color="grey-9" />
                {{ $t('guestName') }}
              </legend>
              <div class="row">
                <div class="col-12">
                  <q-select
                    v-model="selectedGuest"
                    outlined
                    dense
                    class="super-small"
                    :label="$t('name')"
                    :rules="[
                      (val) => (val && val.id) || hotelReservationFormValues.players?.[0]?.playerId,
                    ]"
                    use-input
                    clearable
                    :options="guestPlayersOption"
                    :option-label="(opt) => opt.name + ' ' + opt.surname + ' - ' + opt.id"
                    :loading="guestLoading"
                    input-debounce="500"
                    @filter="onGuestFilter"
                    @clear="
                      async () => {
                        if (
                          hotelReservationFormValues.id &&
                          hotelReservationFormValues.players?.[0]?.playerId
                        ) {
                          // Edit modunda - API'ye deleteHotelReservationPlayer isteği at
                          const success = await guestManagementStore.deleteHotelReservationPlayer({
                            hotelReservationId: hotelReservationFormValues.id,
                            playerId: hotelReservationFormValues.players[0].playerId,
                          })

                          if (success) {
                            selectedGuest.value = null
                            // Ana misafir bilgilerini temizle
                            hotelReservationFormValues.value.players[0] = {
                              hotelReservationId: hotelReservationFormValues.id,
                              playerId: null,
                              playerFullName: '',
                              playerCategoryId: null,
                              playerCategoryName: '',
                              roomOwner: true,
                            }
                          }
                        } else {
                          // Create modunda - sadece değerleri temizle
                          selectedGuest.value = null
                          if (hotelReservationFormValues.value.players?.[0]) {
                            hotelReservationFormValues.value.players[0] = {
                              hotelReservationId: 0,
                              playerId: null,
                              playerFullName: '',
                              playerCategoryId: null,
                              playerCategoryName: '',
                              roomOwner: true,
                            }
                          }
                        }
                      }
                    "
                    behavior="menu"
                    hide-dropdown-icon
                    @update:model-value="
                      async (selectedPlayer) => {
                        if (selectedPlayer) {
                          if (hotelReservationFormValues.id) {
                            // Edit modunda - API'ye addHotelReservationPlayer isteği at
                            const success = await guestManagementStore.addHotelReservationPlayer({
                              hotelReservationId: hotelReservationFormValues.id,
                              playerId: selectedPlayer.playerId || selectedPlayer.id, // playerId veya id kontrolü
                              playerFullName:
                                selectedPlayer.playerFullName ||
                                selectedPlayer.name + ' ' + selectedPlayer.surname,
                              playerCategoryId: guestCategoryId || null,
                              playerCategoryName:
                                visitorCategories.find((c) => +c.id === +guestCategoryId)?.name ||
                                '',
                              roomOwner: true,
                            })

                            if (success) {
                              selectedGuest.value = selectedPlayer
                            }
                          } else {
                            // Create modunda - array'e ekle
                            selectedGuest.value = selectedPlayer
                            if (!hotelReservationFormValues.players) {
                              hotelReservationFormValues.players = []
                            }
                            hotelReservationFormValues.players[0] = {
                              hotelReservationId: 0,
                              playerId: selectedPlayer.playerId || selectedPlayer.id, // playerId veya id kontrolü
                              playerFullName:
                                selectedPlayer.playerFullName ||
                                selectedPlayer.name + ' ' + selectedPlayer.surname,
                              playerCategoryId: guestCategoryId || null,
                              playerCategoryName:
                                visitorCategories.find((c) => +c.id === +guestCategoryId)?.name ||
                                '',
                              roomOwner: true,
                            }
                          }
                        } else {
                          selectedGuest.value = null
                          if (!hotelReservationFormValues.id) {
                            // Sadece create modunda players dizisini temizle
                            if (hotelReservationFormValues.players?.[0]) {
                              hotelReservationFormValues.players[0] = {
                                hotelReservationId: 0,
                                playerId: null,
                                playerFullName: '',
                                playerCategoryId: guestCategoryId || null,
                                playerCategoryName:
                                  visitorCategories.find((c) => +c.id === +guestCategoryId)?.name ||
                                  '',
                                roomOwner: true,
                              }
                            }
                          }
                        }
                      }
                    "
                  >
                    <template v-slot:selected-item="scope">
                      <span>{{ scope.opt.name }} {{ scope.opt.surname }}</span>
                    </template>

                    <template v-slot:no-option>
                      <q-item v-if="guestLoading">
                        <q-item-section class="text-grey">
                          {{ $t('notFound') }}
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-avatar size="32px">
                            <img
                              v-if="scope.opt.profilePhoto"
                              :src="'data:image/jpeg;base64,' + scope.opt.profilePhoto"
                              :alt="scope.opt.name + ' ' + scope.opt.surname"
                            />
                            <q-icon v-else name="person" size="24px" color="grey-6" />
                          </q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{ scope.opt.name }}
                            {{ scope.opt.surname }}
                          </q-item-label>
                          <q-item-label caption>ID: {{ scope.opt.id }} </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-select>
                </div>
              </div>
            </fieldset>

            <!-- Visitor Category -->
            <fieldset name="VisitorCategory">
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_category" size="sm" color="grey-9" />
                {{ $t('visitorCategory') }}
              </legend>
              <div class="row">
                <div class="col-12">
                  <q-select
                    v-model="guestCategoryId"
                    outlined
                    dense
                    class="super-small"
                    :options="visitorCategories"
                    :rules="[(val) => !!val]"
                    @update:model-value="
                      (args) => {
                        const category = visitorCategories.find((item) => +item.id === +args)
                        if (hotelReservationFormValues.players?.[0]) {
                          hotelReservationFormValues.players[0].playerCategoryName =
                            category?.name || ''
                        }

                        // Tüm oda arkadaşları için de kategori adını güncelle
                        if (
                          hotelReservationFormValues.players &&
                          hotelReservationFormValues.players.length > 1
                        ) {
                          hotelReservationFormValues.players.forEach((player, index) => {
                            if (index > 0) {
                              // Ana misafir hariç (index 0)
                              player.playerCategoryName = category?.name || ''
                            }
                          })
                        }
                      }
                    "
                    map-options
                    emit-value
                    option-label="name"
                    option-value="id"
                  />
                </div>
              </div>
            </fieldset>

            <!-- Room Mate -->
            <fieldset name="RoomMate">
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_person" size="sm" color="grey-9" />
                {{ $t('roomMate') }}
              </legend>
              <div class="row">
                <div class="col-12">
                  <div class="row q-gutter-xs items-center">
                    <div class="col">
                      <q-select
                        v-model="selectedRoomMate"
                        dense
                        :placeholder="selectedRoomMate === null ? $t('searchUsers') : ''"
                        use-input
                        clearable
                        :disable="
                          !selectedGuest?.id && !hotelReservationFormValues.players?.[0]?.playerId
                        "
                        :options="
                          roomMatePlayersOption.filter((player) => {
                            // Ana misafiri hariç tut
                            if (selectedGuest && player.id === selectedGuest.id) return false
                            // Zaten seçili players'ları hariç tut
                            if (hotelReservationFormValues.players?.length > 1) {
                              return !hotelReservationFormValues.players.some(
                                (p) => p.playerId === player.id,
                              )
                            }
                            return true
                          })
                        "
                        :option-label="(opt) => opt.name + ' ' + opt.surname + ' - ' + opt.id"
                        class="super-small"
                        :loading="roomMateLoading"
                        input-debounce="500"
                        @filter="onRoomMateFilter"
                        @clear="
                          () => {
                            // Just clear roommate selection
                            selectedRoomMate = null
                          }
                        "
                        behavior="menu"
                        hide-bottom-space
                        outlined
                        hide-dropdown-icon
                        @update:model-value="addRoomMate"
                      >
                        <template v-slot:no-option>
                          <q-item v-if="roomMateLoading">
                            <q-item-section class="text-grey">
                              {{ $t('notFound') }}
                            </q-item-section>
                          </q-item>
                        </template>

                        <template v-slot:option="scope">
                          <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                              <q-avatar size="32px">
                                <img
                                  v-if="scope.opt.profilePhoto"
                                  :src="'data:image/jpeg;base64,' + scope.opt.profilePhoto"
                                  :alt="scope.opt.name + ' ' + scope.opt.surname"
                                />
                                <q-icon v-else name="person" size="24px" color="grey-6" />
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label
                                >{{ scope.opt.name }}
                                {{ scope.opt.surname }}
                              </q-item-label>
                              <q-item-label caption>ID: {{ scope.opt.id }} </q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>

                        <template v-slot:selected-item="scope">
                          <div class="flex items-center">
                            <q-avatar size="24px" class="q-mr-sm">
                              <img
                                v-if="scope.opt.profilePhoto"
                                :src="'data:image/jpeg;base64,' + scope.opt.profilePhoto"
                                :alt="scope.opt.name + ' ' + scope.opt.surname"
                              />
                              <q-icon v-else name="person" size="18px" color="grey-6" />
                            </q-avatar>
                            <span
                              >{{ scope.opt.name }} {{ scope.opt.surname }} -
                              {{ scope.opt.id }}</span
                            >
                          </div>
                        </template>

                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-select>
                    </div>
                    <!--                     <div class="col-auto">
                      <q-btn
                        round
                        dense
                        icon="add"
                        color="positive"
                        size="sm"
                        :disable="
                          !selectedRoomMate ||
                          !hotelReservationFormValues.players?.[0]?.playerId
                        "
                        @click="addRoomMate"
                      >
                        <q-tooltip>{{ $t('add') }}</q-tooltip>
                      </q-btn>
                    </div> -->
                  </div>
                </div>
                <div class="col-12 q-mt-sm" v-if="hotelReservationFormValues.players?.length">
                  <q-list bordered separator>
                    <q-item
                      v-for="player in hotelReservationFormValues.players.filter(
                        (p) => !p.roomOwner,
                      )"
                      :key="player.playerId"
                      class="q-py-sm q-px-sm bg-white"
                    >
                      <q-item-section>
                        {{ player.playerFullName }}
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          round
                          color="negative"
                          icon="o_delete_forever"
                          @click="deleteRoomMate(player)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </fieldset>

            <!-- Other Options -->
            <fieldset name="Others">
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_settings" size="sm" color="grey-9" />
                {{ $t('otherOptions') }}
              </legend>

              <div class="row">
                <q-checkbox
                  v-model="hotelReservationFormValues.phone"
                  :label="$t('phone')"
                  class="col-6"
                />
                <q-checkbox
                  v-model="hotelReservationFormValues.minibar"
                  :label="$t('minibar')"
                  class="col-6"
                />
                <q-checkbox
                  v-model="hotelReservationFormValues.spa"
                  :label="$t('spa')"
                  class="col-6"
                />
                <q-checkbox
                  v-model="hotelReservationFormValues.fb"
                  :label="$t('fb')"
                  class="col-6"
                />
                <q-checkbox
                  v-model="hotelReservationFormValues.hotelFlightInfo.expenseUse"
                  :label="$t('expenseUse')"
                  class="col-12"
                />
              </div>
            </fieldset>
          </div>

          <!-- Middle Column: Reservation Details -->
          <div class="col-5 q-pa-sm">
            <fieldset
              name="ReservationDetails"
              class="reservation-details-fieldset"
              :class="{
                'disabled-fieldset': hotelReservationFormValues.id && !isEditingReservationDetails,
              }"
            >
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_hotel" size="sm" color="grey-9" />
                {{ $t('reservationDetails') }}
                <q-btn
                  v-if="hotelReservationFormValues.id"
                  flat
                  dense
                  round
                  :color="isEditingReservationDetails ? 'negative' : 'primary'"
                  icon="edit"
                  @click="toggleEditMode"
                  size="sm"
                  class="q-ml-sm"
                >
                  <q-tooltip
                    >{{ isEditingReservationDetails ? $t('lock') : $t('edit') }}
                  </q-tooltip>
                </q-btn>
              </legend>

              <!-- Check-in / Check-out / Room Info and Flight Information Row -->
              <div class="row">
                <!-- Left Column: Check-in, Check-out, Room Type Info -->
                <div class="col-6 q-pr-md">
                  <!-- Check-in Date -->
                  <div class="q-mb-md">
                    <div class="text-subtitle2 q-mb-xs text-grey-8">
                      <q-icon name="o_calendar_month" size="sm" color="grey-9" />
                      {{ $t('checkIn') }}
                    </div>
                    <DatePicker
                      v-model="hotelReservationFormValues.hotelFlightInfo.checkIn"
                      type="datetime"
                      :placeholder="$t('pickDate')"
                      size="default"
                      format="DD.MM.YYYY HH:mm"
                      date-format="MMM DD, YYYY"
                      time-format="HH:mm"
                      :disabled="hotelReservationFormValues.id && !isEditingReservationDetails"
                      style="width: 100%"
                    />
                  </div>

                  <!-- Check-out Date -->
                  <div class="q-mb-md">
                    <div class="text-subtitle2 q-mb-xs text-grey-8">
                      <q-icon name="o_calendar_month" size="sm" color="grey-9" />
                      {{ $t('checkOut') }}
                    </div>
                    <DatePicker
                      v-model="hotelReservationFormValues.hotelFlightInfo.checkOut"
                      type="datetime"
                      :placeholder="$t('pickDate')"
                      size="default"
                      format="DD.MM.YYYY HH:mm"
                      date-format="MMM DD, YYYY"
                      time-format="HH:mm"
                      :disabled="hotelReservationFormValues.id && !isEditingReservationDetails"
                      style="width: 100%"
                    />
                  </div>

                  <!-- Room Type -->
                  <div class="q-mb-md">
                    <q-select
                      v-model="hotelReservationFormValues.hotelFlightInfo.roomTypeId"
                      :options="roomTypes"
                      outlined
                      dense
                      class="super-small"
                      :label="$t('roomType')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      @update:model-value="
                        (args) => {
                          const roomType = roomTypes.find((item) => +item.id === +args)
                          hotelReservationFormValues.hotelFlightInfo.roomType = roomType?.name || ''
                          // Set room price from room type
                          hotelReservationFormValues.hotelFlightInfo.roomPrice =
                            roomType?.price || 0
                          // Auto-calculate total room price
                          const dayCount = hotelReservationFormValues.hotelFlightInfo.dayCount || 1
                          hotelReservationFormValues.hotelFlightInfo.roomTotalPrice =
                            (roomType?.price || 0) * dayCount
                        }
                      "
                      map-options
                      emit-value
                      option-label="name"
                      option-value="id"
                    />
                  </div>

                  <!-- Room Number -->
                  <div class="q-mb-md">
                    <q-input
                      v-model="hotelReservationFormValues.hotelFlightInfo.roomNo"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('roomNo')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                    />
                  </div>

                  <!-- Room Price and Day Count Display -->
                  <div class="row q-mb-md items-end q-gutter-sm">
                    <div class="col-auto" style="min-width: 80px">
                      <div class="text-subtitle2 text-weight-medium text-secondary text-no-wrap">
                        {{ hotelReservationFormValues.hotelFlightInfo.dayCount || 1 }}
                        {{ $t('days') }}
                      </div>
                    </div>
                    <div class="col">
                      <q-input
                        v-model.number="hotelReservationFormValues.hotelFlightInfo.roomPrice"
                        type="number"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('roomPrice')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                        min="0"
                        @update:model-value="
                          (val) => {
                            // Update room total price when room price changes
                            const dayCount =
                              hotelReservationFormValues.hotelFlightInfo.dayCount || 1
                            hotelReservationFormValues.hotelFlightInfo.roomTotalPrice =
                              val * dayCount
                          }
                        "
                      />
                    </div>
                    <div class="col">
                      <q-input
                        v-model.number="hotelReservationFormValues.hotelFlightInfo.roomTotalPrice"
                        type="number"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('roomTotalPrice')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                        min="0"
                        @update:model-value="
                          (val) => {
                            // Update room price when total price changes
                            const dayCount =
                              hotelReservationFormValues.hotelFlightInfo.dayCount || 1
                            if (dayCount > 0) {
                              hotelReservationFormValues.hotelFlightInfo.roomPrice = val / dayCount
                            }
                          }
                        "
                      />
                    </div>
                  </div>

                  <!-- Board Type -->
                  <div class="q-mb-md">
                    <q-select
                      v-model="hotelReservationFormValues.hotelFlightInfo.boardType"
                      :options="boardTypes"
                      outlined
                      dense
                      class="super-small"
                      :label="$t('boardType')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      map-options
                      emit-value
                      option-label="name"
                      option-value="id"
                    />
                  </div>

                  <!-- Expense Direction
                  <div class="q-mb-md">
                    <q-select
                      v-model="
                        hotelReservationFormValues.hotelFlightInfo
                          .expenseDirection
                      "
                      :options="[
                        { label: $t('reservation.oneForAll'), value: 1 },
                        {
                          label: $t('reservation.eachOneIndividual'),
                          value: 2,
                        },
                      ]"
                      outlined
                      dense
                      class="super-small"
                      :label="$t('reservation.expenseDirection')"
                      :disable="
                        hotelReservationFormValues.id &&
                        !isEditingReservationDetails
                      "
                      map-options
                      emit-value
                      option-label="label"
                      option-value="value"
                      clearable
                    />
                  </div>
                  -->
                </div>

                <!-- Right Column: Flight Information -->
                <div class="col-6 q-pl-md">
                  <div class="text-subtitle2 q-mb-sm">
                    <q-icon name="o_flight" size="sm" color="grey-9" />
                    {{ $t('flightInformation') }}
                  </div>

                  <!-- Flight Details -->
                  <div class="q-mb-sm">
                    <q-input
                      v-model="hotelReservationFormValues.hotelFlightInfo.flight"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('flight')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                    />
                  </div>

                  <!-- Ticket Type -->
                  <div class="q-mb-sm">
                    <q-select
                      v-model="hotelReservationFormValues.hotelFlightInfo.ticketType"
                      :options="flightTicketTypes"
                      outlined
                      dense
                      class="super-small"
                      :label="$t('ticketType')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      map-options
                      emit-value
                      option-label="name"
                      option-value="id"
                    />
                  </div>

                  <!-- Route Information Row -->
                  <div class="row q-mb-sm q-gutter-sm">
                    <div class="col">
                      <q-input
                        v-model="hotelReservationFormValues.hotelFlightInfo.from"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('from')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        v-model="hotelReservationFormValues.hotelFlightInfo.to"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('to')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        v-model="hotelReservationFormValues.hotelFlightInfo.to2"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('to2')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                    </div>
                  </div>

                  <!-- PNR and PNR2 Row -->
                  <div class="row q-mb-sm q-gutter-sm">
                    <div class="col">
                      <q-input
                        v-model="hotelReservationFormValues.hotelFlightInfo.pnr"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('pnr')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        v-model="hotelReservationFormValues.hotelFlightInfo.pnr2"
                        dense
                        outlined
                        class="super-small"
                        :label="$t('pnr2')"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                    </div>
                  </div>

                  <!-- Flight Price -->
                  <div class="q-mb-sm">
                    <q-input
                      v-model.number="hotelReservationFormValues.hotelFlightInfo.flightTicketPrice"
                      type="number"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('flightTicketPrice')"
                      :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      min="0"
                    />
                  </div>

                  <!-- Business Class -->
                  <div class="q-mb-sm">
                    <div class="flex items-center">
                      <q-rating
                        v-model="hotelReservationFormValues.hotelFlightInfo.isBusiness"
                        :max="1"
                        icon="star_border"
                        color="deep-purple"
                        class="super-small q-mr-sm"
                        icon-selected="star"
                        size="24px"
                        :disable="hotelReservationFormValues.id && !isEditingReservationDetails"
                      />
                      <div class="text-subtitle2">
                        {{ $t('isBusiness') }}
                      </div>
                    </div>
                  </div>

                  <!-- Return Flight Price -->
                  <div
                    class="q-mb-sm"
                    v-if="isEditingReservationDetails && hotelReservationFormValues.id"
                  >
                    <q-input
                      v-model.number="hotelReservationFormValues.flightTicketReturnPrice"
                      type="text"
                      dense
                      outlined
                      class="super-small no-spinner"
                      :label="$t('flightTicketReturnPrice')"
                      :disable="false"
                      @input="
                        (val) => {
                          // Allow decimal numbers
                          const numVal = parseFloat(val.replace(',', '.'))
                          if (!isNaN(numVal)) {
                            hotelReservationFormValues.flightTicketReturnPrice = numVal
                          }
                        }
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- Update Button inside fieldset when editing -->
              <div
                v-if="hotelReservationFormValues.id && isEditingReservationDetails"
                class="row q-mt-md"
              >
                <div class="col-12 text-right q-gutter-sm">
                  <q-btn
                    unelevated
                    icon="close"
                    color="grey"
                    size="md"
                    :label="$t('cancel')"
                    @click="toggleEditMode"
                    no-caps
                    flat
                  />
                  <q-btn
                    unelevated
                    icon="check"
                    color="positive"
                    size="md"
                    :label="$t('update')"
                    @click="updateReservationDetails"
                    no-caps
                  />
                </div>
              </div>
            </fieldset>

            <!-- Note and Remark below reservation details -->
            <div class="row q-mt-md">
              <div class="col-12">
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="o_note" size="sm" color="grey-9" />
                  {{ $t('notesAndRemarks') }}
                </div>
              </div>
              <div class="col-6 q-pr-sm">
                <q-input
                  v-model="hotelReservationFormValues.note"
                  outlined
                  class="custom-textarea"
                  :label="$t('note')"
                  type="textarea"
                  rows="6"
                  autogrow
                />
              </div>
              <div class="col-6 q-pl-sm">
                <q-input
                  v-model="hotelReservationFormValues.remark"
                  outlined
                  class="custom-textarea"
                  :label="$t('remark')"
                  type="textarea"
                  rows="6"
                  autogrow
                />
              </div>
            </div>
          </div>

          <!-- Right Column: Expense Parameters -->
          <div class="col-4 q-pa-sm">
            <fieldset name="ExpenseParameters" class="expense-parameters-fieldset">
              <legend class="flex content-center items-center text-subtitle2 text-grey-9">
                <q-icon name="o_receipt" size="sm" color="grey-9" />
                {{ $t('expenseParameters') }}
              </legend>

              <!-- Expense Parameter Selection -->
              <div class="q-mb-md">
                <div class="row q-gutter-xs items-center">
                  <div class="col-12">
                    <q-select
                      v-model="selectedExpenseParameter"
                      :options="expenseParameters"
                      outlined
                      dense
                      class="super-small"
                      :label="$t('selectExpenseParameter')"
                      option-label="name"
                      clearable
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model.number="newExpenseEntry.quantity"
                      type="number"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('quantity')"
                      min="1"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model.number="newExpenseEntry.value"
                      type="number"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('unitPrice')"
                      min="0"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model.number="newExpenseEntry.amount"
                      type="number"
                      dense
                      outlined
                      class="super-small"
                      :label="$t('total')"
                      min="0"
                      @update:model-value="
                        (val) => {
                          if (newExpenseEntry.quantity > 0) {
                            newExpenseEntry.value = val / newExpenseEntry.quantity
                          }
                        }
                      "
                    />
                  </div>
                  <div class="col-1 text-right">
                    <q-btn
                      dense
                      icon="add"
                      color="blue-grey-8"
                      size="13px"
                      outline
                      @click="addExpenseToList"
                      unelevated
                    >
                      <q-tooltip>{{ $t('add') }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>

              <div
                class="row bg-grey-1"
                v-for="(expense, index) in hotelReservationFormValues.expenses"
                :key="index"
              >
                <div class="row bg-white q-gutter-xs">
                  <div class="row bg-white col-12">
                    <div
                      class="text-weight-medium text-caption text-grey-8 ellipsis"
                      v-if="expense.expenseTypeName"
                    >
                      {{ expense.expenseTypeName }}
                    </div>
                    <div class="text-caption text-grey-6 ellipsis" v-if="expense.playerName">
                      {{ expense.playerName }}
                    </div>
                  </div>
                  <div class="col">
                    <q-input
                      :label="$t('quantity')"
                      v-model.number="expense.quantity"
                      type="number"
                      dense
                      outlined
                      min="1"
                      class="text-center super-small"
                      disable
                      @update:model-value="
                        (val) => {
                          expense.quantity = val || 1
                          expense.amount = expense.quantity * expense.value
                        }
                      "
                    />
                  </div>
                  <div class="col">
                    <q-input
                      :label="$t('unitPrice')"
                      v-model.number="expense.value"
                      type="number"
                      dense
                      outlined
                      min="0"
                      class="text-center super-small"
                      disable
                      @update:model-value="
                        (val) => {
                          expense.value = val || 0
                          expense.amount = expense.quantity * expense.value
                        }
                      "
                    />
                  </div>
                  <div class="col">
                    <q-input
                      :label="$t('total')"
                      v-model.number="expense.amount"
                      type="number"
                      dense
                      outlined
                      min="0"
                      class="text-weight-bold text-center super-small"
                      disable
                      @update:model-value="
                        (val) => {
                          expense.amount = val || 0
                          if (expense.quantity > 0) {
                            expense.value = expense.amount / expense.quantity
                          }
                        }
                      "
                    />
                  </div>
                  <div class="col-1 flex content-center items-center">
                    <q-btn
                      dense
                      color="negative"
                      icon="delete_forever"
                      size="13px"
                      outline
                      unelevated
                      @click="
                        async () => {
                          if (hotelReservationFormValues.id) {
                            // EDIT MODE: Call API to remove expense
                            if (expense.id) {
                              const success =
                                await guestManagementStore.removeHotelReservationExpense({
                                  expenseId: expense.id,
                                })
                              if (success) {
                                // Fetch updated expenses instead of refreshing entire list
                                await fetchReservationExpenses(hotelReservationFormValues.id)
                              }
                            }
                          } else {
                            // CREATE MODE: Just remove from array
                            hotelReservationFormValues.expenses.splice(index, 1)
                          }
                        }
                      "
                    >
                      <q-tooltip>{{ $t('delete') }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>

              <!-- Expense Parameters List -->
              <div
                v-if="hotelReservationFormValues.expenses?.length"
                style="max-height: 400px; overflow-y: auto"
              >
                <!-- Total Amount Display -->
                <div class="q-mt-sm q-pa-sm bg-primary-1 rounded-borders">
                  <div class="text-right">
                    <div class="text-caption text-weight-bold text-primary">
                      <q-icon name="o_calculate" size="xs" color="primary" />
                      {{ $t('totalAmount') }}:
                      <span class="text-body2">{{ formatPrice(calculateGrandTotal()) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div class="col-12 q-mt-md text-right">
            <q-btn
              unelevated
              icon="close"
              color="negative"
              size="md"
              :label="$t('cancel')"
              class="col-12 q-mr-md"
              type="button"
              flat
              no-caps
              @click="handleCloseModal"
            />
            <q-btn
              unelevated
              icon="save"
              color="deep-purple"
              size="md"
              :label="$t('save')"
              class="col-12"
              type="submit"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-card v-show="!showCreateGuestCard" class="no-box-shadow">
      <q-card-section class="q-pa-none">
        <SupaTable
          tableName="hotelReservations"
          :getDataFn="guestManagementStore.fetchHotelReservations"
          :filterParams="guestListFilterParams"
          :columns="columns"
          :slotNames="[
            'body-cell-roomMate',
            'body-cell-guest',
            'body-cell-playerCategoryName',
            'body-cell-Action',
          ]"
        >
          <template v-slot:body-cell-Action="{ props }">
            <q-td key="Action" align="center">
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="12px"
                icon="fa-regular fa-pen-to-square"
                class="q-mr-md"
                @click="onClickEditHotelGuestReservation(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="info"
                size="10px"
                icon="content_copy"
                class="q-mr-md"
                @click="onCopyReservation(props.row)"
              >
                <q-tooltip>{{ $t('copy') }}</q-tooltip>
              </q-btn>
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="negative"
                size="12px"
                icon="fa-regular fa-trash-can"
                class="q-mr-sm"
                @click="
                  async (e) => {
                    e.preventDefault()
                    const success = await guestManagementStore.deleteHotelReservation(props.row.id)
                    if (success) {
                      // Refresh the table using event bus
                    }
                  }
                "
              />
            </q-td>
          </template>
          <template v-slot:body-cell-guest="{ props }">
            <q-td key="guest" align="center">
              {{ props.row.players?.find((player) => player.roomOwner)?.playerFullName }}
            </q-td>
          </template>
          <template v-slot:body-cell-roomMate="{ props }">
            <q-td key="roomMate" align="center">
              <div v-if="props.row.players?.length">
                <div
                  v-for="player in props.row.players.filter((p) => !p.roomOwner)"
                  :key="player.playerId"
                >
                  {{ player.playerFullName }}
                </div>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-playerCategoryName="{ props }">
            <q-td key="playerCategoryName" align="center">
              {{ props.row.players?.find((player) => player.roomOwner)?.playerCategoryName }}
            </q-td>
          </template>
          <template v-slot:headerFilterSlots="{ props }">
            <div class="col q-pl-sm q-mr-sm flex row justify-start">
              <div class="q-pa-xs flex items-end">
                <date-time-picker
                  @selected-date="
                    (val) =>
                      (guestListFilterParams = {
                        ...guestListFilterParams,
                        ...val,
                      })
                  "
                />

                <q-btn
                  type="button"
                  :label="$t('filter')"
                  icon="tune"
                  color="grey-2"
                  text-color="dark"
                  size="13px"
                  unelevated
                  no-caps
                  @click="props.reload"
                  class="q-ml-sm"
                />
                <q-btn
                  unelevated
                  color="grey-2"
                  text-color="dark"
                  size="13px"
                  :icon="toggleHideColumns ? 'o_visibility' : 'o_visibility_off'"
                  class="q-ml-sm"
                  no-caps
                  :label="toggleHideColumns ? $t('showExpenses') : $t('hideExpenses')"
                  @click="onHideColumns"
                />
              </div>
            </div>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">
fieldset {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px !important;
  margin-bottom: 10px !important;
}

.reservation-details-fieldset,
.expense-parameters-fieldset {
  position: relative;
}

.disabled-fieldset {
  background-color: #f5f5f5;
  opacity: 0.7;

  input,
  select,
  textarea {
    background-color: #f9f9f9 !important;
  }
}

.custom-textarea {
  :deep(.q-field__control) {
    min-height: 120px;
  }

  :deep(textarea) {
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }
}

/* Hide spinner arrows on number inputs for unit price and total amount */
:deep(.q-input input[type='number']::-webkit-outer-spin-button),
:deep(.q-input input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.q-input input[type='number']) {
  -moz-appearance: textfield;
}

/* No spinner class for specific inputs */
.no-spinner {
  :deep(input::-webkit-outer-spin-button),
  :deep(input::-webkit-inner-spin-button) {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  :deep(input[type='number']) {
    -moz-appearance: textfield !important;
  }
}

/* Prevent text wrapping */
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
