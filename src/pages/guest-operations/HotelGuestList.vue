<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import CreateHotelGuest from 'src/components/pages/guest-operations/HotelGuestForm.vue'
import ExpenseSettingsDialog from 'src/components/pages/guest-operations/ExpenseSettingsDialog.vue'
import { formatPrice } from 'src/helpers/helpers'
const guestManagementStore = useGuestManagementStore()
const $q = useQuasar()
onMounted(() => {
  guestManagementStore.fetchVisitorCategories()
  guestManagementStore.fetchFlightTicketTypes()
  guestManagementStore.fetchBoardTypes()
  guestManagementStore.fetchRoomTypes()
  guestManagementStore.fetchExpenseParameters()
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
  showHotelGuestForm.value = {
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
    players: [],
    status: 'Pending',
    isCopy: true,
  }
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
const hotelGuestListTableRef = ref(null)
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
    parseIndex: 0,
  },
  {
    field: 'createdAt',
    fieldType: 'date',
    parseIndex: 1,
  },
  {
    field: 'playerCategoryName',
    label: 'Category',
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
    field: 'status',
    fieldType: 'boolean',
  },
  {
    field: 'expenseDirection',
  },
  {
    field: 'expenses',
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
    field: 'dayCount',
  },
  {
    field: 'roomType',
  },
  {
    field: 'roomNo',
  },
  {
    field: 'roomPrice',
    fieldType: 'price',
  },
  {
    field: 'boardType',
  },
  {
    field: 'expenseUse',
    fieldType: 'boolean',
  },
  {
    field: 'flight',
  },
  {
    field: 'ticketType',
  },
  {
    field: 'from',
  },
  {
    field: 'to',
  },
  {
    field: 'to2',
  },
  {
    field: 'pnr',
  },
  {
    field: 'pnr2',
  },
  {
    field: 'flightTicketPrice',
    fieldType: 'price',
  },
  {
    field: 'isBusiness',
    fieldType: 'boolean',
  },
  {
    field: 'note',
  },
  {
    field: 'remark',
  },
  {
    field: 'phone',
  },
  {
    field: 'minibar',
  },
  {
    field: 'spa',
  },
  {
    field: 'isDeleted',
    fieldType: 'boolean',
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
    field: 'expenses',
    name: 'totalExpense',
    label: 'Total Expense',
    fieldType: 'custom',
    customFormat: (value) => {
      return formatPrice(value.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0))
    },
    defaultVisible: true,
  },
  {
    field: 'Action',
  },
])
const hotelGuestListFilterParams = ref({})

const toggleHideColumns = ref(true)
const onHideColumns = () => {
  toggleHideColumns.value = !toggleHideColumns.value
  hotelGuestListTableRef.value.toggleShowHideColumns(['totalExpense'], toggleHideColumns.value)
}
const onClose = async () => {
  hotelGuestFormParams.value = null
  creatingHotelGuest.value = false
  showHotelGuestForm.value = !showHotelGuestForm.value
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
          {{ $t('createHotelGuest') }}
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
    <q-card v-show="!showHotelGuestForm" class="no-box-shadow">
      <q-card-section class="q-pa-none">
        <SupaTable
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
          ]"
          ref="hotelGuestListTableRef"
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
          <template v-slot:headerFilterSlots="{ props }">
            <div class="col q-pl-sm q-mr-sm flex row justify-start">
              <div class="q-pa-xs flex items-end">
                <date-time-picker
                  @selected-date="
                    (val) =>
                      (hotelGuestListFilterParams = {
                        ...hotelGuestListFilterParams,
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
          <template v-slot:body-cell-expenses="{ props }">
            <q-td key="expenses" align="center">
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
                        <td class="text-center">{{ formatPrice(expense.amount) }}</td>
                        <td class="text-center">{{ expense.isDeleted ? 'Yes' : 'No' }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </q-tooltip>
              </q-btn>
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
</style>
