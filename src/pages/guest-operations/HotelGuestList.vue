<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  useQuasar,
  /* date */
} from 'quasar'
import { storeToRefs } from 'pinia'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { useAuthStore } from 'src/stores/auth-store'
import CreateHotelGuest from 'src/components/pages/guest-operations/HotelGuestForm.vue'
import ExpenseSettingsDialog from 'src/components/pages/guest-operations/ExpenseSettingsDialog.vue'
import RoomCountDialog from 'src/components/pages/guest-operations/RoomCountDialog.vue'
import CopyHotelReservationDialog from 'src/components/pages/guest-operations/CopyHotelReservationDialog.vue'
import { formatPrice, removeEmptySpaces } from 'src/helpers/helpers'
import { useOperationsStore } from 'src/stores/operations-store'
const guestManagementStore = useGuestManagementStore()
const operationsStore = useOperationsStore()
const { hotelGuestListWidgets, expenseParameters, roomCountTotal, visitorCategories } =
  storeToRefs(guestManagementStore)
const authStore = useAuthStore()
const { defaultCurrency } = storeToRefs(authStore)
const $q = useQuasar()
const statuses = ref([])
const expenseColumnNames = ref(['totalExpense'])
const showTable = ref(false)

onMounted(async () => {
  guestManagementStore.fetchVisitorCategories()
  guestManagementStore.fetchFlightTicketTypes()
  guestManagementStore.fetchBoardTypes()
  guestManagementStore.fetchRoomTypes()
  await fetchGroupCodes()
  await guestManagementStore.fetchExpenseParameters()
  guestManagementStore.getHotelReservationStatuses().then((res) => {
    statuses.value = res
  })
  if (expenseParameters.value.length) {
    expenseParameters.value.forEach((element) => {
      if (element.isVisible) {
        expenseColumnNames.value.push(removeEmptySpaces(element.name))
        columns.value.push({
          field: 'expenses',
          label: element.name,
          name: removeEmptySpaces(element.name),
          fieldType: 'custom',
          defaultVisible: false,
          visible: false,
          class: 'bg-orange-1',
          customFormat: (value) => {
            const findExpenses = value.filter((expense) => expense.expenseTypeId === element.id)
            const price = findExpenses.reduce(
              (sum, expense) => sum + parseFloat(expense.amountInCasinoCurrency || 0),
              0,
            )
            return formatPrice(price)
          },
        })
      }
    })
    columns.value.push({
      field: 'expenses',
      name: 'totalExpense',
      label: 'Total Expense',
      fieldType: 'custom',
      class: 'bg-orange-1',
      customFormat: (value) => {
        return (
          formatPrice(
            value.reduce(
              (sum, expense) => sum + parseFloat(expense.amountInCasinoCurrency || 0),
              0,
            ),
          ) +
          ' ' +
          defaultCurrency.value.name
        )
      },
      defaultVisible: false,
      visible: false,
    })
    columns.value.push({
      field: 'Action',
    })
    showTable.value = true
  }
})

const onCliclOpenExpenseSettingsDialog = async () => {
  $q.loading.show({
    message: 'Yükleniyor...',
  })
  const response = await guestManagementStore.getHotelExpenseSettings()
  $q.loading.hide()

  const expenseSettings = JSON.parse(response.data.value) || {
    HotelExpenseTypeId: null,
    FlightExpenseTypeId: null,
    FlightReturnTicketExpenseTypeId: null,
    FixExpense: null,
  }

  $q.dialog({
    component: ExpenseSettingsDialog,
    componentProps: {
      settings: expenseSettings,
      expenseParameters: guestManagementStore.expenseParameters,
      actionFn: guestManagementStore.updateHotelExpenseSettings,
    },
  })
}

const onCopyHotelGuest = (row) => {
  $q.dialog({
    component: CopyHotelReservationDialog,
    componentProps: {
      hotelReservationId: row.id,
      actionFn: guestManagementStore.copyBulkReservation,
      detail: { ...row },
    },
  }).onOk(() => {
    hotelGuestListTableRef.value.fetchData()
  })
}

const onDeleteHotelGuest = async (params) => {
  $q.dialog({
    title: 'Misafir kaydı sil',
    message: 'Misafir kaydını silmek istediğinize emin misiniz?',
    color: 'negative',
    ok: {
      flat: true,
      color: 'negative',
      label: 'Evet',
      noCaps: true,
    },
    cancel: {
      flat: true,
      color: 'primary',
      label: 'Hayır',
      noCaps: true,
      focus: true,
    },
    persistent: true,
  }).onOk(async () => {
    const response = await guestManagementStore.deleteHotelReservation({
      hotelReservationId: params.id,
    })
    if (response.status === 200) {
      hotelGuestListTableRef.value.fetchData()
      $q.notify({
        message: 'Misafir kaydı başarıyla silindi',
        type: 'positive',
        position: 'top-right',
      })
    } else {
      $q.notify({
        message: 'Misafir kaydı silinirken bir hata oluştu',
        type: 'warning',
        position: 'top-right',
      })
    }
  })
}

const creatingHotelGuest = ref(false)
const hotelGuestListTableRef = ref({
  selectedRow: {},
})
const showHotelGuestForm = ref(false)
const hotelGuestFormParams = ref(null)
const onClickShowHotelGuestForm = (params) => {
  creatingHotelGuest.value = true
  hotelGuestFormParams.value = { ...params }
  showHotelGuestForm.value = true
}
const columns = ref([
  {
    field: 'id',
    label: 'Id',
  },
  {
    field: 'players',
    label: 'Guest',
    name: 'guest',
  },
  {
    field: 'players',
    label: 'Room Mate',
    name: 'roomMate',
  },
  {
    field: 'playerCategoryName',
    label: 'Junket',
  },

  {
    field: 'roomNo',
  },
  {
    field: 'status',
  },
  {
    field: 'groupCode',
    name: 'groupCode',
  },

  {
    field: 'checkIn',
    fieldType: 'date',
    label: 'C/In',
  },
  {
    field: 'checkOut',
    fieldType: 'date',
    label: 'C/Out',
  },
  {
    field: 'dayCount',
    label: 'Day',
  },
  {
    field: 'roomType',
    label: 'R.Type',
  },
  {
    field: 'ticketType',
    label: 'Tic',
  },
  {
    field: 'roomPrice',
    fieldType: 'price',
  },
  {
    field: 'from',
  },
  {
    field: 'to',
  },

  {
    field: 'pnr',
    visible: false,
  },
  {
    field: 'pnr2',
    visible: false,
  },
  {
    field: 'flightTicketPrice',
    fieldType: 'price',
    visible: false,
  },
  {
    field: 'isBusiness',
    fieldType: 'boolean',
    visible: false,
  },
  {
    field: 'note',
    visible: false,
  },
  {
    field: 'remark',
    visible: false,
  },
  {
    field: 'createdAt',
    fieldType: 'date',
    visible: false,
  },
  {
    field: 'createdByName',
    visible: false,
  },
  {
    field: 'updatedAt',
    fieldType: 'date',
    visible: false,
  },
  {
    field: 'updatedByName',
    visible: false,
  },
])
const hotelGuestListFilterParams = ref({
  isDeleted: false,
  showByRecordDate: false,
  checkInDate: null,
  checkOutDate: null,
})

const toggleHideColumns = ref(false)
const onHideColumns = () => {
  toggleHideColumns.value = !toggleHideColumns.value
  hotelGuestListTableRef.value.toggleShowHideColumns(
    expenseColumnNames.value,
    toggleHideColumns.value,
  )
}
const onClose = async () => {
  hotelGuestFormParams.value = null
  creatingHotelGuest.value = false
  showHotelGuestForm.value = !showHotelGuestForm.value
  hotelGuestListTableRef.value.fetchData()
}
const hotelGuestFormValues = ref({
  status: 'Pending',
})
const onSaveStatus = async (id) => {
  $q.loading.show({
    message: 'Yükleniyor...',
  })
  const response = await guestManagementStore.updateHotelReservationStatus({
    hotelReservationId: id,
    status: hotelGuestFormValues.value.status,
  })
  $q.loading.hide()
  if (response) {
    $q.notify({
      message: 'Status başarıyla güncellendi',
      color: 'positive',
    })
  }
  hotelGuestListTableRef.value.fetchData()
}

const dateFilterParams = ref({})
const onSubmitFilter = () => {
  let params = {}
  if (hotelGuestListFilterParams.value.showByRecordDate) {
    params = {
      isDeleted: hotelGuestListFilterParams.value.isDeleted,
      StartDate: dateFilterParams.value.StartDate,
      EndDate: dateFilterParams.value.EndDate,
      showByRecordDate: hotelGuestListFilterParams.value.showByRecordDate,
    }
    hotelGuestListFilterParams.value = { ...params }
  } else {
    params = {
      isDeleted: hotelGuestListFilterParams.value.isDeleted,
      checkInDate: dateFilterParams.value.StartDate,
      checkOutDate: dateFilterParams.value.EndDate,
      showByRecordDate: hotelGuestListFilterParams.value.showByRecordDate,
    }
    hotelGuestListFilterParams.value = { ...params }
  }

  setTimeout(() => {
    hotelGuestListTableRef.value.requestServerInteraction()
  }, 100)
}
const showRoomMates = ref(false)
const roomMates = ref([])
watch(showRoomMates, () => {
  if (hotelGuestListTableRef.value.selectedRow.players.length > 0) {
    roomMates.value = [...hotelGuestListTableRef.value.selectedRow.players]
  } else {
    roomMates.value = []
  }
})

watch(
  () => hotelGuestListTableRef.value.selectedRow,
  (value) => {
    if (value?.players?.length > 0) {
      roomMates.value = [...value.players]
    } else {
      roomMates.value = []
    }
  },
  { deep: true, immediate: true },
)

const onCliclOpenRoomCountDialog = () => {
  $q.dialog({
    component: RoomCountDialog,
    componentProps: {
      date: dateFilterParams.value,
    },
  })
}
const onSelectDate = (val) => {
  dateFilterParams.value = { ...val }
  hotelGuestListFilterParams.value = {
    ...hotelGuestListFilterParams.value,
    checkInDate: val.StartDate,
    checkOutDate: val.EndDate,
  }
}

const groupeCodes = ref([])
const fetchGroupCodes = async () => {
  groupeCodes.value = await operationsStore.fetchGroupCodes()
}
const junketStatusFormValues = ref({
  status: 'Pending',
  hotelReservationId: null,
  junketId: null,
  groupCodeId: null,
  groupCode: null,
})
const onSubmitJunketStatusForm = async (params) => {
  junketStatusFormValues.value.hotelReservationId = params.id

  const response = await guestManagementStore.updateReservationGroupCode(
    junketStatusFormValues.value,
  )
  if (response.status === 200) {
    $q.notify({
      message: 'Junket status updated successfully',
      type: 'positive',
    })
  } else {
    $q.notify({
      message: 'Junket status updated failed',
      type: 'negative',
    })
  }
  hotelGuestListTableRef.value.fetchData()
}
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
              color="blue-grey-8"
              text-color="white"
              unelevated
              no-caps
              :disable="creatingHotelGuest"
              @click="onClickShowHotelGuestForm"
            />
            <q-btn
              icon="o_settings"
              color="blue-grey-8"
              text-color="white"
              unelevated
              no-caps
              @click="onCliclOpenExpenseSettingsDialog"
              class="q-card--bordered"
            >
              <q-tooltip class="text-subtitle2 bg-blue-grey-8">{{
                $t('expenseSettings')
              }}</q-tooltip>
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
    <q-card class="q-mr-sm q-mb-md" v-show="showHotelGuestForm">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ hotelGuestFormParams?.id ? $t('editHotelGuest') : $t('createHotelGuest') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="onClose">
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }} </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm">
        <CreateHotelGuest @close="onClose" :formValues="hotelGuestFormParams" />
      </q-card-section>
    </q-card>
    <q-card v-show="!showHotelGuestForm" class="no-box-shadow bg-transparent">
      <q-card-section class="q-pa-none">
        <div class="row flex justify-start items-start">
          <div class="col-3">
            <fieldset class="fieldset">
              <legend class="text-subtitle2">{{ $t('Totals') }}</legend>
              <q-markup-table dense separator="cell" bordered flat>
                <thead>
                  <tr>
                    <th class="text-center bg-blue-grey-2 text-subtitle2" colspan="2">
                      {{ $t('Counts Report') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-green-1">
                    <td class="text-left" width="50%">
                      <div class="flex content-center items-center q-ml-sm">
                        <q-icon name="fas fa-circle" size="17px" color="green-8" />
                        <span class="text-subtitle2 q-ml-sm">
                          {{ $t('total') }}
                        </span>
                      </div>
                    </td>
                    <td class="text-left" width="50%">
                      <span class="text-subtitle2 q-ml-sm">
                        {{ hotelGuestListWidgets?.totalCount }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-orange-1">
                    <td class="text-left" width="50%">
                      <div class="flex content-center items-center q-ml-sm">
                        <q-icon name="fas fa-circle" size="17px" color="grey-8" />

                        <span class="text-subtitle2 q-ml-sm">
                          {{ $t('other') }}
                        </span>
                      </div>
                    </td>
                    <td class="text-left" width="50%">
                      <span class="text-subtitle2 q-ml-sm">
                        {{ hotelGuestListWidgets?.otherCount }}
                      </span>
                    </td>
                  </tr>
                  <tr class="bg-red-1">
                    <td class="text-left" width="50%">
                      <div class="flex content-center items-center q-ml-sm">
                        <q-icon name="fas fa-circle" size="17px" color="red-8" />
                        <span class="text-subtitle2 q-ml-sm">
                          {{ $t('todayC/O') }}
                        </span>
                      </div>
                    </td>
                    <td class="text-left" width="50%">
                      <span class="text-subtitle2 q-ml-sm">
                        {{ hotelGuestListWidgets?.todayCheckOutCount }}
                      </span>
                    </td>
                  </tr>
                  <tr class="">
                    <td class="text-left" width="50%">
                      <span class="text-subtitle2 q-ml-sm">
                        {{ toggleHideColumns ? $t('hideExpenses') : $t('showExpenses') }}
                      </span>
                    </td>
                    <td width="50%">
                      <q-btn
                        size="12px"
                        dense
                        unelevated
                        no-caps
                        :icon="toggleHideColumns ? 'o_visibility_off' : 'o_visibility'"
                        @click="onHideColumns"
                        class="q-ml-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </fieldset>
          </div>
          <div class="col-3">
            <fieldset class="fieldset row">
              <legend class="text-subtitle2">{{ $t('filter') }}</legend>
              <div class="row full-width">
                <date-time-picker
                  btnClass="col-12 q-ml-sm"
                  class="col-12"
                  @selected-date="onSelectDate"
                />
                <div class="col-12">
                  <q-checkbox
                    v-model="hotelGuestListFilterParams.showByRecordDate"
                    :label="$t('showByRecordDate')"
                    color="primary"
                  />
                </div>
                <div class="col-12">
                  <q-checkbox
                    v-model="hotelGuestListFilterParams.isDeleted"
                    :label="$t('showDeletedRecords')"
                    color="primary"
                  />
                </div>
                <div class="col-12 q-mt-xs flex justify-between">
                  <q-btn
                    type="button"
                    :label="$t('filter')"
                    icon="tune"
                    color="grey-1"
                    text-color="dark"
                    size="13px"
                    unelevated
                    no-caps
                    @click="onSubmitFilter"
                    class="q-ml-sm"
                  />
                  <q-btn
                    type="button"
                    :label="$t('roomCount') + ' (' + roomCountTotal + ')'"
                    color="negative"
                    text-color="white"
                    size="13px"
                    unelevated
                    no-caps
                    @click="onCliclOpenRoomCountDialog"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-4">
            <fieldset class="fieldset row">
              <legend class="text-subtitle2">
                <q-checkbox
                  v-model="showRoomMates"
                  :label="$t('showRoomMates')"
                  color="primary"
                  dense
                />
              </legend>
              <div class="masonry-grid">
                <div
                  class="masonry-item"
                  v-for="(roomMate, index) in roomMates.filter((p) => p.roomOwner === true)"
                  :key="index"
                >
                  <q-img
                    :src="$playerPhotoUrl + roomMate.playerId"
                    class="player-photo"
                    fit="cover"
                    error-src="/assets/no-photo.png"
                  >
                    <div class="absolute" style="top: 0px; right: 0px; padding: 0px !important">
                      <q-btn
                        dense
                        unelevated
                        color="positive"
                        icon="done"
                        size="9px"
                        square
                        v-if="roomMate.roomOwner"
                      />
                    </div>
                    <div
                      class="absolute-bottom"
                      style="
                        max-height: 20px !important;
                        padding: 0px !important;
                        background-color: rgba(0, 0, 0, 0.5) !important;
                      "
                    >
                      <div class="text-caption text-center text-capitalize">
                        {{ roomMate.playerFullName }}
                      </div>
                    </div>
                  </q-img>
                </div>
                <div
                  class="masonry-item"
                  v-for="(roomMate, index) in roomMates.filter((p) => p.roomOwner === false)"
                  :key="index"
                >
                  <q-img
                    :src="$playerPhotoUrl + roomMate.playerId"
                    class="player-photo"
                    fit="cover"
                    error-src="/assets/no-photo.png"
                    v-if="showRoomMates"
                  >
                    <div class="absolute" style="top: 0px; right: 0px; padding: 0px !important">
                      <q-btn
                        dense
                        unelevated
                        color="positive"
                        icon="done"
                        size="9px"
                        square
                        v-if="roomMate.roomOwner"
                      />
                    </div>
                    <div
                      class="absolute-bottom"
                      style="
                        max-height: 20px !important;
                        padding: 0px !important;
                        background-color: rgba(0, 0, 0, 0.5) !important;
                      "
                    >
                      <div class="text-caption text-center text-capitalize">
                        {{ roomMate.playerFullName }}
                      </div>
                    </div>
                  </q-img>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <SupaTable
          v-if="showTable"
          tableName="hotelReservations"
          :getDataFn="guestManagementStore.fetchHotelReservations"
          :filterParams="hotelGuestListFilterParams"
          :columns="columns"
          :slotNames="[
            'body-cell-roomMate',
            'body-cell-guest',
            'body-cell-playerCategoryName',
            'body-cell-Action',
            'body-cell-expenses',
            'body-cell-status',
            'body-cell-groupCode',
          ]"
          ref="hotelGuestListTableRef"
        >
          <template v-slot:body-cell-Action="{ props }">
            <q-td key="Action" align="center">
              <q-btn
                icon="o_info"
                size="12px"
                color="grey-2"
                text-color="dark"
                no-caps
                unelevated
                flat
              >
                <q-tooltip class="q-card bg-white">
                  <q-markup-table spellcheck="cell" dense square bordered>
                    <thead>
                      <tr>
                        <th class="text-center bg-grey-2">Expense</th>
                        <th class="text-center bg-grey-2">Amount</th>
                        <th class="text-center bg-grey-2">Is Deleted</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="expense in props.row.expenses" :key="expense.id">
                        <td class="text-center">{{ expense.expenseTypeName }}</td>
                        <td class="text-center">
                          {{ formatPrice(expense.amountInCasinoCurrency) }}
                        </td>
                        <td class="text-center">{{ expense.isDeleted ? 'Yes' : 'No' }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-tooltip>
              </q-btn>
              <q-btn
                unelevated
                dense
                color="grey-2"
                text-color="dark"
                no-caps
                size="12px"
                icon="fa-regular fa-pen-to-square"
                class="q-mr-md"
                @click="onClickShowHotelGuestForm(props.row)"
              />
              <q-btn
                unelevated
                dense
                color="info"
                size="10px"
                icon="content_copy"
                class="q-mr-md"
                @click="onCopyHotelGuest(props.row)"
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
                @click="onDeleteHotelGuest(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-guest="{ props }">
            <q-td key="guest" align="center">
              <div v-if="props.row.players?.length">
                <div
                  v-for="(player, index) in props.row.players.filter((p) => p.roomOwner)"
                  :key="player.playerId"
                >
                  <span>{{ index + 1 }}.{{ player.playerFullName }}</span>
                </div>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-roomMate="{ props }">
            <q-td key="roomMate" align="center">
              <div v-if="props.row.players?.length">
                <div
                  v-for="(player, index) in props.row.players.filter((p) => !p.roomOwner)"
                  :key="player.playerId"
                >
                  <span>{{ index + 1 }}.{{ player.playerFullName }}</span>
                </div>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-playerCategoryName="{ props }">
            <q-td key="playerCategoryName" align="center">
              {{ props.row.players?.find((player) => player.roomOwner)?.playerCategoryName }}
            </q-td>
          </template>
          <template v-slot:body-cell-status="{ props }">
            <q-td key="status" align="center">
              <div>
                {{ props.row.status }}
                <q-menu
                  transition-show="flip-right"
                  transition-hide="flip-left"
                  @show="
                    () => {
                      hotelGuestFormValues.status = props.row.status
                    }
                  "
                >
                  <q-card style="width: 200px">
                    <q-card-section class="q-pa-sm text-center bg-grey-2 q-card--bordered">
                      <div class="text-subtitle2 text-negative">Update Status</div>
                    </q-card-section>

                    <q-card-section class="q-pa-sm">
                      <div class="text-subtitle2">Status</div>
                      <q-select
                        v-model="hotelGuestFormValues.status"
                        :options="statuses"
                        :rules="[(val) => !!val]"
                        map-options
                        emit-value
                        option-label="label"
                        option-value="value"
                        outlined
                        dense
                        bg-color="white"
                        hide-bottom-space
                      />
                    </q-card-section>
                    <q-card-actions class="q-pa-sm" align="right">
                      <q-btn
                        :label="$t('cancel')"
                        icon="o_close"
                        no-caps
                        color="negative"
                        unelevated
                        dense
                        flat
                        v-close-popup
                      />
                      <q-btn
                        :label="$t('save')"
                        icon="o_save"
                        no-caps
                        color="primary"
                        unelevated
                        dense
                        @click="onSaveStatus(props.row.id)"
                        v-close-popup
                      />
                    </q-card-actions>
                  </q-card>
                </q-menu>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-groupCode="{ props }">
            <q-td key="status" align="center">
              <div>
                {{ props.row?.groupCode || '-' }}
                <q-menu
                  transition-show="flip-right"
                  transition-hide="flip-left"
                  @show="
                    () => {
                      junketStatusFormValues.status = props.row.status
                      junketStatusFormValues.junketId = props.row.players?.find(
                        (player) => player.roomOwner,
                      )?.playerCategoryId
                      junketStatusFormValues.groupCodeId = props.row.groupCodeId
                    }
                  "
                >
                  <q-card style="width: 250px">
                    <q-card-section class="q-pa-sm text-center bg-grey-2 q-card--bordered">
                      <div class="text-subtitle2 text-negative">Update Junket Status</div>
                    </q-card-section>

                    <q-card-section class="q-pa-sm">
                      <div class="text-subtitle2">Junket</div>
                      <q-select-box
                        v-model="junketStatusFormValues.junketId"
                        :options="visitorCategories"
                        :rules="[(val) => !!val]"
                        option-label="name"
                        option-value="id"
                        hide-bottom-space
                      />
                    </q-card-section>
                    <q-card-section class="q-pa-sm">
                      <div class="text-subtitle2">Group Code</div>
                      <q-select-box
                        v-model="junketStatusFormValues.groupCodeId"
                        :options="groupeCodes"
                        :rules="[(val) => !!val]"
                        option-label="code"
                        option-value="id"
                        hide-bottom-space
                        @update:model-value="
                          (val) => {
                            if (val) {
                              junketStatusFormValues.groupCode = groupeCodes.find(
                                (code) => code.id === +val,
                              )?.code
                            } else {
                              junketStatusFormValues.groupCode = null
                            }
                          }
                        "
                      />
                    </q-card-section>
                    <q-card-section class="q-pa-sm">
                      <div class="text-subtitle2">Status</div>
                      <q-select-box
                        v-model="junketStatusFormValues.status"
                        :options="statuses"
                        :rules="[(val) => !!val]"
                        option-label="label"
                        option-value="value"
                        hide-bottom-space
                      />
                    </q-card-section>
                    <q-card-actions class="q-pa-sm" align="right">
                      <q-btn
                        :label="$t('cancel')"
                        icon="o_close"
                        no-caps
                        color="negative"
                        unelevated
                        dense
                        flat
                        v-close-popup
                      />
                      <q-btn
                        :label="$t('save')"
                        icon="o_save"
                        no-caps
                        color="primary"
                        unelevated
                        dense
                        @click="onSubmitJunketStatusForm(props.row)"
                        v-close-popup
                      />
                    </q-card-actions>
                  </q-card>
                </q-menu>
              </div>
            </q-td>
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

.room-count-box {
  background-color: $negative;
  height: 80px;
  width: 80px;
  border-radius: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
  font-weight: bold;
}
.fieldset {
  border: 1px solid #4b4f52 !important;
  border-radius: 5px;
  height: 190px;
}

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-gap: 4px;
  padding: 4px;
  width: 100%;
  max-height: 160px;
}

.masonry-item {
  break-inside: avoid;
  aspect-ratio: 1;
  width: 100%;
}
</style>
