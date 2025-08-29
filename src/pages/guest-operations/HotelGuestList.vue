<script setup>
import { onMounted, ref } from 'vue'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import CreateHotelGuest from 'src/components/pages/guest-operations/CreateHotelGuest.vue'
const guestManagementStore = useGuestManagementStore()

onMounted(() => {
  guestManagementStore.fetchVisitorCategories()
  guestManagementStore.fetchFlightTicketTypes()
  guestManagementStore.fetchBoardTypes()
  guestManagementStore.fetchRoomTypes()
  guestManagementStore.fetchExpenseParameters()
})

const onCliclOpenExpenseSettingsDialog = () => {
  console.log('open expense settings dialog')
}

const onCopyHotelGuest = (params) => {
  console.log('copy hotel guest', params)
}

const onDeleteHotelGuest = async (params) => {
  const response = await guestManagementStore.deleteHotelReservation(params.id)
  if (response.status === 200) {
    hotelGuestListTableRef.value.fetchData()
  }
}

const hotelGuestListTableRef = ref(null)
const showHotelGuestForm = ref(false)
const hotelGuestFormParams = ref({})
const onClickShowHotelGuestForm = (params) => {
  showHotelGuestForm.value = true
  hotelGuestFormParams.value = params
}
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
const hotelGuestListFilterParams = ref({})

const toggleHideColumns = ref(true)
const onHideColumns = () => {
  toggleHideColumns.value = !toggleHideColumns.value
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
              @click="onClickShowHotelGuestForm"
            />
            <q-btn
              icon="o_settings"
              color="blue-grey-8"
              text-color="white"
              unelevated
              no-caps
              @click="onCliclOpenExpenseSettingsDialog"
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
    <q-card class="q-mr-sm q-mb-md" v-show="showHotelGuestForm">
      <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
        <div class="text-subtitle2">
          {{ $t('createHotelGuest') }}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="showHotelGuestForm = false">
          <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }} </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pa-sm">
        <CreateHotelGuest />
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
