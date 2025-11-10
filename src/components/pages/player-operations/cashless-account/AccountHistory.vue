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
          :getDataFn="playerStore.fetchPlayerAccountTransactions"
          :rowsPerPage="10"
          tableName="playerAccountTransactionsTable"
          ref="refTable"
          :filterParams="filterFormValues"
          :dataKey="'data'"
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
                    <span style="display: inline-block; font-size: 10px; width: 50px">
                      {{ formatPrice(props.row.oldAmount) }}
                    </span>
                    <span
                      v-if="props.row.transactionType === 'Withdrawal'"
                      style="display: inline-block; width: 10px"
                      >-</span
                    >
                    <span v-else style="display: inline-block; width: 10px">+</span>
                    <span style="display: inline-block; width: 75px" class="text-underline">
                      {{ formatPrice(props.row.amount) }}
                    </span>
                    <span style="display: inline-block; width: 85px" class="text-bold">
                      = {{ formatPrice(props.row.newAmount) }}
                    </span>
                  </span>
                </div>
                <div v-if="col.name === 'cashdeskName'">
                  {{
                    props.row.floorNo ? 'Floor No: ' + props.row.floorNo : props.row.cashdeskName
                  }}
                </div>
                <div v-else>{{ col.value }}</div>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:headerFilterSlots>
            <div class="flex flex-col sm:flex-row gap-2">
              <q-select
                v-model="filterFormValues.TransactionType"
                outlined
                dense
                options-dense
                emit-value
                map-options
                :options="playerStore.accountTransactionTypes"
                option-value="value"
                class="w-full super-small sm:w-auto md:min-w-[170px]"
                :label="$t('transactionType')"
                clearable
              />
              <q-select
                v-model="filterFormValues.CashlessTransactionType"
                outlined
                dense
                options-dense
                emit-value
                map-options
                :options="CashlessTransactionTypes"
                option-value="value"
                class="w-full super-small sm:w-auto md:min-w-[170px]"
                :label="$t('cashlessTransactionType')"
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
                :setDate="dateTimeFilterValues"
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
                class="w-full super-small sm:w-auto"
              />
            </div>
          </template>
        </SupaTable>
      </q-card-section>
      <q-card-section>
        <q-card class="no-box-shadow q-mt-xs" square v-if="transactionTotals.length > 0">
          <q-card-section class="q-pa-none">
            <div class="text-subtitle1 text-bold">Transaction Totals</div>
          </q-card-section>
          <q-card-section class="row app-cart-grey q-pa-none">
            <div class="col text-center right-separator">
              <div class="text-subtitle1 text-bold">Currency</div>
            </div>
            <div class="col text-center right-separator">
              <div class="text-subtitle1 text-bold">Withdrawal</div>
            </div>
            <div class="col text-center right-separator">
              <div class="text-subtitle1 text-bold">Deposit</div>
            </div>
            <div class="col text-center right-separator">
              <div class="text-subtitle1 text-bold">Result</div>
            </div>
            <div class="col text-center right-separator">
              <div class="text-subtitle1 text-bold">Result By Currency</div>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <div
              class="row q-card--bordered"
              v-for="(total, index) in transactionTotals"
              :key="index"
            >
              <div class="col text-center right-separator">
                <div class="text-subtitle1 text-bold">
                  {{ total?.currencyName }}
                </div>
              </div>
              <div class="col text-center right-separator">
                <div class="text-subtitle1 text-bold">
                  {{ priceAbsFormatted(total?.withdrawal) }}
                </div>
              </div>
              <div class="col text-center right-separator">
                <div class="text-subtitle1 text-bold">
                  {{ priceAbsFormatted(total?.deposit) }}
                </div>
              </div>
              <div class="col text-center right-separator">
                <div class="text-subtitle1 text-bold">
                  {{ priceAbsFormatted(total?.result) }}
                </div>
              </div>
              <div class="col text-center right-separator">
                <div class="text-subtitle1 text-bold">
                  {{ priceAbsFormatted(total?.resultByDefaultCurrency) }}
                </div>
              </div>
            </div>
            <div class="row q-card--bordered justify-end">
              <div class="col text-center"></div>
              <div class="col text-center"></div>
              <div class="col text-center"></div>
              <div class="col text-center"></div>
              <div class="col text-center app-cart-grey">
                <div class="text-subtitle1 text-bold">
                  Totals: {{ priceAbsFormatted(transactionsTotalAmount) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from 'src/stores/player-store'
import { useDialogPluginComponent } from 'quasar'
import { priceAbsFormatted, formatPrice } from 'src/helpers/helpers'

const maximized = ref(false)

const props = defineProps({
  playerAccountId: {
    type: Number,
    required: false,
  },
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const refTable = ref(null)
const filterFormValues = ref({
  TransactionType: null,
  playerAccountId: props.playerAccountId,
  CashlessTransactionType: null,
})
const playerStore = usePlayerStore()
const { dateTimeFilterValues } = storeToRefs(playerStore)
const transactionTotals = ref([])
const transactionsTotalAmount = ref(0)

const CashlessTransactionTypes = ref([
  {
    value: 'cashdesk',
    label: 'Cashdesk',
  },
  {
    value: 'slotMachine',
    label: 'Slot Machine',
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
    field: 'transactionId',
    label: 'Transaction Id',
  },
  {
    field: 'cashdeskName',
    label: 'Station',
  },
  {
    field: 'amount',
    label: 'Balance',
  },
  {
    field: 'transactionType',
  },
  {
    field: 'currencyName',
    label: 'Currency',
  },
  {
    field: 'createdByName',
    label: 'Station User',
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
