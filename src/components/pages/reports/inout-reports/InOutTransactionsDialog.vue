<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    :class="maximized ? '' : 'historyModal'"
    backdrop-filter="brightness(40%)"
  >
    <q-card class=" " :style="maximized ? '' : `height: ${$getWindowHeight}px!important;`">
      <q-bar>
        <div class="text-subtitle2" v-if="props.playerId">
          <span class="text-negative">{{ props.playerName }}</span> -
          <span> {{ $t('transactions') }}</span>
        </div>
        <div class="text-subtitle2" v-else>
          {{ $t('allPlayerTransactions') }}
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" v-close-popup>
          <q-tooltip class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximized = !maximized">
          <q-tooltip class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-none q-mt-md">
        <SupaTable
          :columns="columns"
          :getDataFn="playerStore.fetchPlayerTransactions"
          :rowsPerPage="10"
          tableName="playerTransactionsTable"
          ref="refTable"
          :filterParams="filterFormValues"
          :slotNames="['body']"
        >
          <template v-slot:body="{ props }">
            <q-tr
              :props="props"
              :class="props.row.transactionType === 'Withdrawal' ? 'bg-withdrawal' : 'bg-deposit'"
            >
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name === 'amount'">
                  <span>
                    {{ col.format(props.row.amount) }}
                  </span>
                </div>
                <div v-else>{{ col.value }}</div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:headerFilterSlots>
            <div class="col-8 q-pl-sm q-mr-sm flex row justify-start">
              <div class="q-pa-xs flex items-end">
                <q-select
                  v-model="filterFormValues.TransactionType"
                  outlined
                  dense
                  options-dense
                  emit-value
                  map-options
                  :options="transactionTypes"
                  option-value="value"
                  style="min-width: 250px"
                  class="q-pr-sm super-small"
                  :label="$t('transactionType')"
                  clearable
                />
                <q-select-box
                  v-model="filterFormValues.TransType"
                  :options="transTypes"
                  option-value="value"
                  option-label="label"
                  style="min-width: 250px"
                  class="q-pr-sm super-small"
                  :label="$t('transType')"
                  sty
                  clearable
                />
                <date-time-picker
                  @selected-date="
                    (val) =>
                      (filterFormValues = {
                        ...filterFormValues,
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
                  v-if="refTable"
                  @click="refTable.fetchData()"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </template>
        </SupaTable>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionCodeStore } from 'src/stores/transaction-code-store'
import { usePlayerStore } from 'src/stores/player-store'
import { useDialogPluginComponent } from 'quasar'

const maximized = ref(false)

const props = defineProps({
  playerId: {
    type: Number,
    required: false,
    default: () => null,
  },
  playerName: {
    type: String,
    required: false,
    default: () => null,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const refTable = ref(null)
const filterFormValues = ref({
  TransactionType: null,
  playerId: props.playerId,
  TransType: null,
})
const playerStore = usePlayerStore()
const { dateTimeFilterValues } = storeToRefs(playerStore)
const transactionCodeStore = useTransactionCodeStore()
const { transTypes } = storeToRefs(transactionCodeStore)

const transactionTypes = ref([
  {
    value: 'deposit',
    label: 'Deposit',
  },
  {
    value: 'withdrawal',
    label: 'Withdrawal',
  },
])
onMounted(() => {
  filterFormValues.value = {
    ...filterFormValues.value,
    ...dateTimeFilterValues.value,
  }
})

const columns = ref([
  {
    field: 'createdAt',
    fieldType: 'date',
  },
  {
    field: 'createdByName',
    label: 'Created By',
  },
  {
    field: 'playerFullName',
    label: 'Player',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'amount',
    label: 'Amount',
    fieldType: 'priceAbs',
  },
  {
    field: 'transactionType',
    label: 'Transaction Type',
  },
  {
    field: 'transType',
    label: 'Transaction Type',
  },
  {
    field: 'transactionCodeTypes',
    label: 'Transaction Code Types',
  },
  {
    field: 'note',
    label: 'Note',
  },
  {
    field: 'detail',
    label: 'Detail',
  },
  {
    field: 'playerTransactionBillType',
    label: 'Player Transaction Bill Type',
  },
  {
    field: 'playerTransactionGameType',
    label: 'Player Transaction Game Type',
  },
])
</script>

<style lang="scss">
.historyModal .q-dialog__inner {
  align-content: end;
}

.sprintButton {
  width: 150px;
  float: right;
  height: 6px;
  top: 0px !important;
  position: absolute;
}
.cursor-grab {
  cursor: -webkit-grab;
  cursor: grab;
}
.text-underline {
  text-decoration: underline;
  font-size: 12px;
  font-weight: 600;
}
</style>
