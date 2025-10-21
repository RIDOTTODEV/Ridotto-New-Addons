<template>
  <q-card class="bg-transparent">
    <transition name="slide-fade" mode="out-in">
      <q-card-section class="q-pa-none">
        <SupaTable
          :columns="columns"
          :getDataFn="cashdeskStore.fetchPlayerTransactions"
          :rowsPerPage="10"
          tableName="pettyCashColumns"
          :filterParams="filterFields"
          :slotNames="['body-cell-actions']"
          ref="playerTransactionsTable"
          :useCol12="false"
          :hideFields="{
            showVisibleColumns: true,
            showReloadButton: true,
            showScreenModeButton: true,
            showSearchInput: true,
            useCol12: false,
            switchSummaryCard: false,
          }"
          @switchSummaryCard="showSummaryCard = !showSummaryCard"
        >
          <template v-slot:headerFilterSlots>
            <div class="col-9 flex row justify-start q-py-xs">
              <div class="row full-width">
                <q-select-box
                  v-model="filterFields.cashdeskId"
                  :options="cashdesks"
                  option-value="id"
                  option-label="name"
                  :label="$t('cashdesk')"
                  :fetchFn="cashdeskStore.fetchCashdesks"
                  class="col-4 q-pl-xs"
                />
                <q-select-box
                  v-model="filterFields.marketerId"
                  :options="visitorCategories"
                  option-value="id"
                  option-label="name"
                  :label="$t('marketer')"
                  :fetchFn="guestManagementStore.fetchVisitorCategories"
                  class="col-4 q-pl-xs"
                />
                <q-select-box
                  v-model="filterFields.locationId"
                  :options="locations"
                  option-value="id"
                  option-label="name"
                  :label="$t('location')"
                  :fetchFn="definitionStore.fetchLocations"
                  class="col-4 q-pl-xs"
                />
              </div>
              <div class="row full-width flex justify-start">
                <div class="col-5 q-pa-xs">
                  <search-player-input
                    v-model="filterFields.playerId"
                    :optionLabel="'value'"
                    :displayedValue="filterFields.playerName"
                    @onSelectPlayer="
                      (args) => {
                        filterFields.playerId = args?.id
                        filterFields.playerName = args?.value
                      }
                    "
                    :label="$t('playerName')"
                    class="super-small full-width"
                  />
                </div>
                <div class="col-5 q-pa-xs">
                  <q-select
                    v-model="filterFields.transactionCodeIds"
                    :options="transactionCodes"
                    option-value="id"
                    option-label="name"
                    :label="$t('transactionCode')"
                    class="super-small"
                    emit-value
                    map-options
                    behavior="menu"
                    multiple
                    clearable
                    outlined
                    dense
                  />
                </div>
              </div>
              <div class="row full-width flex justify-start">
                <div class="col-12 q-pa-xs flex justify-start">
                  <date-time-picker
                    @selected-date="
                      (val) => {
                        filterFields = {
                          ...filterFields,
                          ...val,
                        }
                      }
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
                    class="q-ml-sm"
                    @click="playerTransactionsTable.fetchData()"
                  />
                  <q-btn
                    type="button"
                    :label="$t('excelExport')"
                    icon="o_file_download"
                    color="green-9"
                    size="13px"
                    unelevated
                    no-caps
                    class="q-ml-sm"
                    @click="
                      reportStore.getPettyCashTransactions({
                        ...filterFields,
                        exportFileType: 'Excel',
                      })
                    "
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-slot:body-cell-actions="{ props }">
            <q-td key="actions" align="center">
              <q-btn
                unelevated
                dense
                text-color="blue-grey-9"
                size="11px"
                icon="fa-regular fa-eye"
                class="q-mr-sm"
                @click="onClickPlayerTransactionDetail(props.row)"
                v-el-perms="'Addon.CageOperations.Transaction.Detail'"
              />
            </q-td>
          </template>
        </SupaTable>
      </q-card-section>
    </transition>
    <q-dialog
      v-model="playerTransactionDetailDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      class="historyModal"
      backdrop-filter="brightness(40%)"
      square
    >
      <q-card :style="`height: ${$getWindowHeight}px!important;`">
        <q-bar style="height: 50px" class="app-cart-grey q-card--bordered">
          <div class="text-subtitle2">
            {{ $t('playerTransactionDetail') }}
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="text-subtitle1 bg-blue-grey-8">{{ $t('close') }}</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-none">
          <SupaTable
            :columns="playerTransactionDetailColumns"
            :getDataFn="cashdeskStore.fetchPlayerTransactionDetail"
            :rowsPerPage="10"
            tableName="playerTransactionDetailColumns"
            :filterParams="playerTransactionDetailFilters"
            :slotNames="[
              'body-cell-actions',
              'body-cell-transactionCodeName',
              'body-cell-code',
              'body-cell-createdAt',
              'body-cell-locationName',
            ]"
            ref="playerTransactionDetailTable"
            :useCol12="false"
            :hideFields="{
              showVisibleColumns: true,
              showReloadButton: true,
              showScreenModeButton: true,
              showSearchInput: true,
              useCol12: false,
              switchSummaryCard: false,
            }"
            @switchSummaryCard="showSummaryCard = !showSummaryCard"
          >
            <template v-slot:headerFilterSlots>
              <div class="col-9 flex row justify-start q-py-xs">
                <div class="row full-width flex justify-start q-gutter-x-sm q-gutter-y-sm">
                  <q-select-box
                    v-model="playerTransactionDetailFilters.cashdeskId"
                    :options="cashdesks"
                    option-value="id"
                    option-label="name"
                    :label="$t('cashdesk')"
                    :fetchFn="cashdeskStore.fetchCashdesks"
                    style="width: 200px"
                  />
                  <q-select-box
                    v-model="playerTransactionDetailFilters.marketerId"
                    :options="visitorCategories"
                    option-value="id"
                    option-label="name"
                    :label="$t('marketer')"
                    :fetchFn="guestManagementStore.fetchVisitorCategories"
                    style="width: 200px"
                  />
                  <q-select-box
                    v-model="playerTransactionDetailFilters.locationId"
                    :options="locations"
                    option-value="id"
                    option-label="name"
                    :label="$t('location')"
                    :fetchFn="definitionStore.fetchLocations"
                    style="width: 200px"
                  />
                  <search-player-input
                    v-model="playerTransactionDetailFilters.playerId"
                    :optionLabel="'value'"
                    :displayedValue="playerTransactionDetailFilters.playerName"
                    @onSelectPlayer="
                      (args) => {
                        playerTransactionDetailFilters.playerId = args?.id
                        playerTransactionDetailFilters.playerName = args?.value
                      }
                    "
                    :label="$t('playerName')"
                    class="super-small"
                    style="min-width: 300px"
                  />
                  <q-select
                    v-model="playerTransactionDetailFilters.transactionCodeIds"
                    :options="transactionCodes"
                    option-value="id"
                    option-label="name"
                    :label="$t('transactionCode')"
                    class="super-small"
                    emit-value
                    map-options
                    behavior="menu"
                    multiple
                    clearable
                    outlined
                    dense
                    style="min-width: 300px"
                  />
                  <date-time-picker
                    :setDate="{
                      StartDate: filterFields.StartDate,
                      EndDate: filterFields.EndDate,
                      QueryType: filterFields.QueryType,
                      label: filterFields.label,
                    }"
                    @selected-date="
                      (val) => {
                        playerTransactionDetailFilters = {
                          ...playerTransactionDetailFilters,
                          ...val,
                        }
                      }
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
                    class="q-ml-sm"
                    @click="playerTransactionDetailTable.fetchData()"
                  />
                </div>
              </div>
            </template>

            <template v-slot:body-cell-transactionCodeName="{ props }">
              <q-td key="status" align="center">
                <div>
                  {{ props.row?.transactionCodeName || '-' }}
                  <q-menu
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    @show="
                      () => {
                        transactionCodeFormValues.transactionCodeId = props.row.transactionCodeId
                      }
                    "
                  >
                    <q-card style="width: 250px">
                      <q-card-section class="q-pa-sm text-center bg-grey-2 q-card--bordered">
                        <div class="text-subtitle2 text-negative">Update Transaction Code</div>
                      </q-card-section>

                      <q-card-section class="q-pa-sm">
                        <div class="text-subtitle2">Transaction Code</div>
                        <q-select-box
                          v-model="transactionCodeFormValues.transactionCodeId"
                          :options="transactionCodes"
                          :rules="[(val) => !!val]"
                          option-label="name"
                          option-value="id"
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
                          @click="onSubmitUpdateTransactionCode(props.row)"
                          v-close-popup
                        />
                      </q-card-actions>
                    </q-card>
                  </q-menu>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-createdAt="{ props }">
              <q-td key="status" align="center">
                <div>
                  {{ props.value }}

                  <q-menu
                    transition-show="flip-right"
                    transition-hide="flip-left"
                    @show="
                      () => {
                        transactionDateFormValues.date = date.formatDate(
                          props.row.createdAt,
                          'YYYY/MM/DD',
                        )
                      }
                    "
                  >
                    <q-card style="width: 250px">
                      <q-card-section class="q-pa-sm text-center bg-grey-2 q-card--bordered">
                        <div class="text-subtitle2 text-negative">Update Date</div>
                      </q-card-section>

                      <q-card-section class="q-pa-sm">
                        <div class="text-subtitle2">Date</div>
                        <q-input
                          outlined
                          dense
                          v-model="transactionDateFormValues.date"
                          :rules="[(val) => !!val]"
                          class="super-small"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="transactionDateFormValues.date">
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      :label="$t('close')"
                                      color="primary"
                                      flat
                                      no-caps
                                      unelevated
                                      dense
                                    />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
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
                          @click="onSubmitUpdateTransactionDate(props.row)"
                          v-close-popup
                        />
                      </q-card-actions>
                    </q-card>
                  </q-menu>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-code="{ props }">
              <q-td :props="props" align="center" key="code" class="cursor-pointer">
                <div class="flex justify-center">
                  <q-input
                    v-model="props.row.code"
                    input-class="text-center"
                    class="super-small"
                    dense
                    borderless
                    style="width: 50px"
                    @update:model-value="(val) => onChangeTransactionGroupCode(val, props.row)"
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-locationName="{ props }">
              <q-td key="status" align="center">
                <div>
                  {{ props.row?.locationName || '-' }}
                  <q-menu transition-show="flip-right" transition-hide="flip-left">
                    <q-card style="width: 250px">
                      <q-card-section class="q-pa-sm text-center bg-grey-2 q-card--bordered">
                        <div class="text-subtitle2 text-negative">Update Location</div>
                      </q-card-section>

                      <q-card-section class="q-pa-sm">
                        <div class="text-subtitle2">Location</div>
                        <q-select-box
                          v-model="props.row.locationId"
                          :options="locations"
                          :rules="[(val) => !!val]"
                          option-label="name"
                          option-value="id"
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
                          @click="onSubmitUpdateTransactionLocation(props.row)"
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
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCashdeskStore } from 'src/stores/cashdesk-store'
import { useReportStore } from 'src/stores/report-store'
import { date, Loading, useQuasar } from 'quasar'
import { useGuestManagementStore } from 'src/stores/guest-management-store'
import { useDefinitionStore } from 'src/stores/definition-store'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { storeToRefs } from 'pinia'
const $q = useQuasar()
const cashdeskStore = useCashdeskStore()
const { getSelectedCashDeskId, cashdesks } = storeToRefs(cashdeskStore)
const guestManagementStore = useGuestManagementStore()
const { visitorCategories } = storeToRefs(guestManagementStore)
const definitionStore = useDefinitionStore()
const { locations } = storeToRefs(definitionStore)
const transactionCodeStore = useTransactionCodeStore()
const { transactionCodes } = storeToRefs(transactionCodeStore)
const filterFields = ref({
  cashdeskId: getSelectedCashDeskId.value,
  playerId: null,
  playerName: null,
  locationId: null,
  marketerId: null,
  transactionCodeIds: null,
})
const playerTransactionsTable = ref(null)

const columns = ref([
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
  {
    name: 'createdAt',
    label: 'Created At',
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    name: 'playerFullName',
    label: 'Player',
    field: 'playerFullName',
  },
  {
    name: 'transactionCodeName',
    label: 'Transaction Code',
    field: 'transactionCodeName',
  },
  {
    name: 'defaultCurrencyAmount',
    label: 'Amount',
    field: 'defaultCurrencyAmount',
    fieldType: 'priceAbs',
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    field: 'dueDate',
    fieldType: 'date',
  },
  {
    name: 'defaultCurrencyName',
    label: 'Currency',
    field: 'defaultCurrencyName',
  },
  {
    name: 'locationName',
    label: 'Location',
    field: 'locationName',
  },
  {
    name: 'createdByName',
    label: 'Created By',
    field: 'createdByName',
  },
  {
    name: 'marketerName',
    label: 'Marketer',
    field: 'marketerName',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
  },
])
const onClickPlayerTransactionDetail = (row) => {
  playerTransactionDetailFilters.value = {
    ...filterFields.value,
    playerId: row.playerId,
    transactionCodeId: row.transactionCodeId,
  }
  playerTransactionDetailDialog.value = true
}
onMounted(async () => {
  await definitionStore.fetchLocations()
})

const playerTransactionDetailDialog = ref(false)
const playerTransactionDetailFilters = ref(null)
const playerTransactionDetailTable = ref(null)

const playerTransactionDetailColumns = ref([
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
  {
    name: 'createdAt',
    label: 'Created At',
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    field: 'dueDate',
    fieldType: 'date',
  },
  {
    name: 'playerFullName',
    label: 'Player',
    field: 'playerFullName',
  },
  {
    name: 'transactionCodeName',
    label: 'Transaction Code',
    field: 'transactionCodeName',
  },
  {
    name: 'transactionType',
    label: 'Transaction Type',
    field: 'transactionType',
    format: (val) => {
      return val === 'Deposit' ? 'Paid' : 'Received'
    },
  },
  {
    name: 'locationName',
    label: 'Location',
    field: 'locationName',
  },

  {
    name: 'createdByName',
    label: 'Created By',
    field: 'createdByName',
  },

  {
    name: 'currencyName',
    label: 'Currency',
    field: 'currencyName',
  },
  {
    name: 'defaultCurrencyAmount',
    label: 'Amount',
    field: 'defaultCurrencyAmount',
    fieldType: 'priceAbs',
  },
  {
    name: 'balance',
    label: 'Balance',
    field: 'balance',
    fieldType: 'priceAbs',
  },
  {
    name: 'code',
    label: 'Code',
    field: 'code',
  },
  {
    name: 'note',
    label: 'Not',
    field: 'note',
  },
])

const transactionCodeFormValues = ref({
  transactionCodeId: null,
  playerTransactionId: null,
})

const onSubmitUpdateTransactionCode = async (row) => {
  Loading.show({ message: 'Updating Transaction Code...' })
  transactionCodeFormValues.value.playerTransactionId = row.transactionId
  await cashdeskStore
    .updatePlayerTransactionCode({ ...transactionCodeFormValues.value })
    .then(async () => {
      await playerTransactionDetailTable.value.fetchData()
      $q.notify({
        type: 'positive',
        message: 'Transaction Code updated successfully',
      })
    })
    .catch(() => {
      Loading.hide()
      $q.notify({
        type: 'negative',
        message: 'Failed to update Transaction Code',
      })
    })
    .finally(() => {
      Loading.hide()
    })
}

const transactionDateFormValues = ref({
  date: null,
  playerTransactionId: null,
})

const onChangeTransactionGroupCode = async (val, row) => {
  row = {
    ...row,
    code: val,
  }

  await onSubmitUpdateTransactionGroupCode(row)
}

const onSubmitUpdateTransactionGroupCode = async (row) => {
  Loading.show({ message: 'Updating Group Code...' })
  let form = {
    playerTransactionId: row.transactionId,
    code: row.code,
  }

  await cashdeskStore
    .updatePlayerTransactionGroupCode(form)
    .then(async () => {
      await playerTransactionDetailTable.value.fetchData()
      $q.notify({
        type: 'positive',
        message: 'Group Code updated successfully',
      })
    })
    .catch(() => {
      Loading.hide()
      $q.notify({
        type: 'negative',
        message: 'Failed to update Group Code',
      })
    })
    .finally(() => {
      Loading.hide()
    })
}

const onSubmitUpdateTransactionDate = async (row) => {
  Loading.show({ message: 'Updating Due Date...' })
  transactionDateFormValues.value.playerTransactionId = row.transactionId
  transactionDateFormValues.value.date = date.formatDate(
    transactionDateFormValues.value.date,
    'YYYY-MM-DD',
  )
  await cashdeskStore
    .updatePlayerTransactionDate({ ...transactionDateFormValues.value })
    .then(async () => {
      await playerTransactionDetailTable.value.fetchData()
      $q.notify({
        type: 'positive',
        message: 'Due Date updated successfully',
      })
    })
    .catch(() => {
      Loading.hide()
      $q.notify({
        type: 'negative',
        message: 'Failed to update Due Date',
      })
    })
    .finally(() => {
      Loading.hide()
    })
}

const onSubmitUpdateTransactionLocation = async (row) => {
  Loading.show({ message: 'Updating Location...' })
  let form = {
    playerTransactionId: row.transactionId,
    locationId: row.locationId,
  }
  await cashdeskStore
    .updatePlayerTransactionLocation({ ...form })
    .then(async () => {
      await playerTransactionDetailTable.value.fetchData()
      $q.notify({
        type: 'positive',
        message: 'Location updated successfully',
      })
    })
    .catch(() => {
      Loading.hide()
      $q.notify({
        type: 'negative',
        message: 'Failed to update Location',
      })
    })
    .finally(() => {
      Loading.hide()
    })
}

const reportStore = useReportStore()
</script>

<style scoped></style>
